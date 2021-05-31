import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AboutComponent } from './pages/about/about.component';
import { ContactComponent } from './pages/contact/contact.component';
import { HelpComponent } from './pages/help/help.component';
import { PrivacyPolicyComponent } from './pages/privacy-policy/privacy-policy.component';
import { TermsAndConditionsComponent } from './pages/terms-and-conditions/terms-and-conditions.component';
import { TermsComponent } from './pages/terms/terms.component';



@NgModule({
  declarations: [
    AboutComponent,
    ContactComponent,
    HelpComponent,
    PrivacyPolicyComponent,
    TermsAndConditionsComponent,
    TermsComponent
  ],
  imports: [
    CommonModule
  ]
})
export class ResourcesModule { }
