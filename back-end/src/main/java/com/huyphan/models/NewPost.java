package com.huyphan.models;

import lombok.Getter;
import lombok.Setter;

/**
 * Information required to add new post.
 */
@Getter
@Setter
public class NewPost {

    private String title;

    private String mediaUrl;

    private String mediaType;

    private Section section;

    private String tags;
}
