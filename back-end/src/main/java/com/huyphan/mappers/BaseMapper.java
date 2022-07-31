package com.huyphan.mappers;

import javax.annotation.PostConstruct;
import lombok.Getter;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;

/**
 * Base mapper for other mappers.
 */
@Getter
public abstract class BaseMapper {

    @Autowired
    protected ModelMapper modelMapper;

    /**
     * Create type map in model mapper so that it can be reused by other mappers.
     */
    @PostConstruct
    public abstract void createTypeMap();
}
