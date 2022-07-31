package com.huyphan.dtos;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class PageDto<T> extends SliceDto<T> {

    private int totalPages;
    private int totalElements;
}
