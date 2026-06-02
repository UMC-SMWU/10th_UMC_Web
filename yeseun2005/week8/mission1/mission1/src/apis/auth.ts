import type { RequestSigninDto, RequestSignupDto, ResponseSignupDto, ResponseSigninDto, ResponseMyInfoDto } from "../types/auth";
import { axiosInstance } from "./axios";

export const postSignup = async (body: RequestSignupDto) : Promise<ResponseSignupDto> => {
    const { data } = await axiosInstance.post(
        "/auth/signup",
        body,
    );
    return data;
};

export const postSignin = async (
    body: RequestSigninDto
): Promise<ResponseSigninDto> => {
    const { data } = await axiosInstance.post("/auth/signin", body);
    return data;
};

export const getMyInfo = async (): Promise<ResponseMyInfoDto> => {
    const { data } = await axiosInstance.get("/users/me");
    return data;
};

export const postLogout = async () => {
    const {data} = await axiosInstance.post("/auth/signout");
    return data;
};

export const deleteUser = async () => {
  const { data } = await axiosInstance.delete("/users");
  return data;
};

export type UpdateMyInfoRequest = {
  name: string;
  bio?: string;
  avatar?: string;
};

export const updateMyInfo = async (body: UpdateMyInfoRequest) => {
  const { data } = await axiosInstance.patch("/users", body);
  return data;
};