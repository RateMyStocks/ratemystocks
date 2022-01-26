import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsernameFormFieldValidatorPipe } from './pipes/username-form-field-validator.pipe';
import { EmailFormFieldValidatorPipe } from './pipes/email-form-field-validator.pipe';
import { PasswordFormFieldValidatorPipe } from './pipes/password-form-field-validator.pipe';
import { PasswordReenterFormFieldValidatorPipe } from './pipes/password-reenter-form-field-validator.pipe';
import { TruncatePipe } from './pipes/truncate.pipe';
import { RoundingPipe } from './pipes/rounding.pipe';
import { AbbreviatedCurrencyFormatterPipe } from './pipes/abbreviated-currency-formatter.pipe';

@NgModule({
  declarations: [
    AbbreviatedCurrencyFormatterPipe,
    UsernameFormFieldValidatorPipe,
    EmailFormFieldValidatorPipe,
    PasswordFormFieldValidatorPipe,
    PasswordReenterFormFieldValidatorPipe,
    RoundingPipe,
    TruncatePipe,
  ],
  imports: [CommonModule],
  exports: [
    AbbreviatedCurrencyFormatterPipe,
    UsernameFormFieldValidatorPipe,
    EmailFormFieldValidatorPipe,
    PasswordFormFieldValidatorPipe,
    PasswordReenterFormFieldValidatorPipe,
    RoundingPipe,
    TruncatePipe,
  ],
})
export class SharedModule {}
