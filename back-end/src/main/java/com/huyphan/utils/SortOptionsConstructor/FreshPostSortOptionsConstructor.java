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
        return Sort.by(Order.desc(PostSortField.UploadTime.getValue()),
                Order.desc(PostSortField.Upvotes.getValue()));
    }

    @Override
    public PostTag getPostTag() {
        return PostTag.FRESH;
    }
}