package com.huyphan.controllers;

import com.huyphan.dtos.NotificationDto;
import com.huyphan.dtos.PageOptionsDto;
import com.huyphan.dtos.SliceDto;
import com.huyphan.mappers.NotificationMapper;
import com.huyphan.mappers.PageOptionMapper;
import com.huyphan.mappers.SliceMapper;
import com.huyphan.models.Notification;
import com.huyphan.models.PageOptions;
import com.huyphan.models.exceptions.AppException;
import com.huyphan.services.notification.NotificationService;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Slice;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
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

    @PutMapping("{id}")
    public void markNotificationAsViewed(@PathVariable Long id) throws AppException {
        notificationService.markNotificationAsViewed(id);
    }

    @GetMapping("count-not-viewed")
    public int countNotViewed() {
        return notificationService.countNotViewedNotification();
    }

    @DeleteMapping
    public void deleteAllNotifications() {
        notificationService.deleteAllNotifications();
    }

    @GetMapping("/latest")
    public List<NotificationDto> getLatestNotifications(
            @RequestParam Long currentLatestId) {
        List<Notification> notificationDtos = notificationService.getLatestNotifications(
                currentLatestId);

        return notificationDtos.stream().map(notificationMapper::toDto)
                .collect(Collectors.toList());
    }
}
