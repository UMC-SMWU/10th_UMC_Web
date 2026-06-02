export interface CommentAuthor {
  id: number;
  name: string;
  email: string;
  avatar?: string;
}

export interface LpComment {
  id: number;
  content: string;
  lpId: number;
  authorId: number;
  createdAt: string;
  updatedAt: string;
  author: CommentAuthor;
}

export interface ResponseLpCommentListDto {
  status: boolean;
  statusCode: number;
  message: string;
  data: {
    data: LpComment[];
    nextCursor: number | null;
    hasNext: boolean;
  };
}