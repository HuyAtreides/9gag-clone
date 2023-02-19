package com.huyphan.models;

import com.huyphan.models.enums.SortType;
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
    private SortType sortType;
}
