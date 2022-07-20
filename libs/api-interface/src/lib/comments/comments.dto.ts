import { CommentDto } from "./comment.dto";

export interface CommentsDto {
  totalSize: number;
  comments: CommentDto[];
}
