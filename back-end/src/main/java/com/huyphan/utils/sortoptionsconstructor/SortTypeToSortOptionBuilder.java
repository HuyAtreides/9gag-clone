package com.huyphan.utils.sortoptionsconstructor;

import com.huyphan.models.enums.SortType;
import com.huyphan.models.exceptions.AppException;
import java.util.Arrays;
import java.util.List;
import org.springframework.data.domain.Sort;

public abstract class SortTypeToSortOptionBuilder {

    public abstract Sort toSortOption(List<SortType> sortTypes) throws AppException;

    public Sort toSortOption(SortType... sortTypes) throws AppException {
        return toSortOption(Arrays.stream(sortTypes).toList());
    }
}
