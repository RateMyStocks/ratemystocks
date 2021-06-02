import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AboutComponent } from './pages/about/about.component';
import { ContactComponent } from './pages/contact/contact.component';
import { HelpComponent } from './pages/help/help.component';
import { PrivacyPolicyComponent } from './pages/privacy-policy/privacy-policy.component';
import { TermsComponent } from './pages/terms/terms.component';
import { MatCardModule } from '@angular/material/card';

@NgModule({
  declarations: [AboutComponent, ContactComponent, HelpComponent, PrivacyPolicyComponent, TermsComponent],
  imports: [CommonModule, MatCardModule],
})
export class ResourcesModule {}
