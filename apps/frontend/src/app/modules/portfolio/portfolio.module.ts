import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PortfolioComponent } from './pages/portfolio/portfolio.component';
import { PortfoliosComponent } from './pages/portfolios/portfolios.component';



@NgModule({
  declarations: [
    PortfolioComponent,
    PortfoliosComponent
  ],
  imports: [
    CommonModule
  ]
})
export class PortfolioModule { }
