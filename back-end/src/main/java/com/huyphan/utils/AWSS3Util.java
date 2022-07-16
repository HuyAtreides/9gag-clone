package com.huyphan.utils;

import java.io.IOException;
import java.time.Instant;
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
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.model.PutObjectResponse;

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
    @Value("${aws.s3.bucket_name}")
    private String bucketName;

    public AWSS3Util(@Value("${aws.access_key_id}") String keyId,
            @Value("${aws.secret_access_key}") String accessKey,
            @Value("${aws.region}") String awsRegion) {
        this.accessKeyId = keyId;
        this.secretAccessKey = accessKey;
        this.awsRegion = awsRegion;
        this.s3Client = buildS3Client();
    }

    /**
     * Upload an object to AWS S3.
     *
     * @return An url to access the object.
     */
    public String uploadObject(MultipartFile multipartFile) throws IOException {
        String objectKey = generateObjectKey(multipartFile);
        PutObjectRequest putObjectRequest = PutObjectRequest.builder().bucket(bucketName)
                .key(objectKey).build();
        RequestBody requestBody = RequestBody.fromBytes(multipartFile.getBytes());
        PutObjectResponse response = s3Client.putObject(putObjectRequest, requestBody);

        return buildObjectUrl(objectKey);
    }

    private String generateObjectKey(MultipartFile multipartFile) {
        Instant instant = Instant.now();
        String fileName = multipartFile.getOriginalFilename().replace(" ", "_");
        return instant.getNano() + "-" + fileName;
    }

    /**
     * Build S3 Transfer Manager instance.
     */
    private S3Client buildS3Client() {
        AwsCredentials awsCredentials = AwsBasicCredentials.create(
                accessKeyId,
                secretAccessKey);

        return S3Client.builder().credentialsProvider(
                StaticCredentialsProvider.create(awsCredentials)
        ).region(Region.AP_EAST_1).build();
    }

    private String buildObjectUrl(String objectKey) {
        return String.format("https://%s.s3.%s.amazonaws.com/%s", bucketName,
                awsRegion, objectKey);
    }
}
