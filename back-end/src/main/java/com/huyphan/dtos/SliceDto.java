package com.huyphan.dtos;

import java.util.List;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class SliceDto<T> {

    private int size;
    private int number;
    private List<T> content;
    private boolean isLast;
}
