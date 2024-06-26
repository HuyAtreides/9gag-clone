package com.huyphan.utils;

import com.huyphan.models.MediaLocation;
import com.huyphan.models.enums.SupportedMIMEType;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.Base64;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.beans.factory.config.ConfigurableBeanFactory;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.AwsCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.cloudfront.CloudFrontClient;
import software.amazon.awssdk.services.cloudfront.model.CreateInvalidationRequest;
import software.amazon.awssdk.services.cloudfront.model.InvalidationBatch;
import software.amazon.awssdk.services.cloudfront.model.Paths;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.DeleteObjectRequest;
import software.amazon.awssdk.services.s3.model.GetObjectRequest;
import software.amazon.awssdk.services.s3.model.ObjectCannedACL;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

/**
 * Provide methods for working with AWS S3.
 */
@Component
@Scope(value = ConfigurableBeanFactory.SCOPE_SINGLETON)
public class AWSS3Util {

    private final S3Client s3Client;
    private final String accessKeyId;
    private final String secretAccessKey;
    private final String awsRegion;

    private final CloudFrontClient cloudFrontClient;

    @Autowired
    private AWSRekognition awsRekognition;

    @Value("${aws.s3.bucket-name}")
    private String bucketName;

    @Value("${aws.cloud-front.distribution-domain-name}")
    private String cloudFrontDomainName;

    @Value("${aws.cloud-front.distribution-id}")
    private String distributionId;

    public AWSS3Util(@Value("${aws.access-key-id}") String keyId,
            @Value("${aws.secret-access-key}") String accessKey,
            @Value("${aws.region}") String awsRegion) {
        this.accessKeyId = keyId;
        this.secretAccessKey = accessKey;
        this.awsRegion = awsRegion;
        this.s3Client = buildS3Client();
        this.cloudFrontClient = buildCloudFrontClient();
    }

    /**
     * Upload an object to AWS S3.
     *
     * @return A location to access the object.
     */
    public MediaLocation uploadObject(MultipartFile multipartFile)
            throws IOException {
        String objectKey = generateObjectKey(multipartFile);
        String type = multipartFile.getContentType();
        PutObjectRequest putObjectRequest = PutObjectRequest.builder().bucket(bucketName)
                .key(objectKey).acl(ObjectCannedACL.PUBLIC_READ).build();

        boolean isVideo = SupportedMIMEType.isVideoType(type);
        RequestBody requestBody = RequestBody.fromBytes(multipartFile.getBytes());
        s3Client.putObject(putObjectRequest, requestBody);
        String objectUrl = buildObjectUrl(objectKey);

        if (isVideo) {
            awsRekognition.startModerateVideoJob(objectKey, objectUrl);
            return new MediaLocation(objectUrl, type, false, true);
        }

        return new MediaLocation(objectUrl, type, awsRekognition.isNSFW(multipartFile), false);
    }

    public void deleteObject(String objectUrl) {
        if (objectUrl == null) {
            return;
        }

        String objectKey = getObjectKeyFromUrl(objectUrl);
        DeleteObjectRequest deleteObjectRequest = DeleteObjectRequest.builder().bucket(bucketName)
                .key(objectKey).build();
        s3Client.deleteObject(deleteObjectRequest);
        createCloudFrontInvalidation(objectKey);
    }

    private void createCloudFrontInvalidation(String objectKey) {
        cloudFrontClient.createInvalidation(
                CreateInvalidationRequest.builder().distributionId(
                        distributionId
                ).invalidationBatch(
                        InvalidationBatch
                                .builder()
                                .callerReference(Instant.now().toString())
                                .paths(
                                        Paths.builder()
                                                .items("/" + objectKey)
                                                .quantity(1)
                                                .build()
                                )
                                .build()
                ).build()
        );
    }

    /**
     * Generate an object key used to uniquely identify an object
     */
    private String generateObjectKey(MultipartFile multipartFile) {
        Instant instant = Instant.now();
        String originalFileName = multipartFile.getOriginalFilename();
        String fileName = Base64.getEncoder().encodeToString(
                originalFileName.getBytes(
                        StandardCharsets.UTF_8
                )
        );
        return instant.getEpochSecond() + "-" + fileName;
    }

    public String getObjectKeyFromUrl(String url) {
        String[] urlSegments = url.split("/");

        return urlSegments[urlSegments.length - 1];
    }

    /**
     * Build S3 Client instance.
     */
    private S3Client buildS3Client() {
        AwsCredentials awsCredentials = AwsBasicCredentials.create(
                accessKeyId,
                secretAccessKey);

        return S3Client.builder().credentialsProvider(
                StaticCredentialsProvider.create(awsCredentials)
        ).region(Region.of(awsRegion)).build();
    }

    private CloudFrontClient buildCloudFrontClient() {
        AwsCredentials awsCredentials = AwsBasicCredentials.create(
                accessKeyId,
                secretAccessKey);

        return CloudFrontClient.builder()
                .credentialsProvider(
                        StaticCredentialsProvider.create(awsCredentials)
                )
                .region(Region.AWS_GLOBAL)
                .build();
    }

    private String constructS3Domain() {
        return String.format("https://%s.s3.%s.amazonaws.com/", bucketName,
                awsRegion);
    }

    public String convertS3URLToCloudFrontURL(String url) {
        if (url == null) {
            return null;
        }

        Pattern pattern = Pattern.compile(constructS3Domain());
        Matcher matcher = pattern.matcher(url);
        String objectKey = getObjectKeyFromUrl(url);

        if (!matcher.find(0)) {
            return url;
        }

        return String.format(cloudFrontDomainName + "%s", objectKey);
    }

    /**
     * Build object url from object key.
     *
     * @param objectKey The key of the object (Uniquely identify an object).
     */
    private String buildObjectUrl(String objectKey) {
        return String.format(cloudFrontDomainName + "%s", objectKey);
    }
}
