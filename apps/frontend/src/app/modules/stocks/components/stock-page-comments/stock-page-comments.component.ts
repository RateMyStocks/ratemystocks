import { HttpClient } from '@angular/common/http';
import { Component, HostListener, Injectable, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { LazyLoadEvent } from 'primeng/api';
import { Observable, of } from 'rxjs';
import { PrimeNGConfig } from 'primeng/api';
import { faker } from '@faker-js/faker';

export interface Comments {
  username;
  comment;
  avatar;
  datetime;
}

// TODO: DELETE
@Injectable()
export class ProductService {
  status: string[] = ['OUTOFSTOCK', 'INSTOCK', 'LOWSTOCK'];

  constructor(private http: HttpClient) {}

  getStockComments(startIndex: number, numRows: number): Observable<Comments[]> {
    const comments: Comments[] = [];

    let commentDate = new Date();

    Array.from({ length: Math.floor(Math.random() * 100) }).forEach(() => {
      const zeroOr1 = Math.floor(Math.random() * 2);
      const randomComment = {
        username: faker.internet.userName(),
        comment: zeroOr1 === 0 ? faker.lorem.paragraph() : faker.lorem.paragraphs(),
        avatar: faker.image.avatar(),
        datetime: commentDate,
      };
      comments.push(randomComment);
      commentDate = new Date(commentDate.setDate(commentDate.getDate()-1))
    });

    const filteredComments: Comments[] = comments.slice(startIndex, startIndex + numRows);

    return of(filteredComments);
  }
}

@Component({
  selector: 'app-stock-page-comments',
  templateUrl: './stock-page-comments.component.html',
  styleUrls: ['./stock-page-comments.component.scss', './stock-page-comments.component.css'],
  providers: [ProductService],
})
export class StockPageCommentsComponent implements OnInit {
  comments$: Observable<any[]>;
  isLoading$: Observable<boolean>;

  comments: any[];
  isLoading = false;
  commentsLoaded = 0;

  totalCommentsLength = 0;

  selectedSortOption: any;
  sortOptions = [
    { displayValue: 'Newest', id: 1},
    { displayValue: 'Oldest', id: 2},
    { displayValue: 'Top Comments', id: 3},
  ];

  constructor(private productService: ProductService, private primeNGConfig: PrimeNGConfig) {}

  ngOnInit(): void {
    this.productService.getStockComments(0, 20).subscribe((comments) => {
      this.comments = comments;
      this.commentsLoaded = comments.length;
      this.totalCommentsLength = 94;
    });
  }

  onScroll() {
    this.isLoading = true;
    setTimeout(() => {
      this.productService.getStockComments(this.commentsLoaded + 20, 20).subscribe((loadedComments) => {
        Array.prototype.splice.apply(this.comments, [...[this.commentsLoaded + 20, 20], ...loadedComments]);

        this.isLoading = false;
      });
    }, 1000);
  }
}
