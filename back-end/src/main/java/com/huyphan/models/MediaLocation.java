package com.huyphan.models;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Contains information of a media such as url and mime type
 */
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class MediaLocation {

    private String url;

    private String type;
}
