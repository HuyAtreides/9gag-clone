package com.huyphan.dtos;

import lombok.Getter;
import lombok.Setter;
import org.springframework.lang.Nullable;

/**
 * Page options DTO.
 */
@Getter
@Setter
public class PageOptionsDto {

    private int page;
    private int size;

    @Nullable
    private String search;
}
