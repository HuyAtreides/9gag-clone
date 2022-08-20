package com.huyphan.services;

import com.huyphan.models.Comment;
import com.huyphan.models.Notification;
import com.huyphan.models.PageOptions;
import com.huyphan.models.Post;
import com.huyphan.models.User;
import com.huyphan.models.builders.AddCommentNotificationBuilder;
import com.huyphan.models.builders.AddReplyNotificationBuilder;
import com.huyphan.models.builders.NotificationBuilder;
import com.huyphan.models.builders.VoteCommentNotificationBuilder;
import com.huyphan.models.builders.VotePostNotificationBuilder;
import com.huyphan.repositories.NotificationRepository;
import java.time.Instant;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Sort.Order;
import org.springframework.stereotype.Service;

@Service
public class NotificationService {

    @Autowired
    private NotificationRepository notificationRepository;
    @Autowired
    private UserService userService;

    public Slice<Notification> getNotifications(PageOptions options) {
        Sort sort = Sort.by(Order.desc("created"));
        Pageable pageable = PageRequest.of(options.getPage(), options.getSize(), sort);
        User user = userService.getUser();

        return notificationRepository.findByUserId(user.getId(), pageable);
    }

    public void addVotePostNotification(Post post) {
        NotificationBuilder notificationBuilder = new VotePostNotificationBuilder(post);
        Notification notification = notificationBuilder.build();

        notificationRepository.save(notification);
    }

    public void addVoteCommentNotification(Comment comment) {
        NotificationBuilder notificationBuilder = new VoteCommentNotificationBuilder(comment);
        Notification notification = notificationBuilder.build();

        notificationRepository.save(notification);
    }

    public void addAddCommentNotification(Comment comment) {
        NotificationBuilder notificationBuilder = new AddCommentNotificationBuilder(comment);
        Notification notification = notificationBuilder.build();

        notificationRepository.save(notification);
    }

    public void addAddReplyNotification(Comment comment) {
        NotificationBuilder notificationBuilder = new AddReplyNotificationBuilder(comment);
        Notification notification = notificationBuilder.build();

        notificationRepository.save(notification);
    }


    public void markAllNotificationsAsViewed() {
        User user = userService.getUser();
        notificationRepository.markAllAsViewed(user.getId());
    }

    public void deleteAllNotifications() {
        User user = userService.getUser();
        notificationRepository.deleteAllByUserId(user.getId());
    }

    public List<Notification> getLatestNotifications(Instant targetDate) {
        return notificationRepository.findByCreatedGreaterThan(targetDate);
    }
}
