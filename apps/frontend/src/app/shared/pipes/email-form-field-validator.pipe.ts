import { Pipe, PipeTransform } from '@angular/core';
import { FormControl } from '@angular/forms';
import { EMAIL_VALIDATION_MESSAGE } from '@ratemystocks/regex-patterns';

@Pipe({
  name: 'emailFormFieldValidator',
})
export class EmailFormFieldValidatorPipe implements PipeTransform {
  transform(formControl: FormControl, ...args: unknown[]): string {
    return formControl.hasError('required')
      ? 'Email is required.'
      : formControl.hasError('pattern')
      ? EMAIL_VALIDATION_MESSAGE
      : // : this.form.get('email').hasError('alreadyInUse')
        // ? 'This emailaddress is already in use'
        '';
  }
}
