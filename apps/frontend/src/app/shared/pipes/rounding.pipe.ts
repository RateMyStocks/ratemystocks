// @ts-nocheck
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'round',
})
export class RoundingPipe implements PipeTransform {
  transform(value: number): string {
    return +(Math.round(value + 'e+2') + 'e-2');
  }
}
