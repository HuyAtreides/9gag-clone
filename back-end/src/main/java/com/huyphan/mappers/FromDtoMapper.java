package com.huyphan.mappers;

/**
 * Map data from DTO to domain.
 */
public interface FromDtoMapper<TDto, TDomain> {

    TDomain fromDto(TDto data);
}
