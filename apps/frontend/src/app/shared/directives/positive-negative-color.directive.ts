import { Directive, ElementRef, Input, OnChanges, OnInit } from "@angular/core";

@Directive({
  selector: '[appPositiveDirective]'
})
export class PositiveNegativeColorDirective implements OnChanges {

  @Input("appPositiveDirective") num: number;

  constructor(private el: ElementRef) { }

  ngOnChanges() {
    console.log('POS/NEG Directive Num', this.num)
    if (this.num > 0) {
      this.el.nativeElement.style.color = '#48a832';
    } else if (this.num < 0) {
      this.el.nativeElement.style.color = 'red';
    } else {
      this.el.nativeElement.style.color = '#000';
    }
  }
}
