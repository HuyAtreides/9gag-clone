package com.huyphan.models;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Options for paging.
 */
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class PageOptions {

    private int page;
    private int size;
    private String search;
}
