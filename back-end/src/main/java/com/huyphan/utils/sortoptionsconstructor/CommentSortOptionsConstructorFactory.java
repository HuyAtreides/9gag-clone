package com.huyphan.utils.sortoptionsconstructor;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Component;

@Component
public class CommentSortOptionsConstructorFactory implements SortOptionsConstructorFactoryI {

    @Autowired
    @Qualifier("comment-sort-options-constructor")
    private List<SortOptionsConstructor> sortOptionsConstructors;

    @Override
    public List<SortOptionsConstructor> getSortOptionsConstructors() {
        return sortOptionsConstructors;
    }
}
