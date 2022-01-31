import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'round',
})
export class RoundingPipe implements PipeTransform {
  transform(value: number): number {
    // return +(Math.round(value + 'e+2') + 'e-2');
    return +value.toFixed(2);
  }
}
