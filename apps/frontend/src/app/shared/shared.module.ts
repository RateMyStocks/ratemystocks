import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsernameFormFieldValidatorPipe } from './pipes/username-form-field-validator.pipe';
import { EmailFormFieldValidatorPipe } from './pipes/email-form-field-validator.pipe';
import { PasswordFormFieldValidatorPipe } from './pipes/password-form-field-validator.pipe';
import { PasswordReenterFormFieldValidatorPipe } from './pipes/password-reenter-form-field-validator.pipe';
import { TruncatePipe } from './pipes/truncate.pipe';
import { RoundingPipe } from './pipes/rounding.pipe';
import { AbbreviatedCurrencyFormatterPipe } from './pipes/abbreviated-currency-formatter.pipe';
import { MomentFromNowDatePipe } from './pipes/moment-from-now-date.pipe';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { NgxPieChartComponent } from './components/ngx-pie-chart/ngx-pie-chart.component';

@NgModule({
  declarations: [
    AbbreviatedCurrencyFormatterPipe,
    EmailFormFieldValidatorPipe,
    MomentFromNowDatePipe,
    NgxPieChartComponent,
    PasswordFormFieldValidatorPipe,
    PasswordReenterFormFieldValidatorPipe,
    RoundingPipe,
    TruncatePipe,
    UsernameFormFieldValidatorPipe,
  ],
  imports: [CommonModule, NgxChartsModule],
  exports: [
    AbbreviatedCurrencyFormatterPipe,
    EmailFormFieldValidatorPipe,
    MomentFromNowDatePipe,
    NgxPieChartComponent,
    PasswordFormFieldValidatorPipe,
    PasswordReenterFormFieldValidatorPipe,
    RoundingPipe,
    TruncatePipe,
    UsernameFormFieldValidatorPipe,
  ],
})
export class SharedModule {}
