import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RouterModule } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { CoreModule } from '../../core/core.module';

@NgModule({
  declarations: [HomeComponent],
  imports: [CommonModule, CoreModule],
})
export class HomeModule {}
