package com.huyphan.utils;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.AwsCredentialsProvider;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.regions.providers.AwsRegionProvider;
import software.amazon.awssdk.services.rekognition.RekognitionClient;
import software.amazon.awssdk.services.ses.SesClient;

@Configuration
public class AWSConfig {
    @Value("${aws.access-key-id}") private String accessKeyId;
    @Value("${aws.secret-access-key}") private String secretAccessKey;
    @Value("${aws.region}") private String awsRegion;

    @Bean
    public RekognitionClient amazonRekognition() {
        return RekognitionClient.builder()
                .region(Region.of(awsRegion))
                .credentialsProvider(awsCredentialsProvider())
                .build();
    }

    @Bean
    public SesClient sesClient(){
        return SesClient.builder()
                .region(Region.of(awsRegion))
                .credentialsProvider(awsCredentialsProvider())
                .build();
    }

    @Bean
    public AwsCredentialsProvider awsCredentialsProvider() {
        return StaticCredentialsProvider.create(
                AwsBasicCredentials.create(
                        accessKeyId,
                        secretAccessKey
                )
        );
    }

    @Bean
    public AwsRegionProvider awsRegionProvider() {
        return () -> Region.of(awsRegion);
    }
}
