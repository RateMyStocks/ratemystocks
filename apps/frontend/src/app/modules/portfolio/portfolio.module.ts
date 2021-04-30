import { ClipboardModule } from '@angular/cdk/clipboard';
import { CommonModule } from '@angular/common';
import { CreatePortfolioDialogComponent } from './components/create-portfolio-dialog/create-portfolio-dialog.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTableModule } from '@angular/material/table';
import { NgModule } from '@angular/core';
import { PortfoliosComponent } from './pages/portfolios/portfolios.component';
import { PortfolioComponent } from './pages/portfolio/portfolio.component';
import { PortfolioHoldingsTableComponent } from './components/portfolio-holdings-table/portfolio-holdings-table.component';
import { SharedModule } from '../../shared/shared.module';
import { RouterModule } from '@angular/router';
import { PortfolioHoldingsTableReadonlyComponent } from './components/portfolio-holdings-table-readonly/portfolio-holdings-table-readonly.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { PortfoliosTableComponent } from './components/portfolios-table/portfolios-table.component';
import { UpdatePortfolioNameDialogComponent } from './components/update-portfolio-name-dialog/update-portfolio-name-dialog.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { UpdatePortfolioDescriptionDialogComponent } from './components/update-portfolio-description-dialog/update-portfolio-description-dialog.component';

@NgModule({
  declarations: [
    PortfoliosComponent,
    PortfolioComponent,
    CreatePortfolioDialogComponent,
    PortfolioHoldingsTableComponent,
    PortfolioHoldingsTableReadonlyComponent,
    PortfoliosTableComponent,
    UpdatePortfolioNameDialogComponent,
    UpdatePortfolioDescriptionDialogComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ClipboardModule,
    CommonModule,
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    MatBadgeModule,
    MatButtonModule,
    MatCardModule,
    MatChipsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatRadioModule,
    MatSnackBarModule,
    MatSelectModule,
    MatSortModule,
    MatStepperModule,
    MatTableModule,
    MatTooltipModule,
    NgxChartsModule,
    RouterModule,
    SharedModule,
  ],
})
export class PortfolioModule {}
