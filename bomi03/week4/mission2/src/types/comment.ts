import type { CommonResponse, CursorBasedResponse } from "./common";
import type { Author } from "./lp";

export type CommentAuthor = {
  id: number;
  name: string;
  email: string;
  bio: string | null;
  avatar: string | null;
  createdAt: string;
  updatedAt: string;
};

export type LpComment = {
  id: number;
  content: string;
  lpId: number;
  authorId: number;
  createdAt: string;
  updatedAt: string;
  author: CommentAuthor;
};

export type ResponseLpCommentListDto = CursorBasedResponse<LpComment[]>;

export type ResponseLpCommentDto = CommonResponse<LpComment>;

export type RequestCreateCommentDto = {
  lpId: number;
  content: string;
};

export type RequestUpdateCommentDto = {
  lpId: number;
  commentId: number;
  content: string;
};

export type RequestDeleteCommentDto = {
  lpId: number;
  commentId: number;
};
