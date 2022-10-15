package com.huyphan.controllers;

import com.huyphan.dtos.NotificationDto;
import com.huyphan.dtos.PageOptionsDto;
import com.huyphan.dtos.SliceDto;
import com.huyphan.mappers.NotificationMapper;
import com.huyphan.mappers.PageOptionMapper;
import com.huyphan.mappers.SliceMapper;
import com.huyphan.models.Notification;
import com.huyphan.models.PageOptions;
import com.huyphan.services.NotificationService;
import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Slice;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.format.annotation.DateTimeFormat.ISO;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("notification")
public class NotificationController {

    @Autowired
    private SliceMapper<NotificationDto, Notification> sliceMapper;

    @Autowired
    private NotificationMapper notificationMapper;

    @Autowired
    private PageOptionMapper pageOptionMapper;

    @Autowired
    private NotificationService notificationService;

    @GetMapping
    public SliceDto<NotificationDto> getNotifications(PageOptionsDto pageOptionsDto) {
        PageOptions pageOptions = pageOptionMapper.fromDto(pageOptionsDto);
        Slice<Notification> slice = notificationService.getNotifications(pageOptions);

        return sliceMapper.toDto(slice, notificationMapper);
    }

    @PutMapping
    public void markAllNotificationsAsViewed() {
        notificationService.markAllNotificationsAsViewed();
    }

    @DeleteMapping
    public void deleteAllNotifications() {
        notificationService.deleteAllNotifications();
    }

    @GetMapping("/latest")
    public List<NotificationDto> getLatestNotifications(
            @RequestParam @DateTimeFormat(iso = ISO.DATE_TIME) Instant targetDate) {
        List<Notification> notificationDtos = notificationService.getLatestNotifications(
                targetDate);

        return notificationDtos.stream().map(notificationMapper::toDto)
                .collect(Collectors.toList());
    }
}
