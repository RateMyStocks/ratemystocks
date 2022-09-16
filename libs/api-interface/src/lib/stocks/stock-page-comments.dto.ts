import { CommentsDto, StockPageCommentDto } from "../api-interface";

export class StockPageCommentsDto implements CommentsDto {
  constructor(
    public total: number,
    public comments: StockPageCommentDto[],
  ) {
    this.total = total;
    this.comments = comments;
  }
}
