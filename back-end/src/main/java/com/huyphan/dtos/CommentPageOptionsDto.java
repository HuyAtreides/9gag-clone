package com.huyphan.dtos;

import java.util.List;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CommentPageOptionsDto extends PageOptionsDto {

    private List<String> excludeIds;
}
