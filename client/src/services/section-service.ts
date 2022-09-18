import { Constant } from "../models/enums/constant";
import { createAxiosInstance } from "../utils/create-axios-instance";
import Section from "../models/section";
import SectionDto from "./dtos/section-dto";
import { SectionMapper } from "./mappers/section-mapper";

export async function getSections(): Promise<SectionDto[]> {
    const axios = createAxiosInstance();
    const response = await axios.get<any>(Constant.SectionEndpoint);
    const sections = response.data.map((data: SectionDto) =>
        SectionMapper.fromDto(data)
    );
    return sections;
}
