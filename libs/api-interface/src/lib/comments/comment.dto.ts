import { SpiritAnimal } from '../models';

export interface CommentDto {
  postId?: string;
  user?: { username: string; avatar: SpiritAnimal };
  comment: string;
  datetimePosted?: string;
}
