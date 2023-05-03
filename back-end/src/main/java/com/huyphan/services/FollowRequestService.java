package com.huyphan.services;

import com.huyphan.events.FollowRequestAcceptedEvent;
import com.huyphan.events.SendFollowRequestEvent;
import com.huyphan.mediators.IMediator;
import com.huyphan.mediators.MediatorComponent;
import com.huyphan.models.FollowRequest;
import com.huyphan.models.PageOptions;
import com.huyphan.models.User;
import com.huyphan.models.enums.FollowRequestDirection;
import com.huyphan.models.enums.FollowRequestStatus;
import com.huyphan.models.exceptions.AppException;
import com.huyphan.repositories.FollowRequestRepository;
import com.huyphan.services.followactioninvoker.IFollowActionInvoker;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class FollowRequestService implements MediatorComponent {

    @Autowired
    private FollowRequestRepository followRequestRepo;

    @Autowired
    private IFollowActionInvoker followActionInvoker;
    @Autowired
    private UserService userService;

    private IMediator mediator;

    @Transactional(rollbackFor = {AppException.class})
    public void sendFollowRequest(Long receiverId) throws AppException {
        User sender = UserService.getUser();
        User receiver = userService.getUserById(receiverId);
        validateFollowRequestReceiver(receiver);

        FollowRequest followRequest = new FollowRequest();
        followRequest.setSender(sender);
        followRequest.setReceiver(receiver);
        followRequest.setStatus(FollowRequestStatus.PENDING);
        FollowRequest savedFollowRequest = followRequestRepo.save(followRequest);
        mediator.notify(new SendFollowRequestEvent(
                receiver,
                savedFollowRequest.getId()
        ));
    }

    private void validateFollowRequestReceiver(User receiver) throws AppException {
        User sender = UserService.getUser();

        if (receiver.equals(sender)) {
            throw new AppException("Can't send follow request to yourself");
        }

        if (receiver.isFollowed()) {
            throw new AppException("You already followed this user");
        }

        if (!receiver.getIsPrivate()) {
            throw new AppException("User profile is not private");
        }

        FollowRequest existingRequest = followRequestRepo.findBySenderAndReceiverAndStatus(
                sender,
                receiver,
                FollowRequestStatus.PENDING
        );

        if (existingRequest != null && existingRequest.getStatus() == FollowRequestStatus.PENDING) {
            throw new AppException("There is already an pending request for this receiver");
        }
    }

    @Transactional(rollbackFor = {AppException.class})
    public void acceptRequest(Long requestId) throws AppException {
        FollowRequest followRequest = getReceivedRequest(requestId);

        if (followRequest.getStatus() != FollowRequestStatus.PENDING) {
            throw new AppException("This request is already accepted or declined");
        }

        followActionInvoker.follow(followRequest.getSender(), followRequest.getReceiver());
        followRequest.setStatus(FollowRequestStatus.ACCEPTED);
        mediator.notify(new FollowRequestAcceptedEvent(followRequest.getSender()));
    }

    @Transactional(rollbackFor = {AppException.class})
    public void declineRequest(Long requestId) throws AppException {
        FollowRequest followRequest = getReceivedRequest(requestId);

        if (followRequest.getStatus() != FollowRequestStatus.PENDING) {
            throw new AppException("This request is already accepted or declined");
        }

        followRequest.setStatus(FollowRequestStatus.DECLINED);
    }

    @Transactional(rollbackFor = {AppException.class})
    public void deleteRequest(Long requestId) throws AppException {
        User currentUser = UserService.getUser();
        FollowRequest followRequest = getById(requestId);

        if (!followRequest.getSender().equals(currentUser) && !followRequest.getReceiver()
                .equals(currentUser)) {
            throw new AppException("Can't delete this request");
        }

        followRequestRepo.delete(followRequest);
    }

    @Transactional(rollbackFor = {AppException.class})
    public void cancelRequest(Long receiverId) throws AppException {
        User receiver = userService.getUserWithoutDerivedFieldsById(receiverId);
        FollowRequest followRequest = followRequestRepo.findBySenderAndReceiverAndStatus(
                UserService.getUser(),
                receiver,
                FollowRequestStatus.PENDING
        );

        if (followRequest == null) {
            throw new AppException("Request not found");
        }

        followRequestRepo.delete(followRequest);
    }

    public Slice<FollowRequest> getRequests(FollowRequestDirection direction,
            PageOptions pageOptions) {
        Pageable pageable = PageRequest.of(pageOptions.getPage(), pageOptions.getSize());

        if (direction == FollowRequestDirection.SENT) {
            return followRequestRepo.findBySenderOrderByIdDesc(
                    UserService.getUser(),
                    pageable
            );
        }

        return followRequestRepo.findByReceiverOrderByIdDesc(
                UserService.getUser(),
                pageable
        );
    }

    public Slice<FollowRequest> getRequests(FollowRequestDirection direction,
            FollowRequestStatus status,
            PageOptions pageOptions) {
        Pageable pageable = PageRequest.of(pageOptions.getPage(), pageOptions.getSize());

        if (direction == FollowRequestDirection.SENT) {
            return followRequestRepo.findBySenderAndStatusOrderByIdDesc(
                    UserService.getUser(),
                    status,
                    pageable
            );
        }

        return followRequestRepo.findByReceiverAndStatusOrderByIdDesc(
                UserService.getUser(),
                status,
                pageable
        );
    }

    public FollowRequest getRequest(Long id) throws AppException {
        return getReceivedRequest(id);
    }

    private FollowRequest getById(Long requestId) throws AppException {
        return followRequestRepo.findById(requestId)
                .orElseThrow(() -> new AppException(
                        "Follow request not found"
                ));

    }

    private FollowRequest getReceivedRequest(Long requestId) throws AppException {
        User currentUser = UserService.getUser();
        FollowRequest followRequest = getById(requestId);

        if (!followRequest.getReceiver().equals(currentUser)) {
            throw new AppException("Follow request not found");
        }

        return followRequest;
    }

    private FollowRequest getSentRequest(Long requestId) throws AppException {
        User currentUser = UserService.getUser();
        FollowRequest followRequest = getById(requestId);

        if (!followRequest.getSender().equals(currentUser)) {
            throw new AppException("Follow request not found");
        }

        return followRequest;
    }

    public void setMediator(IMediator mediator) {
        this.mediator = mediator;
    }
}
