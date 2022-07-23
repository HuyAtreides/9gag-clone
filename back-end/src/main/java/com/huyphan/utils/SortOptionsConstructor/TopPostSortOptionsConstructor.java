package com.huyphan.utils.SortOptionsConstructor;

import com.huyphan.models.enums.PostTag;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Sort.Order;
import org.springframework.stereotype.Component;

/**
 * Construct the sort options for posts which has hot tag.
 */
@Component
public class TopPostSortOptionsConstructor implements SortOptionsConstructor {

    @Override
    public Sort constructSortOptions() {
        return Sort.by(Order.desc("upvotes"), Order.desc("totalComments"));
    }

    @Override
    public PostTag getPostTag() {
        return PostTag.TOP;
    }
}
