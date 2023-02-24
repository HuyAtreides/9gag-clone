package com.huyphan.utils.sortoptionsconstructor;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Component;

/**
 * Return the appropriate sort options constructor based on the provided sort type.
 */
@Component
public class PostSortOptionsConstructorFactory implements SortOptionsConstructorFactoryI {

    @Autowired
    @Qualifier("post-sort-options-constructor")
    private List<SortOptionsConstructor> sortOptionsConstructors;

    @Override
    public List<SortOptionsConstructor> getSortOptionsConstructors() {
        return sortOptionsConstructors;
    }
}
