package com.huyphan.utils.SortOptionsConstructor;

import com.huyphan.models.enums.PostTag;
import com.huyphan.models.exceptions.AppException;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

/**
 * Return the appropriate sort options constructor based on the provided post tag.
 */
@Component
public class SortOptionsConstructorFactory {

    @Autowired
    private List<SortOptionsConstructor> sortOptionsConstructors;

    public SortOptionsConstructor getSortOptionConstructor(PostTag postTag) throws AppException {
        return sortOptionsConstructors.stream().filter((c) -> c.getPostTag() == postTag).findFirst()
                .orElseThrow(
                        () -> new AppException("Sort options constructor not found")
                );
    }
}
