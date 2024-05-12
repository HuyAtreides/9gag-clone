package com.huyphan.utils;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.huyphan.services.ContentModerationService;
import io.awspring.cloud.sqs.annotation.SqsListener;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import software.amazon.awssdk.services.sqs.model.Message;

@Component
@Slf4j
@AllArgsConstructor
public class AwsSQS {

    private final AWSRekognition rekognition;

    private final List<ContentModerationService> contentModerationServices;

    @SqsListener("${aws.sqs.queue}")
    public void handleContentModerationMessage(String message) throws JsonProcessingException {
        ObjectMapper objectMapper = new ObjectMapper();
        JsonNode jsonNode = objectMapper.readTree(message);
        String job = jsonNode.get("Message").asText();
        JsonNode jobAsJson = objectMapper.readTree(job);
        String jobId = jobAsJson.get("JobId").asText();
        String jobTag = jobAsJson.get("JobTag").asText();
        boolean isNSFW = rekognition.isNSFW(jobId);
        log.info("method=handleContentModerationMessage, is_nsfw={}", isNSFW);

        for (ContentModerationService service: contentModerationServices) {
            service.updateContentModerationStatus(isNSFW, jobTag);
        }
    }
}
