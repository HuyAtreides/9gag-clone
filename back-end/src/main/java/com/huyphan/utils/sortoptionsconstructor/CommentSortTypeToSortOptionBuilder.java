package com.huyphan.utils.sortoptionsconstructor;

import com.huyphan.models.enums.SortType;
import com.huyphan.models.exceptions.AppException;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Component;

@Component
public class CommentSortTypeToSortOptionBuilder extends SortTypeToSortOptionBuilder {

    @Autowired
    private SortOptionsConstructorFactoryI commentSortOptionsConstructorFactory;

    @Override
    public Sort toSortOption(List<SortType> sortTypes) throws AppException {
        Sort sort = sortTypes.stream().reduce(Sort.unsorted(), (sortOption, sortType) -> {
                    try {
                        SortOptionsConstructor sortOptionsConstructor = commentSortOptionsConstructorFactory.getSortOptionConstructor(
                                sortType);

                        return sortOption.and(sortOptionsConstructor.constructSortOptions());
                    } catch (AppException e) {
                        e.printStackTrace();
                        return null;
                    }
                }, (sortOption, sortType) -> sortOption
        );

        if (sort == null) {
            throw new AppException(
                    "Unable to construct sort option from sort type, please check your sort types again.");
        }

        return sort;
    }
}
