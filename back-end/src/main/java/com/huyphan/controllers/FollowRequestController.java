package com.huyphan.controllers;

import com.huyphan.dtos.FollowRequestDto;
import com.huyphan.dtos.PageOptionsDto;
import com.huyphan.dtos.SliceDto;
import com.huyphan.mappers.FollowRequestMapper;
import com.huyphan.mappers.PageOptionMapper;
import com.huyphan.mappers.SliceMapper;
import com.huyphan.models.FollowRequest;
import com.huyphan.models.PageOptions;
import com.huyphan.models.enums.FollowRequestDirection;
import com.huyphan.models.enums.FollowRequestStatus;
import com.huyphan.models.exceptions.AppException;
import com.huyphan.models.exceptions.CommentException;
import com.huyphan.models.exceptions.PostException;
import com.huyphan.services.FollowRequestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Slice;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("follow-request")
public class FollowRequestController {

    @Autowired
    private FollowRequestService followRequestService;

    @Autowired
    private FollowRequestMapper followRequestMapper;

    @Autowired
    private SliceMapper<FollowRequestDto, FollowRequest> sliceMapper;

    @Autowired
    private PageOptionMapper pageOptionMapper;

    @PutMapping("accept/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void acceptRequest(@PathVariable Long id) throws AppException {
        followRequestService.acceptRequest(id);
    }

    @PutMapping("decline/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void declineRequest(@PathVariable Long id) throws AppException {
        followRequestService.declineRequest(id);
    }

    @DeleteMapping("{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteRequest(@PathVariable Long id) throws AppException {
        followRequestService.deleteRequest(id);
    }

    @PutMapping("cancel/{receiverId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void cancelRequest(@PathVariable Long receiverId) throws AppException {
        followRequestService.cancelRequest(receiverId);
    }

    @GetMapping("{id}")
    public FollowRequestDto getRequest(@PathVariable Long id) throws AppException {
        FollowRequest followRequest = followRequestService.getRequest(id);

        return followRequestMapper.toDto(followRequest);
    }

    @GetMapping("direction/{direction}")
    public SliceDto<FollowRequestDto> getRequests(
            @PathVariable FollowRequestDirection direction,
            PageOptionsDto pageOptionsDto
    ) {
        PageOptions pageOptions = pageOptionMapper.fromDto(pageOptionsDto);
        Slice<FollowRequest> slice = followRequestService.getRequests(direction, pageOptions);

        return sliceMapper.toDto(slice, followRequestMapper);
    }

    @PutMapping("send/{receiverId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void sendFollowRequest(@PathVariable Long receiverId) throws AppException {
        followRequestService.sendFollowRequest(receiverId);
    }


    @GetMapping("direction/{direction}/status/{status}")
    public SliceDto<FollowRequestDto> getRequests(
            @PathVariable FollowRequestDirection direction,
            @PathVariable FollowRequestStatus status,
            PageOptionsDto pageOptionsDto
    ) {
        PageOptions pageOptions = pageOptionMapper.fromDto(pageOptionsDto);
        Slice<FollowRequest> slice = followRequestService.getRequests(direction, status, pageOptions);

        return sliceMapper.toDto(slice, followRequestMapper);
    }

    @ExceptionHandler({AppException.class})
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public AppException handleExceptions(AppException exception) {
        return exception;
    }

}
