package com.huyphan.mappers;

/**
 * Maps domain to DTO.
 */
public interface ToDtoMapper<TDto, TDomain> {

    TDto toDto(TDomain data);
}
