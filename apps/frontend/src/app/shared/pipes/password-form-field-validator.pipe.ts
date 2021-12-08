import { Pipe, PipeTransform } from '@angular/core';
import { FormControl } from '@angular/forms';
import { PASSWORD_VALIDATION_MESSAGE } from '@ratemystocks/regex-patterns';

@Pipe({
  name: 'passwordFormFieldValidator',
})
export class PasswordFormFieldValidatorPipe implements PipeTransform {
  transform(formControl: FormControl, ...args: unknown[]): string {
    console.log('IN PASSWORD PIPE');
    return formControl.hasError('required')
      ? 'Password is required.'
      : formControl.hasError('pattern')
      ? PASSWORD_VALIDATION_MESSAGE
      : '';
  }
}
