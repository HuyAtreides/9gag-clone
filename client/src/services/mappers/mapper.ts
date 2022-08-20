export type MapperToDtoFunc<TDto, TDomain> = (data: TDomain) => TDto;
export type MapperFromDtoFunc<TDto, TDomain> = (data: TDto) => TDomain;
