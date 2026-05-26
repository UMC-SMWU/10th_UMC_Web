import { axiosInstance } from "./axios";
import type { PAGINATION_ORDER } from "../types/common";
import type { ResponseLpCommentListDto } from "../types/comment";

interface GetLpCommentListParams {
  lpId: string;
  cursor?: number;
  order: PAGINATION_ORDER;
  limit: number;
}

export const getLpCommentList = async ({
  lpId,
  cursor = 0,
  order,
  limit,
}: GetLpCommentListParams): Promise<ResponseLpCommentListDto> => {
  const { data } = await axiosInstance.get(`/lps/${lpId}/comments`, {
    params: {
      cursor,
      order,
      limit,
    },
  });

  return data;
};

export const postLpComment = async ({
  lpId,
  content,
}: {
  lpId: string;
  content: string;
}) => {
  const { data } = await axiosInstance.post(`/lps/${lpId}/comments`, {
    content,
  });

  return data;
};