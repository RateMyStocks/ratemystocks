import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatDividerModule } from '@angular/material/divider';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { FlexLayoutModule } from '@angular/flex-layout';
import { RouterModule } from '@angular/router';
import { StockSearchComponent } from './components/stock-search/stock-search.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
// import { HttpErrorInterceptor } from './interceptors/error-interceptor';
// import { GlobalErrorHandler } from './error-handlers/global-error-handler';
import { MatProgressBarModule } from '@angular/material/progress-bar';
// import { NgxPieChartComponent } from './components/ngx-pie-chart/ngx-pie-chart.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { MatCardModule } from '@angular/material/card';
import { NgxPieChartComponent } from './components/ngx-pie-chart/ngx-pie-chart.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// import { CoreModule } from '../core/core.module';

@NgModule({
  declarations: [StockSearchComponent, NgxPieChartComponent],
  imports: [
    BrowserAnimationsModule,
    CommonModule,
    // CoreModule,
    MatDividerModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatMenuModule,
    MatListModule,
    MatSidenavModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    NgxChartsModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    RouterModule,
    FlexLayoutModule,
    MatProgressBarModule,
  ],
  providers: [
    // {
    //   provide: HTTP_INTERCEPTORS,
    //   useClass: HttpErrorInterceptor,
    //   multi: true,
    // },
    // {
    //   provide: ErrorHandler,
    //   useClass: GlobalErrorHandler,
    // },
  ],
  exports: [StockSearchComponent, NgxPieChartComponent],
})
export class SharedModule {}
