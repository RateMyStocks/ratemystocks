// import { Component, OnInit } from '@angular/core';

// @Component({
//   selector: 'app-infinite-scroll',
//   templateUrl: './infinite-scroll.component.html',
//   styleUrls: ['./infinite-scroll.component.scss'],
// })
// export class InfiniteScrollComponent implements OnInit {
//   constructor() {}

//   ngOnInit(): void {}
// }

import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  ElementRef,
  ViewChild,
  Input,
  OnDestroy,
  AfterViewInit,
} from '@angular/core';

@Component({
  selector: 'app-infinite-scroll',
  // templateUrl: './infinite-scroll.component.html',
  styleUrls: ['./infinite-scroll.component.scss'],
  template: `
    <ng-content></ng-content>
    <div #anchor></div>
  `,
  // styleUrls: ['./infinite-scroll.component.css']
})
export class InfiniteScrollComponent implements OnDestroy, AfterViewInit {
  @Input() options = {};
  @Output() scrolled = new EventEmitter();
  @ViewChild('anchor') anchor: ElementRef<HTMLElement>;

  private observer: IntersectionObserver;

  constructor(private host: ElementRef) {}

  get element() {
    return this.host.nativeElement;
  }

  // ngOnInit(): void {
  //   const options = {
  //     root: this.isHostScrollable() ? this.host.nativeElement : null,
  //     ...this.options,
  //   };

  //   this.observer = new IntersectionObserver(([entry]) => {
  //     entry.isIntersecting && this.scrolled.emit();
  //   }, options);

  //   this.observer.observe(this.anchor.nativeElement);
  // }

  ngAfterViewInit() {
    console.log('AFTER VIEW INIT')
    const options = {
      root: this.isHostScrollable() ? this.host.nativeElement : null,
      ...this.options,
    };

    this.observer = new IntersectionObserver(([entry]) => {
      entry.isIntersecting && this.scrolled.emit();
    }, options);

    this.observer.observe(this.anchor.nativeElement);
  }

  private isHostScrollable() {
    const style = window.getComputedStyle(this.element);

    return style.getPropertyValue('overflow') === 'auto' || style.getPropertyValue('overflow-y') === 'scroll';
  }

  ngOnDestroy() {
    this.observer.disconnect();
  }
}
