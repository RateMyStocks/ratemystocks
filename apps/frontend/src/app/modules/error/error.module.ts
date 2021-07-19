import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotFoundComponent } from './not-found/not-found.component';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [NotFoundComponent],
  imports: [CommonModule, RouterModule, MatButtonModule],
})
export class ErrorModule {}
