package com.huyphan.dtos;

import lombok.Getter;
import lombok.Setter;

/**
 * Page options DTO.
 */
@Getter
@Setter
public class PageOptionsDto {

    private int page;
    private int size;
    private String search;
}
