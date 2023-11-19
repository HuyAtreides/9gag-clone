package com.huyphan.utils;

import com.huyphan.models.MediaLocation;
import com.huyphan.models.enums.SupportedMIMEType;
import com.huyphan.models.exceptions.UploadException;
import java.io.IOException;
import java.nio.file.Path;
import java.time.Instant;
import java.util.Arrays;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
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
            throws IOException, UploadException {
        String objectKey = generateObjectKey(multipartFile);
        String type = multipartFile.getContentType();

        if (Arrays.stream(SupportedMIMEType.values())
                .noneMatch(supportedMIMEType -> supportedMIMEType.getValue().equals(type))) {
            throw new UploadException("Unsupported file type");
        }

        PutObjectRequest putObjectRequest = PutObjectRequest.builder().bucket(bucketName)
                .key(objectKey).acl(ObjectCannedACL.PUBLIC_READ).build();

        RequestBody requestBody = RequestBody.fromBytes(multipartFile.getBytes());
        s3Client.putObject(putObjectRequest, requestBody);
        String objectUrl = buildObjectUrl(objectKey);
        return new MediaLocation(objectUrl, type);
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
        String fileName = multipartFile.getOriginalFilename().replace(" ", "_");
        return instant.getEpochSecond() + "-" + fileName;
    }

    private String getObjectKeyFromUrl(String url) {
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
        ).region(Region.AP_EAST_1).build();
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
