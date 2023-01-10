package com.huyphan.utils.sortoptionsconstructor;

import com.huyphan.models.enums.SortType;
import com.huyphan.models.exceptions.AppException;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

/**
 * Return the appropriate sort options constructor based on the provided sort type.
 */
@Component
public class SortOptionsConstructorFactory {

    @Autowired
    private List<SortOptionsConstructor> sortOptionsConstructors;

    public SortOptionsConstructor getSortOptionConstructor(SortType sortType) throws AppException {
        return sortOptionsConstructors.stream().filter((c) -> c.getSortType() == sortType)
                .findFirst()
                .orElseThrow(
                        () -> new AppException("Sort options constructor not found")
                );
    }
}
