import RegisterData from '../../models/register-data';
import RegisterDataDto from '../dtos/register-data-dto';

export namespace RegisterDataMapper {
    export function toDto(data: RegisterData): RegisterDataDto {
        return data;
    }
}
