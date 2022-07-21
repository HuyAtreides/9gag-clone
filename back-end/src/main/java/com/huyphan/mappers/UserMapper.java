package com.huyphan.mappers;

import com.huyphan.dtos.SectionDto;
import com.huyphan.dtos.UserDto;
import com.huyphan.models.Section;
import com.huyphan.models.User;
import java.util.Set;
import java.util.stream.Collectors;
import org.modelmapper.Converter;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

/**
 * User mapper.
 */
@Component
public class UserMapper implements ToDtoMapper<UserDto, User> {

    @Autowired
    private ModelMapper modelMapper;

    @Autowired
    private SectionMapper sectionMapper;

    @Override
    public UserDto toDto(User data) {
        Converter<Set<Section>, Set<SectionDto>> converter = (context) -> {
            Set<Section> source = context.getSource();
            return source.stream().map((section) -> sectionMapper.toDto(section))
                    .collect(Collectors.toSet());
        };

        modelMapper.typeMap(User.class, UserDto.class).addMappings(
                mapper -> mapper.using(converter)
                        .map(User::getFavoriteSections, UserDto::setFavoriteSections)
        );

        return modelMapper.map(data, UserDto.class);
    }
}
