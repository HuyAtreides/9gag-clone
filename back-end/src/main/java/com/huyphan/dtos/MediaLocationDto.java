package com.huyphan.dtos;

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
public class MediaLocationDto {

    private String url;

    private String type;
}