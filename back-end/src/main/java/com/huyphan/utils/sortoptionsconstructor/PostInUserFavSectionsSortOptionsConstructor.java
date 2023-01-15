package com.huyphan.utils.sortoptionsconstructor;

import com.huyphan.models.enums.PostSortField.Constants;
import com.huyphan.models.enums.SortType;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.data.jpa.domain.JpaSort;
import org.springframework.stereotype.Component;

@Component
public class PostInUserFavSectionsSortOptionsConstructor implements SortOptionsConstructor {

    @Override
    public Sort constructSortOptions() {
        return JpaSort.unsafe(Direction.DESC,
                "(" + Constants.IS_IN_USER_FAV_SECTIONS + ")");
    }

    @Override
    public SortType getSortType() {
        return SortType.USER_FAV_SECTIONS;
    }
}
