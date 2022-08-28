package com.huyphan.utils.sortoptionsconstructor;

import com.huyphan.models.enums.PostTag;
import org.springframework.data.domain.Sort;

public interface SortOptionsConstructor {

    Sort constructSortOptions();

    PostTag getPostTag();
}
