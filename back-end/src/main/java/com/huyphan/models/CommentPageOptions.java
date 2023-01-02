package com.huyphan.models;

import java.util.List;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@Getter
@Setter
public class CommentPageOptions extends PageOptions {

    private List<Long> excludeIds;
}
