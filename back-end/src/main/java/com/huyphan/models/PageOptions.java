package com.huyphan.models;

import lombok.Getter;
import lombok.Setter;

/**
 * Options for paging.
 */
@Getter
@Setter
public class PageOptions {

    private int page;
    private int size;
    private String search;
}
