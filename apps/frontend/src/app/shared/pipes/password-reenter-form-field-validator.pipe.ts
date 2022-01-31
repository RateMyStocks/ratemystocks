import { Pipe, PipeTransform } from '@angular/core';
import { FormControl } from '@angular/forms';

@Pipe({
  name: 'passwordReenterFormFieldValidator',
})
export class PasswordReenterFormFieldValidatorPipe implements PipeTransform {
  transform(formControl: FormControl, ...args: unknown[]): string {
    return formControl.hasError('required')
      ? 'Please confirm your password.'
      : formControl.invalid
      ? 'Password does not match.'
      : '';
  }
}
