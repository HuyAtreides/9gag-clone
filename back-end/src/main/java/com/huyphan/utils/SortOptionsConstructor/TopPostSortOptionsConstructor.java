package com.huyphan.utils.SortOptionsConstructor;

import com.huyphan.models.enums.PostSortField;
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
        return Sort.by(Order.desc(PostSortField.UPVOTES.getValue()),
                Order.desc(PostSortField.TOTAL_COMMENTS.getValue()));
    }

    @Override
    public PostTag getPostTag() {
        return PostTag.TOP;
    }
}
