import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Comment } from "../../models/interfaces/comment";

@Injectable()
export abstract class CommentsService {
  /**
   * Returns a paginated list of comments.
   */
  abstract getPaginatedComments(startIndex: number, numRows: number): Observable<{comments: Comment[], totalSize: number}>;

  abstract getDummyComments(startIndex: number, numRows: number): Observable<{comments: Comment[], totalSize: number}>;
}
