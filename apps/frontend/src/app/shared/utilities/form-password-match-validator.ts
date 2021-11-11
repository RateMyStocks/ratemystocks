import { FormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';

/**
 * Validator function that ensures 'password' form field has the same value as the 're-enter password' field.
 * @param formGroup The signup form containing the password fields.
 * @return The ValidationErrors object if the passwords don't match, otherwise return null.
 */
export const passwordMatchValidator: ValidatorFn = (formGroup: FormGroup): ValidationErrors | null => {
  if (formGroup.get('password').value === formGroup.get('passwordReenter').value) return null;
  else return { passwordMismatch: true };
};
