import { Comment } from "./comment";

export interface CommentsResponseDto {
  comments: Comment[];
  total: number;
}
