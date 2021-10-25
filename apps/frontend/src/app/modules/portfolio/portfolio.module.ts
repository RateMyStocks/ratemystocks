import { ClipboardModule } from '@angular/cdk/clipboard';
import { CommonModule } from '@angular/common';
import { CreatePortfolioDialogComponent } from './components/create-portfolio-dialog/create-portfolio-dialog.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { PortfoliosComponent } from './pages/portfolios/portfolios.component';
import { PortfolioComponent } from './pages/portfolio/portfolio.component';
import { PortfolioHoldingsTableComponent } from './components/portfolio-holdings-table/portfolio-holdings-table.component';
import { SharedModule } from '../../shared/shared.module';
import { RouterModule } from '@angular/router';
import { PortfolioHoldingsTableReadonlyComponent } from './components/portfolio-holdings-table-readonly/portfolio-holdings-table-readonly.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { PortfoliosTableComponent } from './components/portfolios-table/portfolios-table.component';
import { UpdatePortfolioNameDialogComponent } from './components/update-portfolio-name-dialog/update-portfolio-name-dialog.component';
import { UpdatePortfolioDescriptionDialogComponent } from './components/update-portfolio-description-dialog/update-portfolio-description-dialog.component';
import { UpdatePortfolioHoldingsDialogComponent } from './components/update-portfolio-holdings-dialog/update-portfolio-holdings-dialog.component';
import { PortfolioRoutingModule } from './portfolio-routing.module';
import { AngularMaterialModule } from '../../angular-material.module';

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
    UpdatePortfolioHoldingsDialogComponent,
  ],
  imports: [
    AngularMaterialModule,
    ClipboardModule,
    CommonModule,
    FlexLayoutModule,
    FormsModule,
    NgxChartsModule,
    ReactiveFormsModule,
    PortfolioRoutingModule,
    RouterModule,
    SharedModule,
  ],
})
export class PortfolioModule {}
