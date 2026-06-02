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

export const updateLpComment = async ({
  lpId,
  commentId,
  content,
}: {
  lpId: string;
  commentId: number;
  content: string;
}) => {
  const { data } = await axiosInstance.patch(
    `/lps/${lpId}/comments/${commentId}`,
    {
      content,
    }
  );

  return data;
};

export const deleteLpComment = async ({
  lpId,
  commentId,
}: {
  lpId: string;
  commentId: number;
}) => {
  const { data } = await axiosInstance.delete(
    `/lps/${lpId}/comments/${commentId}`
  );

  return data;
};

