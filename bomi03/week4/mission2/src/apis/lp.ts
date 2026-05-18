import type { PaginationDto } from "../types/common";
import type {
  LpDetail,
  RequestCreateLpDto,
  RequestUpdateLpDto,
  ResponseCreateLpDto,
  ResponseDeleteLpDto,
  ResponseLikeLpDto,
  ResponseLpListDto,
  ResponseUpdateLpDto,
} from "../types/lp";
import type {
  RequestCreateCommentDto,
  RequestDeleteCommentDto,
  RequestUpdateCommentDto,
  ResponseLpCommentDto,
  ResponseLpCommentListDto,
} from "../types/comment";
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

export const createLp = async (
  body: RequestCreateLpDto,
): Promise<ResponseCreateLpDto["data"]> => {
  const { data } = await axiosInstance.post<ResponseCreateLpDto>(
    "/v1/lps",
    body,
  );

  return data.data;
};

export const updateLp = async ({
  lpId,
  title,
  content,
  thumbnail,
  tags,
  published,
}: RequestUpdateLpDto): Promise<ResponseUpdateLpDto["data"]> => {
  const { data } = await axiosInstance.patch<ResponseUpdateLpDto>(
    `/v1/lps/${lpId}`,
    {
      title,
      content,
      thumbnail,
      tags,
      published,
    },
  );

  return data.data;
};

export const deleteLp = async (
  lpId: number,
): Promise<ResponseDeleteLpDto["data"]> => {
  const { data } = await axiosInstance.delete<ResponseDeleteLpDto>(
    `/v1/lps/${lpId}`,
  );

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

export const createLpComment = async ({
  lpId,
  content,
}: RequestCreateCommentDto): Promise<ResponseLpCommentDto["data"]> => {
  const { data } = await axiosInstance.post<ResponseLpCommentDto>(
    `/v1/lps/${lpId}/comments`,
    { content },
  );

  return data.data;
};

export const updateLpComment = async ({
  lpId,
  commentId,
  content,
}: RequestUpdateCommentDto): Promise<ResponseLpCommentDto["data"]> => {
  const { data } = await axiosInstance.patch<ResponseLpCommentDto>(
    `/v1/lps/${lpId}/comments/${commentId}`,
    { content },
  );

  return data.data;
};

export const deleteLpComment = async ({
  lpId,
  commentId,
}: RequestDeleteCommentDto): Promise<ResponseLpCommentDto["data"]> => {
  const { data } = await axiosInstance.delete<ResponseLpCommentDto>(
    `/v1/lps/${lpId}/comments/${commentId}`,
  );

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
