import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
  name: 'momentFromNowDatePipe',
})
export class MomentFromNowDatePipe implements PipeTransform {
  transform(dateString: string): string {
    return moment(dateString).fromNow();
  }
}
