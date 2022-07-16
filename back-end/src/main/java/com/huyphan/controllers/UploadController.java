package com.huyphan.controllers;

import com.huyphan.utils.AWSS3Util;
import java.io.IOException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("upload")
public class UploadController {

    @Autowired
    private AWSS3Util awss3Util;

    @GetMapping
    public String get() {
        return "Hello";
    }

    @PostMapping
    public void handleUpload(@RequestParam String title, @RequestParam MultipartFile memeMedia)
            throws IOException {
        System.out.println(title);
        awss3Util.uploadObject(memeMedia);
    }
}
