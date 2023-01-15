package com.huyphan.utils.sortoptionsconstructor;

import com.huyphan.models.Post_;
import com.huyphan.models.enums.PostSortField;
import com.huyphan.models.enums.SortType;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.data.domain.Sort.Order;
import org.springframework.data.jpa.domain.JpaSort;
import org.springframework.stereotype.Component;

@Component
public class FreshPostSortOptionsConstructor implements SortOptionsConstructor {

    @Override
    public Sort constructSortOptions() {
        return Sort.by(
                Order.desc(Post_.ID),
                Order.desc(Post_.UPVOTES)
        ).and(
                JpaSort.unsafe(Direction.DESC, "(" + PostSortField.TOTAL_COMMENTS.getValue() + ")")
        );
    }

    @Override
    public SortType getSortType() {
        return SortType.FRESH;
    }
}
