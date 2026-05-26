import type { PaginationDto } from "../types/common";
import type { ResponseLpDetailDto, ResponseLpListDto } from "../types/lp";
import { axiosInstance } from "./axios";

export const getLpList = async (  
    paginationDto: PaginationDto,
): Promise<ResponseLpListDto> => {
    const {data} = await axiosInstance.get("/lps", {
        params: paginationDto,
    });

    return data;
};

export const getLpDetail = async (
    lpId: string
): Promise<ResponseLpDetailDto> => {
    const { data } = await axiosInstance.get(`/lps/${lpId}`);
    return data;
};

export type PostLpRequest = {
  title: string;
  content: string;
  thumbnail?: string;
  tags: string[];
  published: boolean;
};

export const postLp = async (body: PostLpRequest) => {
  const { data } = await axiosInstance.post("/lps", body);
  return data;
};

export type UpdateLpRequest = {
  lpId: string;
  title: string;
  content: string;
  thumbnail?: string;
  tags: string[];
  published: boolean;
};

export const updateLp = async ({
  lpId,
  ...body
}: UpdateLpRequest) => {
  const { data } = await axiosInstance.patch(
    `/lps/${lpId}`,
    body
  );

  return data;
};

export const deleteLp = async (lpId: string) => {
  const { data } = await axiosInstance.delete(`/lps/${lpId}`);
  return data;
};