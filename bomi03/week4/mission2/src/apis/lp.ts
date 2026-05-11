import type { PaginationDto } from "../types/common";
import type { Lp, LpDetail } from "../types/lp";
import { axiosInstance } from "./axios";

export const getLpList = async (paginationDto: PaginationDto) => {
  const { data } = await axiosInstance.get("/v1/lps", {
    params: paginationDto,
  });
  return data;
};

// LP 상세 조회
export const getLpDetail = async (lpid: number): Promise<LpDetail> => {
  const { data } = await axiosInstance.get(`/v1/lps/${lpid}`);
  return data.data;
};
