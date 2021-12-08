import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsernameFormFieldValidatorPipe } from './pipes/username-form-field-validator.pipe';
import { EmailFormFieldValidatorPipe } from './pipes/email-form-field-validator.pipe';
import { PasswordFormFieldValidatorPipe } from './pipes/password-form-field-validator.pipe';
import { PasswordReenterFormFieldValidatorPipe } from './pipes/password-reenter-form-field-validator.pipe';

@NgModule({
  declarations: [
    UsernameFormFieldValidatorPipe,
    EmailFormFieldValidatorPipe,
    PasswordFormFieldValidatorPipe,
    PasswordReenterFormFieldValidatorPipe,
  ],
  imports: [CommonModule],
  exports: [
    UsernameFormFieldValidatorPipe,
    EmailFormFieldValidatorPipe,
    PasswordFormFieldValidatorPipe,
    PasswordReenterFormFieldValidatorPipe,
  ],
})
export class SharedModule {}
