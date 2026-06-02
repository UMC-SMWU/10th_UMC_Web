import type { ResponseUploadDto } from "../types/upload";
import { axiosInstance } from "./axios";

export const uploadImage = async (
  file: File,
): Promise<ResponseUploadDto["data"]> => {
  const formData = new FormData();
  formData.append("file", file);

  const { data } = await axiosInstance.post<ResponseUploadDto>(
    "/v1/uploads",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );

  return data.data;
};
