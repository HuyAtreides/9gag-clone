package com.huyphan.mappers;

import com.huyphan.dtos.NotificationDto;
import com.huyphan.models.Notification;
import java.time.Instant;
import org.modelmapper.Converter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.config.ConfigurableBeanFactory;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;

@Component
@Scope(ConfigurableBeanFactory.SCOPE_SINGLETON)
public class NotificationMapper extends BaseMapper implements
        ToDtoMapper<NotificationDto, Notification> {

    @Autowired
    private Converter<Instant, String> converter;

    @Override
    public void createTypeMap() {
        modelMapper.typeMap(Notification.class, NotificationDto.class)
                .addMappings(mapper -> mapper.using(converter).map(Notification::getCreated,
                        NotificationDto::setCreated));
    }

    @Override
    public NotificationDto toDto(Notification data) {
        return modelMapper.map(data, NotificationDto.class);
    }
}
