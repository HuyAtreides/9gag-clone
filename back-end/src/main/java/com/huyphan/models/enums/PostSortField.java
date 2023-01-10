package com.huyphan.models.enums;

import lombok.Getter;

@Getter
public enum PostSortField {
    TOTAL_COMMENTS(Constants.TOTAL_COMMENTS),
    IS_IN_USER_FAV_SECTIONS(Constants.IS_IN_USER_FAV_SECTIONS);

    private final String value;

    PostSortField(String value) {
        this.value = value;
    }

    public static class Constants {

        public static final String IS_IN_USER_FAV_SECTIONS = "isInUserFavSections";
        public static final String TOTAL_COMMENTS = "totalComments";
    }
}
