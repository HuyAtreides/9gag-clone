package com.huyphan.utils;

import java.io.IOException;
import java.io.InputStream;
import java.util.List;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.SdkBytes;
import software.amazon.awssdk.services.rekognition.RekognitionClient;
import software.amazon.awssdk.services.rekognition.model.DetectModerationLabelsRequest;
import software.amazon.awssdk.services.rekognition.model.GetContentModerationRequest;
import software.amazon.awssdk.services.rekognition.model.Image;
import software.amazon.awssdk.services.rekognition.model.InvalidImageFormatException;
import software.amazon.awssdk.services.rekognition.model.ModerationLabel;
import software.amazon.awssdk.services.rekognition.model.NotificationChannel;
import software.amazon.awssdk.services.rekognition.model.S3Object;
import software.amazon.awssdk.services.rekognition.model.StartContentModerationRequest;
import software.amazon.awssdk.services.rekognition.model.StartContentModerationResponse;
import software.amazon.awssdk.services.rekognition.model.Video;

@Component
@Slf4j
public class AWSRekognition {

    @Autowired
    private RekognitionClient rekognition;

    @Value("${aws.s3.bucket-name}")
    private String bucketName;

    @Value("${aws.rekognition.notification-channel.role-arn}")
    private String notificationChannelRoleArn;

    @Value("${aws.rekognition.notification-channel.sns-topic-arn}")
    private String notificationChannelSNSTopicArn;

    public boolean isNSFW(MultipartFile multipartFile) {
        try {
            List<ModerationLabel> moderationLabels = moderateContent(multipartFile);

            log.info("result={}", moderationLabels.toString());

            moderationLabels.forEach(moderationLabel -> {
                log.info("moderation_label={}", moderationLabel.toString());
            });

            return !moderationLabels.isEmpty();
        }
        catch (InvalidImageFormatException exception) {
            return false;
        }
    }

    public void startModerateVideoJob(String objectKey, String objectUrl) {
        log.info("method=startModerateVideoJob, objectKey={}", objectKey);

        StartContentModerationResponse response = rekognition.startContentModeration(
                StartContentModerationRequest.builder()
                        .video(Video.builder()
                                .s3Object(
                                        S3Object.builder()
                                                .bucket(bucketName)
                                                .name(objectKey)
                                                .build()
                                )
                                .build()
                        )
                        .jobTag(objectUrl)
                        .minConfidence(70F)
                        .notificationChannel(
                                NotificationChannel.builder()
                                        .roleArn(notificationChannelRoleArn)
                                        .snsTopicArn(notificationChannelSNSTopicArn)
                                        .build()
                        )
                        .build()
        );

        log.info("job_id={}", response.jobId());
    }

    private List<ModerationLabel> moderateContent(MultipartFile multipartFile) {
        InputStream sourceStream = null;
        try {
            sourceStream = multipartFile.getInputStream();
        } catch (IOException e) {
            throw new RuntimeException(e);
        }

        SdkBytes sourceBytes = SdkBytes.fromInputStream(sourceStream);

        return rekognition.detectModerationLabels(
                DetectModerationLabelsRequest.builder()
                        .minConfidence(70F)
                        .image(
                                Image.builder()
                                        .bytes(sourceBytes)
                                        .build()
                        )
                        .build()
        ).moderationLabels();
    }
}
