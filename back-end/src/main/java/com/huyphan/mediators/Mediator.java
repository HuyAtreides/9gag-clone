package com.huyphan.mediators;

import com.huyphan.events.AddPostEvent;
import com.huyphan.events.AddReplyEvent;
import com.huyphan.events.AppEvent;
import com.huyphan.events.CreateCommentEvent;
import com.huyphan.events.DeletePostEvent;
import com.huyphan.events.FollowEvent;
import com.huyphan.events.FollowRequestAcceptedEvent;
import com.huyphan.events.SendFollowRequestEvent;
import com.huyphan.events.VoteCommentEvent;
import com.huyphan.events.VotePostEvent;
import com.huyphan.models.Comment;
import com.huyphan.models.FollowRequest;
import com.huyphan.models.Post;
import com.huyphan.models.User;
import com.huyphan.models.enums.EventType;
import com.huyphan.models.exceptions.AppException;
import com.huyphan.services.CommentService;
import com.huyphan.services.FollowRequestService;
import com.huyphan.services.PostService;
import com.huyphan.services.UserService;
import com.huyphan.services.notification.NotificationSender;
import com.huyphan.services.notification.payload.AddCommentNotificationPayload;
import com.huyphan.services.notification.payload.AddPostNotificationPayload;
import com.huyphan.services.notification.payload.AddReplyNotificationPayload;
import com.huyphan.services.notification.payload.FollowRequestAcceptedNotificationPayload;
import com.huyphan.services.notification.payload.FollowUserNotificationPayload;
import com.huyphan.services.notification.payload.FollowingCommentHasNewReplyNotificationPayload;
import com.huyphan.services.notification.payload.FollowingPostHasNewCommentNotificationPayload;
import com.huyphan.services.notification.payload.SendFollowRequestNotificationPayload;
import com.huyphan.services.notification.payload.VoteCommentNotificationPayload;
import com.huyphan.services.notification.payload.VotePostNotificationPayload;
import javax.annotation.PostConstruct;
import lombok.Setter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component("mediator")
@Setter
public class Mediator implements IMediator {

    @Autowired
    private CommentService commentService;
    @Autowired
    private PostService postService;
    @Autowired
    private NotificationSender notificationSender;
    @Autowired
    private UserService userService;

    @Autowired
    private FollowRequestService followRequestService;

    @Override
    public void notify(AppEvent event) throws AppException {

        try {
            if (event.getEventType() == EventType.DELETE_POST) {
                Long postId = ((DeletePostEvent) event).getPostId();
                commentService.deleteCommentOfPosts(postId);
                return;
            }

            if (event.getEventType() == EventType.CREATE_COMMENT) {
                CreateCommentEvent createCommentEvent = (CreateCommentEvent) event;
                Comment comment = createCommentEvent.getComment();
                postService.addNewComment(createCommentEvent.getPostId(), comment);
                notificationSender.send(new AddCommentNotificationPayload(comment));
                notificationSender.send(new FollowingPostHasNewCommentNotificationPayload(comment));
                return;
            }

            if (event.getEventType() == EventType.VOTE_COMMENT) {
                VoteCommentEvent voteCommentEvent = (VoteCommentEvent) event;
                Comment comment = voteCommentEvent.getComment();
                notificationSender.send(new VoteCommentNotificationPayload(comment));
                return;
            }

            if (event.getEventType() == EventType.ADD_REPLY) {
                AddReplyEvent addReplyEvent = (AddReplyEvent) event;
                Comment comment = addReplyEvent.getReply();
                notificationSender.send(new AddReplyNotificationPayload(comment));
                notificationSender.send(
                        new FollowingCommentHasNewReplyNotificationPayload(comment));
                return;
            }

            if (event.getEventType() == EventType.VOTE_POST) {
                VotePostEvent votePostEvent = (VotePostEvent) event;
                Post post = votePostEvent.getPost();
                notificationSender.send(new VotePostNotificationPayload(post));
                return;
            }

            if (event.getEventType() == EventType.ADD_POST) {
                AddPostEvent addPostEvent = (AddPostEvent) event;
                Post post = addPostEvent.getPost();
                notificationSender.send(new AddPostNotificationPayload(post));
                return;
            }

            if (event.getEventType() == EventType.FOLLOW_USER) {
                FollowEvent followEvent = (FollowEvent) event;
                User user = followEvent.getFollowedUser();
                notificationSender.send(new FollowUserNotificationPayload(user));
                return;
            }

            if (event.getEventType() == EventType.SEND_FOLLOW_REQUEST) {
                SendFollowRequestEvent sendFollowRequestEvent = (SendFollowRequestEvent) event;
                User receiver = sendFollowRequestEvent.getReceiver();
                Long requestId = sendFollowRequestEvent.getRequestId();
                notificationSender.send(new SendFollowRequestNotificationPayload(
                        receiver,
                        requestId
                ));
                return;
            }

            if (event.getEventType() == EventType.FOLLOW_REQUEST_ACCEPTED) {
                FollowRequestAcceptedEvent sendFollowRequestEvent = (FollowRequestAcceptedEvent) event;
                User sender = sendFollowRequestEvent.getRequestSender();
                notificationSender.send(new FollowRequestAcceptedNotificationPayload(sender));
            }

        } catch (Exception exception) {
            throw new AppException(exception.getMessage());
        }
    }

    @PostConstruct
    public void setMediatorToServices() {
        this.commentService.setMediator(this);
        this.postService.setMediator(this);
        this.userService.setMediator(this);
        this.followRequestService.setMediator(this);
    }

}
