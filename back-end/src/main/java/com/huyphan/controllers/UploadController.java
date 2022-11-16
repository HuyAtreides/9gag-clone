package com.huyphan.controllers;

import com.huyphan.dtos.MediaLocationDto;
import com.huyphan.mappers.MediaLocationMapper;
import com.huyphan.models.MediaLocation;
import com.huyphan.models.exceptions.AppException;
import com.huyphan.models.exceptions.UploadException;
import com.huyphan.utils.AWSS3Util;
import java.io.IOException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("upload")
public class UploadController {

    @Autowired
    private AWSS3Util awss3Util;

    @Autowired
    private MediaLocationMapper mediaLocationMapper;

    @PostMapping
    public MediaLocationDto handleUpload(@RequestParam MultipartFile file)
            throws IOException, UploadException {
        MediaLocation mediaLocation = awss3Util.uploadObject(file);

        return mediaLocationMapper.toDto(mediaLocation);
    }

    @ExceptionHandler(UploadException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public AppException handleExceptions(UploadException exception) {
        return exception;
    }
}
