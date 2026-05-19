import type { PaginationDto } from "../types/common";
import { axiosInstance } from "./axios";

export const getLpList = async (paginationDto: PaginationDto) => {
    const {data} = await axiosInstance.get("/v1/lps", {
        params: paginationDto,
    });

    return data;
};