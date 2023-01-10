package com.huyphan.utils.sortoptionsconstructor;

import com.huyphan.models.Post_;
import com.huyphan.models.enums.PostSortField;
import com.huyphan.models.enums.SortType;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.data.domain.Sort.Order;
import org.springframework.data.jpa.domain.JpaSort;
import org.springframework.stereotype.Component;

/**
 * Construct the sort options for posts which has hot tag.
 */
@Component
public class TopPostSortOptionsConstructor implements SortOptionsConstructor {

    @Override
    public Sort constructSortOptions() {
        return Sort.by(
                Order.desc(Post_.UPVOTES)
        ).and(
                JpaSort.unsafe(Direction.DESC, "(" + PostSortField.TOTAL_COMMENTS.getValue() + ")")
                        .andUnsafe(
                                Direction.DESC
                                , Post_.ID
                        )
        );
    }

    @Override
    public SortType getSortType() {
        return SortType.TOP;
    }
}
