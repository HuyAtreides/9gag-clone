package com.huyphan.utils;

import java.io.IOException;
import java.io.InputStream;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.SdkBytes;
import software.amazon.awssdk.services.rekognition.RekognitionClient;
import software.amazon.awssdk.services.rekognition.model.DetectModerationLabelsRequest;
import software.amazon.awssdk.services.rekognition.model.Image;
import software.amazon.awssdk.services.rekognition.model.InvalidImageFormatException;
import software.amazon.awssdk.services.rekognition.model.ModerationLabel;

@Component
@Slf4j
@AllArgsConstructor
public class AWSRekognition {

    @Autowired
    private final RekognitionClient rekognition;


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
