import type { CursorBasedResponse } from "./common";

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

// 작성자 타입
export type Author = {
  id: number;
  name: string;
  email: string;
  bio: string | null;
  avatar: string | null;
  createdAt: string;
  updatedAt: string;
};

// 상세 조회용 LP 타입 (기존 Lp 확장)
export type LpDetail = Lp & {
  author: Author;
};
