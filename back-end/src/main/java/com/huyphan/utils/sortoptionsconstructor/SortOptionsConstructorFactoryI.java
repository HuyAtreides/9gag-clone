package com.huyphan.utils.sortoptionsconstructor;

import com.huyphan.models.enums.SortType;
import com.huyphan.models.exceptions.AppException;
import java.util.List;

public interface SortOptionsConstructorFactoryI {

    default SortOptionsConstructor getSortOptionConstructor(SortType sortType) throws AppException {
        return getSortOptionsConstructors().stream().filter((c) -> c.getSortType() == sortType)
                .findFirst()
                .orElseThrow(
                        () -> new AppException("Sort options constructor not found")
                );
    }

    List<SortOptionsConstructor> getSortOptionsConstructors();
}
