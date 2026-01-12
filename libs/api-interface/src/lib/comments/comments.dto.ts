import { CommentDto } from "./comment.dto";

export interface CommentsDto {
  total: number;
  comments: CommentDto[];
}
