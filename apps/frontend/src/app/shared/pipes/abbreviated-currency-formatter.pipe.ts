import { Pipe, PipeTransform } from '@angular/core';
import { MoneyFormatter } from '../utilities/money-formatter';

@Pipe({
  name: 'abbreviatedCurrencyFormatterPipe',
})
export class AbbreviatedCurrencyFormatterPipe implements PipeTransform {
  transform(amount: number): string | number {
    return MoneyFormatter.formatCash(amount);
  }
}
