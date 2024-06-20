package com.huyphan.mappers;

import com.huyphan.dtos.ReportDto;
import com.huyphan.dtos.UserDto;
import com.huyphan.mappers.converters.S3URLToCloudFrontURLConverter;
import com.huyphan.models.Report;
import com.huyphan.models.User;
import java.time.Instant;
import java.util.Set;
import java.util.stream.Collectors;
import org.modelmapper.Converter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.config.ConfigurableBeanFactory;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;

/**
 * User mapper.
 */
@Component
@Scope(ConfigurableBeanFactory.SCOPE_SINGLETON)
public class UserMapper extends BaseMapper implements ToDtoMapper<UserDto, User> {

    @Autowired
    private Converter<Instant, String> converter;

    @Autowired
    private S3URLToCloudFrontURLConverter s3URLToCloudFrontURLConverter;

    @Override
    public UserDto toDto(User data) {
        return modelMapper.map(data, UserDto.class);
    }

    @Override
    public void createTypeMap() {
        Converter<Set<Report>, Set<ReportDto>> reportConverter = (context) -> {
            Set<Report> reports = context.getSource();

            return reports.stream().map((element) -> modelMapper.map(element, ReportDto.class)).collect(
                    Collectors.toSet()
            );
        };

        modelMapper.typeMap(User.class, UserDto.class).addMappings(
                mapper -> {
                    mapper.using(converter).map(User::getCreated, UserDto::setCreated);
                    mapper.using(converter).map(User::getBlockedTime, UserDto::setBlockedTime);
                    mapper.using(reportConverter).map(User::getReports, UserDto::setReports);
                    mapper.using(s3URLToCloudFrontURLConverter)
                            .map(User::getAvatarUrl, UserDto::setAvatarUrl);
                    mapper.using(s3URLToCloudFrontURLConverter)
                            .map(User::getCoverImageUrl, UserDto::setCoverImageUrl);
                }

        );
    }
}
