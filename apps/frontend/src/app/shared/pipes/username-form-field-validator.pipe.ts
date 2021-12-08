import { Pipe, PipeTransform } from '@angular/core';
import { FormControl } from '@angular/forms';
import { USERNAME_VALIDATION_MESSAGE } from '@ratemystocks/regex-patterns';

@Pipe({
  name: 'usernameFormFieldValidator',
})
export class UsernameFormFieldValidatorPipe implements PipeTransform {
  transform(formControl: FormControl, ...args: unknown[]): string {
    return formControl.hasError('required')
      ? 'Username is required.'
      : formControl.hasError('pattern')
      ? USERNAME_VALIDATION_MESSAGE
      : // : this.form.get('email').hasError('alreadyInUse')
        // ? 'This emailaddress is already in use'
        '';
  }
}
