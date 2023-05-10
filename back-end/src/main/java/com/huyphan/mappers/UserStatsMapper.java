package com.huyphan.mappers;

import com.huyphan.dtos.UserStatsDto;
import com.huyphan.models.UserStats;
import org.springframework.beans.factory.config.ConfigurableBeanFactory;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;

@Component
@Scope(ConfigurableBeanFactory.SCOPE_SINGLETON)
public class UserStatsMapper extends BaseMapper implements ToDtoMapper<UserStatsDto, UserStats> {

    @Override
    public void createTypeMap() {
        modelMapper.typeMap(UserStats.class, UserStatsDto.class);
    }

    @Override
    public UserStatsDto toDto(UserStats data) {
        return modelMapper.map(data, UserStatsDto.class);
    }
}
