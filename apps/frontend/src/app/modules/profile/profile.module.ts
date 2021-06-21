import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserProfileComponent } from './pages/user-profile/user-profile.component';
import { BrowserModule } from '@angular/platform-browser';

@NgModule({
  declarations: [UserProfileComponent],
  imports: [BrowserModule, CommonModule],
})
export class ProfileModule {}
