import type { PaginationDto } from "../types/common";
import type { LpDetail, ResponseLpListDto } from "../types/lp";
import type { ResponseLpCommentListDto } from "../types/comment";
import { axiosInstance } from "./axios";

export const getLpList = async (
  paginationDto: PaginationDto,
): Promise<ResponseLpListDto> => {
  const { data } = await axiosInstance.get("/v1/lps", {
    params: paginationDto,
  });

  return data.data;
};

// LP 상세 조회
export const getLpDetail = async (lpid: number): Promise<LpDetail> => {
  const { data } = await axiosInstance.get(`/v1/lps/${lpid}`);
  return data.data;
};

// LP 댓글 목록 조회
export const getLpComments = async ({
  lpId,
  cursor,
  limit,
  order,
}: PaginationDto & { lpId: number }): Promise<ResponseLpCommentListDto> => {
  const { data } = await axiosInstance.get(`/v1/lps/${lpId}/comments`, {
    params: {
      cursor,
      limit,
      order,
    },
  });

  return data.data;
};
