import { Component, OnInit } from '@angular/core';
import { LazyLoadEvent } from 'primeng/api';

export interface Comments {
  username;
  comment;
  datetime;
}

@Component({
  selector: 'app-stock-page-comments',
  templateUrl: './stock-page-comments.component.html',
  styleUrls: ['./stock-page-comments.component.scss'],
})
export class StockPageCommentsComponent implements OnInit {
  comments = [];
  totalComments = 0;

  constructor() {}

  ngOnInit(): void {
    this.comments = [
      { username: 'gabelorenzo', comment: 'First Comment', datetime: '1/1/2022' },
      { username: 'gabelorenzo2', comment: 'Second Comment', datetime: '1/1/2022' },
      { username: 'gabelorenzo3', comment: 'Third Comment', datetime: '1/1/2022' },
      { username: 'gabelorenzo4', comment: 'Fourth Comment', datetime: '1/1/2022' },
      { username: 'gabelorenzo5', comment: 'Fifth Comment', datetime: '1/1/2022' },
      { username: 'gabelorenzo6', comment: 'Sixth Comment', datetime: '1/1/2022' },
      { username: 'gabelorenzo7', comment: 'Seventh Comment', datetime: '1/1/2022' },
      { username: 'gabelorenzo8', comment: 'Eigth Comment', datetime: '1/1/2022' },
      { username: 'gabelorenzo9', comment: 'Ninth Comment', datetime: '1/1/2022' },
    ];
  }

  loadCommentsLazy(event: LazyLoadEvent) {
    console.log('LAZY LOAD');
    //simulate remote connection with a timeout
    setTimeout(() => {
      //load data of required page
      let loadedComments = this.comments.slice(event.first, event.first + event.rows);

      //populate page of virtual cars
      Array.prototype.splice.apply(this.comments, [...[event.first, event.rows], ...loadedComments]);

      //trigger change detection
      this.comments = [...this.comments];
      console.log(this.comments);
    }, 4000);
  }
}
