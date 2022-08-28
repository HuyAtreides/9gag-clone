package com.huyphan.utils.SortOptionsConstructor;

import com.huyphan.models.enums.PostSortField;
import com.huyphan.models.enums.PostTag;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Sort.Order;
import org.springframework.stereotype.Component;

@Component
public class FreshPostSortOptionsConstructor implements SortOptionsConstructor {

    @Override
    public Sort constructSortOptions() {
        return Sort.by(Order.desc(PostSortField.UPLOAD_TIME.getValue()),
                Order.desc(PostSortField.UPVOTES.getValue()));
    }

    @Override
    public PostTag getPostTag() {
        return PostTag.FRESH;
    }
}
