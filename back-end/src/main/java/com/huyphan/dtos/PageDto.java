package com.huyphan.dtos;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class PageDto<T> {

    private int size;
    private int pageNumber;
    private int totalPages;
    private T content;
}
