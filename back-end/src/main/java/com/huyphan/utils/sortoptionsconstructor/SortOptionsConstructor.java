package com.huyphan.utils.sortoptionsconstructor;

import com.huyphan.models.enums.SortType;
import org.springframework.data.domain.Sort;

public interface SortOptionsConstructor {

    Sort constructSortOptions();

    SortType getSortType();
}
