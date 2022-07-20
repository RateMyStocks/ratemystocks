import { CommentDto } from '../comments/comment.dto';
import { SpiritAnimal } from '../models';

export class StockPageCommentDto implements CommentDto {
  constructor(
    public comment: string,
    public ticker?: string,
    public datetimePosted?: string,
    public user?: { username: string; avatar: SpiritAnimal },
    public postId?: string // only needed when returning this DTO, but not needed in POST requests.
  ) {
    this.postId = postId;
    this.user = user;
    this.comment = comment;
    this.datetimePosted = datetimePosted;
    this.ticker = ticker;
  }
}
