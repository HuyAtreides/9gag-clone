package com.huyphan.mappers;

import com.huyphan.dtos.SharePostRequestDto;
import com.huyphan.dtos.SharedPostDto;
import com.huyphan.models.Section;
import com.huyphan.models.SharePostRequest;
import com.huyphan.models.SharedPost;
import org.springframework.stereotype.Component;

@Component
public class SharePostRequestMapper extends BaseMapper implements FromDtoMapper<SharePostRequestDto, SharePostRequest> {

    @Override
    public SharePostRequest fromDto(SharePostRequestDto data) {
        return modelMapper.map(data, SharePostRequest.class);
    }

    @Override
    public void createTypeMap() {
        modelMapper.typeMap(SharePostRequestDto.class, SharePostRequest.class);
    }
}