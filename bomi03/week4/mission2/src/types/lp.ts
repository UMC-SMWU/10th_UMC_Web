import type { CommonResponse, CursorBasedResponse } from "./common";

export type Tag = {
  id: number;
  name: string;
};

export type Like = {
  id: number;
  userId: number;
  lpId: number;
};

export type Lp = {
  id: number;
  title: string;
  content: string;
  thumbnail: string;
  published: boolean;
  authorId: number;
  createdAt: Date;
  updatedAt: Date;
  tags: Tag[];
  likes: Like[];
};

export type ResponseLpListDto = CursorBasedResponse<Lp[]>;

export type Author = {
  id: number;
  name: string;
  email: string;
  bio: string | null;
  avatar: string | null;
  createdAt: string;
  updatedAt: string;
};

export type LpDetail = Lp & {
  author: Author;
};

export type ResponseLikeLpDto = CommonResponse<{
  id: number;
  userId: number;
  lpId: number;
}>;
