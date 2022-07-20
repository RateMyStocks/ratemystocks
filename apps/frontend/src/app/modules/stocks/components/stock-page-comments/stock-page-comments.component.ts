import { Component, Injectable, Input, OnChanges, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { faker } from '@faker-js/faker';
import { StockService } from '../../../../core/services/stock.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { StockPageCommentDto } from '@ratemystocks/api-interface';
import { MessageService } from 'primeng/api';

export interface Comments {
  username;
  comment;
  avatar;
  datetime;
}

// TODO: DELETE
// @Injectable()
// export class ProductService {
//   status: string[] = ['OUTOFSTOCK', 'INSTOCK', 'LOWSTOCK'];

//   constructor(private http: HttpClient) {}

//   getStockComments(startIndex: number, numRows: number): Observable<Comments[]> {
//     const comments: Comments[] = [];

//     let commentDate = new Date();

//     Array.from({ length: Math.floor(Math.random() * 100) }).forEach(() => {
//       const zeroOr1 = Math.floor(Math.random() * 2);
//       const randomComment = {
//         username: faker.internet.userName(),
//         comment: zeroOr1 === 0 ? faker.lorem.paragraph() : faker.lorem.paragraphs(),
//         avatar: faker.image.avatar(),
//         datetime: commentDate,
//       };
//       comments.push(randomComment);
//       commentDate = new Date(commentDate.setDate(commentDate.getDate() - 1));
//     });

//     const filteredComments: Comments[] = comments.slice(startIndex, startIndex + numRows);

//     return of(filteredComments);
//   }
// }

@Component({
  selector: 'app-stock-page-comments',
  templateUrl: './stock-page-comments.component.html',
  styleUrls: ['./stock-page-comments.component.scss', './stock-page-comments.component.css'],
  // providers: [ProductService],
})
export class StockPageCommentsComponent implements OnInit, OnChanges {
  @Input() ticker: string;

  comments$: Observable<any[]>;
  isLoading$: Observable<boolean>;

  comments: any[];
  isLoading = false;
  commentsLoaded = 0;

  totalCommentsLength = 0;

  selectedSortOption: any;
  sortOptions = [
    { displayValue: 'Newest', id: 1 },
    { displayValue: 'Oldest', id: 2 },
    { displayValue: 'Top Comments', id: 3 },
  ];

  commentForm = new FormGroup({
    comment: new FormControl('', { validators: [Validators.required, Validators.maxLength(500)] }),
  });

  constructor(
    // private productService: ProductService,
    private stockService: StockService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    // this.productService.getStockComments(0, 20).subscribe((comments) => {
    //   this.comments = comments;
    //   this.commentsLoaded = comments.length;
    //   this.totalCommentsLength = 94;
    // });
  }

  ngOnChanges(): void {
    this.stockService.getStockPageComments(this.ticker, 0, 20).subscribe((comments) => {
      this.comments = comments;
      this.commentsLoaded = comments.length;
      this.totalCommentsLength = 94;
    });
  }

  onScroll() {
    // setTimeout(() => {
    //   this.productService.getStockComments(this.commentsLoaded + 20, 20).subscribe((loadedComments) => {
    //     Array.prototype.splice.apply(this.comments, [...[this.commentsLoaded + 20, 20], ...loadedComments]);

    //     this.isLoading = false;
    //   });
    // }, 1000);
    if (this.ticker) {
      this.isLoading = true;
      this.stockService.getStockPageComments(this.ticker, this.commentsLoaded, 20).subscribe((comments) => {
        // console.log('COMMENTS: ', comments);
        // Array.prototype.splice.apply(this.comments, [...[this.commentsLoaded + 20, 20], ...comments]);

        // this.comments.filter((value, index, self) => index === self.findIndex((t) => t.postId === value.postId));

        // this.commentsLoaded += comments.length;

        this.isLoading = false;
      });
    }
  }

  onSort(event): void {
    let sortDirection;
    console.log(this.selectedSortOption.id)
    if (this.selectedSortOption.id === 1) {
      console.log('Set to DESC')
      sortDirection = 'DESC'
    } else if (this.selectedSortOption.id === 2) {
      console.log('Set to ASC')
      sortDirection = 'ASC';
    }

    console.log('SORT DIRECTION IN COMPONENT', sortDirection)

    this.isLoading = true;
    this.stockService.getStockPageComments(this.ticker, 0, 20, sortDirection).subscribe((comments) => {
      this.comments = comments;
      this.commentsLoaded = comments.length;

      this.isLoading = false;
    });
  }

  // showCaptchaResponse(event: any) {}

  /**
   *
   */
  onSubmit(): void {
    if (this.commentForm.valid && this.ticker) {
      this.stockService
        .postStockPageComment(this.ticker, this.commentForm.value)
        .subscribe((postedComment: StockPageCommentDto) => {
          this.comments.unshift(postedComment);

          this.commentForm.reset();

          this.totalCommentsLength++;

          this.messageService.add({key: 'stockPageComment', severity:'success', summary: 'Success!', detail: 'Your comment has been posted'});
        });
    }
  }
}
