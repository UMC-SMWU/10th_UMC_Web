import type { PaginationDto } from "../types/common";
import type {
  LpDetail,
  ResponseLikeLpDto,
  ResponseLpListDto,
} from "../types/lp";
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

export const getLpDetail = async (lpid: number): Promise<LpDetail> => {
  const { data } = await axiosInstance.get(`/v1/lps/${lpid}`);
  return data.data;
};

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

export const postLike = async (
  lpId: number,
): Promise<ResponseLikeLpDto["data"]> => {
  const { data } = await axiosInstance.post<ResponseLikeLpDto>(
    `/v1/lps/${lpId}/likes`,
  );

  return data.data;
};

export const deleteLike = async (
  lpId: number,
): Promise<ResponseLikeLpDto["data"]> => {
  const { data } = await axiosInstance.delete<ResponseLikeLpDto>(
    `/v1/lps/${lpId}/likes`,
  );

  return data.data;
};
