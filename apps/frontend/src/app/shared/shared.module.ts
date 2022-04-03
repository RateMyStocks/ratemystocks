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
import { CopyPageLinkComponent } from './components/copy-page-link/copy-page-link.component';
import { ShareOnSocialMediaSpeedDialComponent } from './components/share-on-social-media-speed-dial/share-on-social-media-speed-dial.component';
import { FormsModule } from '@angular/forms';
import { PrimeNGModule } from '../primeng.module';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { PhoneNumberPipe } from './pipes/phone-number.pipe';
import { ShareOnSocialMediaBarComponent } from './components/share-on-social-media-bar/share-on-social-media-bar.component';

@NgModule({
  declarations: [
    AbbreviatedCurrencyFormatterPipe,
    EmailFormFieldValidatorPipe,
    MomentFromNowDatePipe,
    NgxPieChartComponent,
    PasswordFormFieldValidatorPipe,
    PasswordReenterFormFieldValidatorPipe,
    PhoneNumberPipe,
    RoundingPipe,
    TruncatePipe,
    UsernameFormFieldValidatorPipe,
    CopyPageLinkComponent,
    ShareOnSocialMediaSpeedDialComponent,
    ShareOnSocialMediaBarComponent,
  ],
  imports: [ClipboardModule, CommonModule, FormsModule, NgxChartsModule, PrimeNGModule],
  exports: [
    AbbreviatedCurrencyFormatterPipe,
    CopyPageLinkComponent,
    EmailFormFieldValidatorPipe,
    MomentFromNowDatePipe,
    NgxPieChartComponent,
    PasswordFormFieldValidatorPipe,
    PasswordReenterFormFieldValidatorPipe,
    PhoneNumberPipe,
    RoundingPipe,
    ShareOnSocialMediaSpeedDialComponent,
    ShareOnSocialMediaBarComponent,
    TruncatePipe,
    UsernameFormFieldValidatorPipe,
  ],
})
export class SharedModule {}
