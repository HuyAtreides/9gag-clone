package com.huyphan.dtos;

import lombok.Getter;
import lombok.Setter;
import org.springframework.lang.Nullable;

/**
 * Section DTO.
 */
@Getter
@Setter
public class SectionDto {

    @Nullable
    private Long id;

    private String name;

    private String imgUrl;
}
