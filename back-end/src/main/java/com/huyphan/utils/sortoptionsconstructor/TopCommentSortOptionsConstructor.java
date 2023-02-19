package com.huyphan.utils.sortoptionsconstructor;

import com.huyphan.models.Comment_;
import com.huyphan.models.enums.CommentSortField;
import com.huyphan.models.enums.SortType;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.data.domain.Sort.Order;
import org.springframework.data.jpa.domain.JpaSort;
import org.springframework.stereotype.Component;

@Component
@Qualifier("comment-sort-options-constructor")
public class TopCommentSortOptionsConstructor implements SortOptionsConstructor {

    @Override
    public Sort constructSortOptions() {
        return Sort.by(
                Order.desc(Comment_.UPVOTES)
        ).and(
                JpaSort.unsafe(Direction.DESC,
                                "(" + CommentSortField.TOTAL_CHILDREN.getValue() + ")")
                        .andUnsafe(
                                Direction.DESC
                                , Comment_.ID
                        )
        );
    }

    @Override
    public SortType getSortType() {
        return SortType.TOP;
    }
}
