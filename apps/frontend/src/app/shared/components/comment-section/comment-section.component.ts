import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Comment } from '../../models/interfaces/comment';
import { CommentsService } from './comments.service';

export interface CommentsLazyLoadEvent {
  startIndex: number;
  endIndex: number;
}

@Component({
  selector: 'app-comment-section',
  templateUrl: './comment-section.component.html',
  styleUrls: ['./comment-section.component.scss']
})
export class CommentSectionComponent {
  // @Input()
  // commentService: CommentsService;

  lastLoadedIndex = 0;

  @Input()
  comments: Comment[];

  @Input()
  windowSize: number;

  isLoading = false;
  commentsLoaded = 0;

  @Output() lazyLoad: EventEmitter<CommentsLazyLoadEvent> = new EventEmitter();

  totalCommentsLength = 0;

  selectedSortOption: any;
  sortOptions = [
    { displayValue: 'Newest', id: 1},
    { displayValue: 'Oldest', id: 2},
    { displayValue: 'Top Comments', id: 3},
  ];

  // constructor() { }

  // ngOnInit(): void {
  // }

  onScroll() {
    this.lazyLoad.emit({startIndex: this.lastLoadedIndex, endIndex: this.lastLoadedIndex + this.windowSize});
  }
}
