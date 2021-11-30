// import { DebugElement } from '@angular/core';
// import { async, ComponentFixture, TestBed } from '@angular/core/testing';
// import { MatOption } from '@angular/material/core';
// import { MatSelectChange } from '@angular/material/select';
// import { By } from '@angular/platform-browser';
// import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// import { RouterTestingModule } from '@angular/router/testing';
// import { PortfolioStockDto } from '@ratemystocks/api-interface';
// import { PortfolioModule } from '../../portfolio.module';
// import { PortfolioHoldingsTableReadonlyComponent } from './portfolio-holdings-table-readonly.component';

// describe('PortfolioHoldingsTableReadonlyComponent', () => {
//   let component: PortfolioHoldingsTableReadonlyComponent;
//   let fixture: ComponentFixture<PortfolioHoldingsTableReadonlyComponent>;

//   enum FilterType {
//     Search,
//     Country,
//     Sector,
//     MarketCap,
//   }

//   enum MarketCap {
//     MegaCap = 'Mega Cap',
//     LargeCap = 'Large Cap',
//     MidCap = 'Mid Cap',
//     SmallCap = 'Small Cap',
//     MicroCap = 'Micro Cap',
//   }

//   beforeEach(async(() => {
//     TestBed.configureTestingModule({
//       declarations: [PortfolioHoldingsTableReadonlyComponent],
//       imports: [PortfolioModule, RouterTestingModule, BrowserAnimationsModule],
//     }).compileComponents();
//   }));

//   beforeEach(() => {
//     fixture = TestBed.createComponent(PortfolioHoldingsTableReadonlyComponent);
//     component = fixture.componentInstance;

//     component.portfolioStocks = [
//       {
//         id: '8ad52d25-6afb-4c74-bf68-6afcc1db27db',
//         ticker: 'MSFT',
//         weighting: 35.15,
//         portfolioId: '8ad52d25-6afb-4c74-bf68-6afcc1db27db',
//       },
//       {
//         id: '519f9bcb-6018-454a-94ed-44d4dc714b8b',
//         ticker: 'GOOG',
//         weighting: 30.0,
//         portfolioId: '8ad52d25-6afb-4c74-bf68-6afcc1db27db',
//       },
//       {
//         id: '91f53836-6a2a-4de3-8ce4-0a26b35e4c71',
//         ticker: 'BABA',
//         weighting: 15.0,
//         portfolioId: '8ad52d25-6afb-4c74-bf68-6afcc1db27db',
//       },
//       {
//         id: '91f53836-6a2a-4de3-8ce4-0a26b35e4c71',
//         ticker: 'FB',
//         weighting: 19.85,
//         portfolioId: '8ad52d25-6afb-4c74-bf68-6afcc1db27db',
//       },
//     ];

//     component.iexStockDataMap = {
//       MSFT: {
//         company: {
//           companyName: 'Microsoft Corp.',
//           country: 'US',
//           sector: 'Information Technology',
//           issueType: 'cs',
//         },
//         stats: {
//           companyName: 'Microsoft Corp.',
//           dividendYield: 0.0105,
//           marketcap: 1733000000000,
//         },
//         price: 300.0,
//       },
//       GOOG: {
//         company: {
//           companyName: 'Google',
//           country: 'US',
//           sector: 'Information Technology',
//           issueType: 'cs',
//         },
//         stats: {
//           companyName: 'Google',
//           dividendYield: 0,
//           marketcap: 1243000000000,
//         },
//         price: 2800.0,
//       },
//       FB: {
//         company: {
//           companyName: 'Facebook',
//           country: 'US',
//           sector: 'Technology Services',
//           issueType: 'cs',
//         },
//         stats: {
//           companyName: 'Facebook',
//           dividendYield: 0,
//           marketcap: 796430000000,
//         },
//         price: 250.0,
//       },
//       BABA: {
//         company: {
//           companyName: 'Alibaba',
//           country: 'CN',
//           sector: 'Information Technology',
//           issueType: 'cs',
//         },
//         stats: {
//           companyName: 'Alibaba',
//           dividendYield: 0.0067,
//           marketcap: 2153000000000,
//         },
//         price: 180.0,
//       },
//     };

//     fixture.detectChanges();
//   });

//   it('should create', () => {
//     expect(component).toBeTruthy();
//   });

//   it('should populate the table with data from the portfolio stocks & sorted by weighting by default', async(() => {
//     component.ngAfterViewInit();
//     fixture.detectChanges();
//     fixture.whenStable().then(() => {
//       const tableRows: DebugElement[] = fixture.debugElement.queryAll(By.css('.mat-row'));
//       expect(tableRows.length).toEqual(4);

//       // Row 1
//       expect(tableRows[0].query(By.css('.mat-column-ticker')).nativeElement.textContent).toContain('MSFT');
//       expect(tableRows[0].query(By.css('.mat-column-ticker')).nativeElement.textContent).toContain('Microsoft Corp.');
//       expect(tableRows[0].query(By.css('.mat-column-weighting')).nativeElement.textContent).toEqual('35.15%');
//       expect(tableRows[0].query(By.css('.mat-column-price')).nativeElement.textContent).toEqual('$300.00');
//       expect(tableRows[0].query(By.css('.mat-column-securityType')).nativeElement.textContent).toEqual('Stock');
//       expect(tableRows[0].query(By.css('.mat-column-country')).nativeElement.textContent).toEqual('US');
//       expect(tableRows[0].query(By.css('.mat-column-dividendYield')).nativeElement.textContent).toEqual('1.05%');
//       expect(tableRows[0].query(By.css('.mat-column-marketCap')).nativeElement.textContent).toEqual('$1.7T');

//       // Row 2
//       expect(tableRows[1].query(By.css('.mat-column-ticker')).nativeElement.textContent).toContain('GOOG');
//       expect(tableRows[1].query(By.css('.mat-column-ticker')).nativeElement.textContent).toContain('Google');
//       expect(tableRows[1].query(By.css('.mat-column-weighting')).nativeElement.textContent).toEqual('30.00%');
//       expect(tableRows[1].query(By.css('.mat-column-price')).nativeElement.textContent).toEqual('$2800.00');
//       expect(tableRows[1].query(By.css('.mat-column-securityType')).nativeElement.textContent).toEqual('Stock');
//       expect(tableRows[1].query(By.css('.mat-column-country')).nativeElement.textContent).toEqual('US');
//       expect(tableRows[1].query(By.css('.mat-column-dividendYield')).nativeElement.textContent).toEqual('0.00%');
//       expect(tableRows[1].query(By.css('.mat-column-marketCap')).nativeElement.textContent).toEqual('$1.2T');

//       // Row 3
//       expect(tableRows[2].query(By.css('.mat-column-ticker')).nativeElement.textContent).toContain('FB');
//       expect(tableRows[2].query(By.css('.mat-column-ticker')).nativeElement.textContent).toContain('Facebook');
//       expect(tableRows[2].query(By.css('.mat-column-weighting')).nativeElement.textContent).toEqual('19.85%');
//       expect(tableRows[2].query(By.css('.mat-column-price')).nativeElement.textContent).toEqual('$250.00');
//       expect(tableRows[2].query(By.css('.mat-column-securityType')).nativeElement.textContent).toEqual('Stock');
//       expect(tableRows[2].query(By.css('.mat-column-country')).nativeElement.textContent).toEqual('US');
//       expect(tableRows[2].query(By.css('.mat-column-dividendYield')).nativeElement.textContent).toEqual('0.00%');
//       expect(tableRows[2].query(By.css('.mat-column-marketCap')).nativeElement.textContent).toEqual('$796.4B');

//       // Row 4
//       expect(tableRows[3].query(By.css('.mat-column-ticker')).nativeElement.textContent).toContain('BABA');
//       expect(tableRows[3].query(By.css('.mat-column-ticker')).nativeElement.textContent).toContain('Alibaba');
//       expect(tableRows[3].query(By.css('.mat-column-weighting')).nativeElement.textContent).toEqual('15.00%');
//       expect(tableRows[3].query(By.css('.mat-column-price')).nativeElement.textContent).toEqual('$180.00');
//       expect(tableRows[3].query(By.css('.mat-column-securityType')).nativeElement.textContent).toEqual('Stock');
//       expect(tableRows[3].query(By.css('.mat-column-country')).nativeElement.textContent).toEqual('CN');
//       expect(tableRows[3].query(By.css('.mat-column-dividendYield')).nativeElement.textContent).toEqual('0.67%');
//       expect(tableRows[3].query(By.css('.mat-column-marketCap')).nativeElement.textContent).toEqual('$2.2T');

//       const topTenTotalWeighting: DebugElement = fixture.debugElement.query(By.css('#top-ten-total-weighting'));
//       expect(topTenTotalWeighting.nativeElement.textContent).toEqual('Total Top 10 Weighting: 100.00%');

//       const weightedAvgDividendYield: DebugElement = fixture.debugElement.query(By.css('#weighted-avg-dividend-yield'));
//       expect(weightedAvgDividendYield.nativeElement.textContent).toEqual(' Weighted Avg. Dividend Yield: 0.47%');

//       const weightedAvgMarketCap: DebugElement = fixture.debugElement.query(By.css('#weighted-avg-market-cap'));
//       expect(weightedAvgMarketCap.nativeElement.textContent).toEqual(' Weighted Avg. Market Cap: $1.5T');
//     });
//   }));

//   it('should set the countries and sectors from the porfolio stocks onto the multi-select dropdown filters', () => {
//     component.ngOnChanges();

//     fixture.detectChanges();
//     fixture.whenStable().then(() => {
//       const countryOptions: MatOption[] = component.countryFilterDropdown.options.toArray();
//       expect(countryOptions.length).toEqual(2);
//       expect(countryOptions[0].viewValue).toBe('US');
//       expect(countryOptions[1].viewValue).toBe('CN');

//       const sectorOptions: MatOption[] = component.sectorFilterDropdown.options.toArray();
//       expect(sectorOptions.length).toEqual(2);
//       expect(sectorOptions[0].viewValue).toEqual('Information Technology');
//       expect(sectorOptions[1].viewValue).toEqual('Technology Services');
//     });
//   });

//   it('should filter the table using the text input and multi-select dropdowns', async () => {
//     component.ngOnChanges();
//     component.ngAfterViewInit();

//     fixture.detectChanges();
//     fixture.whenStable().then(() => {
//       const tableRows: DebugElement[] = fixture.debugElement.queryAll(By.css('.mat-row'));
//       expect(tableRows.length).toEqual(4);

//       // Rows pre-filtering
//       expect(tableRows[0].query(By.css('.mat-column-ticker')).nativeElement.textContent).toContain('MSFT');
//       expect(tableRows[1].query(By.css('.mat-column-ticker')).nativeElement.textContent).toContain('GOOG');
//       expect(tableRows[2].query(By.css('.mat-column-ticker')).nativeElement.textContent).toContain('FB');
//       expect(tableRows[3].query(By.css('.mat-column-ticker')).nativeElement.textContent).toContain('BABA');

//       const countryOptions: MatOption[] = component.countryFilterDropdown.options.toArray();
//       expect(countryOptions.length).toEqual(2);

//       const sectorOptions: MatOption[] = component.sectorFilterDropdown.options.toArray();
//       expect(sectorOptions.length).toEqual(2);

//       const marketCapOptions: MatOption[] = component.marketCapFilterDropdown.options.toArray();

//       // Spy on MatSelectChange event handler
//       const applyFilterForDropdownsSpy = spyOn(component, 'applyFilterForDropdowns').and.callThrough();
//       const filterPredicateSpy = spyOn(component, 'customFilterPredicate').and.callThrough();

//       // Select the second country in the multi-select dropdown and verify the callback was called correctly
//       countryOptions[1]._selectViaInteraction();
//       expect(applyFilterForDropdownsSpy).toHaveBeenCalledWith(jasmine.any(MatSelectChange), FilterType.Country);

//       // Select the second sector in the multi-select dropdown and verify the callback was called correctly
//       sectorOptions[0]._selectViaInteraction();
//       expect(applyFilterForDropdownsSpy).toHaveBeenCalledWith(jasmine.any(MatSelectChange), FilterType.Sector);

//       // Select 'Small Cap' in the multi-select Market Cap dropdown and verify the callback was called correctly
//       marketCapOptions[3]._selectViaInteraction();
//       expect(applyFilterForDropdownsSpy).toHaveBeenCalledWith(jasmine.any(MatSelectChange), FilterType.MarketCap);

//       expect(applyFilterForDropdownsSpy).toHaveBeenCalledTimes(3);
//       // TODO: Figure out why this spy isn't getting called, even though it clearly gets into this method
//       // expect(filterPredicateSpy).toHaveBeenCalled();

//       // TODO: For some reason testing that the tr elements are updated isn't working. Figure out why
//     });
//   });

//   // TODO: Calling the component method that we are testing directly isn't very BDD, but it will have to do for now
//   it('should return true if a stock from the table matches multiple filter criterias, false otherwise', () => {
//     // MSFT has country: 'US', sector: 'Information Technology', & is a 'Mega Cap' stock in the iexStockDataMap
//     const testStock: PortfolioStockDto = {
//       id: '8ad52d25-6afb-4c74-bf68-6afcc1db27db',
//       ticker: 'MSFT',
//       weighting: 100.0,
//       portfolioId: '8ad52d25-6afb-4c74-bf68-6afcc1db27db',
//     };

//     let result = false;

//     // Filter by Country = US
//     component.countryFiltersBeingApplied = new Set(['US']);
//     result = component.customFilterPredicate(testStock, null);
//     expect(result).toBe(true);

//     // Filter by Country = China
//     component.countryFiltersBeingApplied = new Set(['CN']);
//     result = component.customFilterPredicate(testStock, null);
//     expect(result).toBe(false);

//     // Filter by Country = US, Sector = Information Technology
//     component.countryFiltersBeingApplied = new Set(['US']);
//     component.sectorFiltersBeingApplied = new Set(['Information Technology']);
//     result = component.customFilterPredicate(testStock, null);
//     expect(result).toBe(true);

//     // Filter by Country = US, Sector = Information Technology
//     component.sectorFiltersBeingApplied = new Set(['Technology Services']);
//     result = component.customFilterPredicate(testStock, null);
//     expect(result).toBe(false);

//     // Filter by Country = US, Sector = Information Technology, Market Cap = 'Mega Cap'
//     component.sectorFiltersBeingApplied = new Set(['Information Technology']);
//     component.marketCapFiltersBeingApplied = new Set([MarketCap.MegaCap]);
//     result = component.customFilterPredicate(testStock, null);
//     expect(result).toBe(true);

//     // Filter by Country = US, Sector = Information Technology, Market Cap = 'Small Cap'
//     component.marketCapFiltersBeingApplied = new Set([MarketCap.SmallCap]);
//     result = component.customFilterPredicate(testStock, null);
//     expect(result).toBe(false);

//     // Filter by Country = US, Sector = Information Technology, Market Cap = 'Mega Cap', and Ticker = MSFT
//     component.textSearchFilterBeingApplied = 'MSFT';
//     component.marketCapFiltersBeingApplied = new Set([MarketCap.MegaCap]);
//     result = component.customFilterPredicate(testStock, null);
//     expect(result).toBe(true);

//     // Filter by Country = US, Sector = Information Technology, Market Cap = 'Mega Cap', and Ticker = BABA
//     component.textSearchFilterBeingApplied = 'BABA';
//     result = component.customFilterPredicate(testStock, null);
//     expect(result).toBe(false);
//   });

//   it('should return true in the customFilterPredicate if the stock matches the text search input', () => {
//     // MSFT: country = 'US', sector = 'Information Technology', & market cap = 'Mega Cap' in iexStockDataMap
//     const testStock: PortfolioStockDto = {
//       id: '8ad52d25-6afb-4c74-bf68-6afcc1db27db',
//       ticker: 'MSFT',
//       weighting: 100.0,
//       portfolioId: '8ad52d25-6afb-4c74-bf68-6afcc1db27db',
//     };

//     let result = false;

//     // Filter by Ticker Symbol
//     component.textSearchFilterBeingApplied = 'M';
//     result = component.customFilterPredicate(testStock, null);
//     expect(result).toBe(true);

//     component.textSearchFilterBeingApplied = 'mS';
//     result = component.customFilterPredicate(testStock, null);
//     expect(result).toBe(true);

//     component.textSearchFilterBeingApplied = 'mSf';
//     result = component.customFilterPredicate(testStock, null);
//     expect(result).toBe(true);

//     component.textSearchFilterBeingApplied = 'mSfT';
//     result = component.customFilterPredicate(testStock, null);
//     expect(result).toBe(true);

//     component.textSearchFilterBeingApplied = 'mSfTXZ';
//     result = component.customFilterPredicate(testStock, null);
//     expect(result).toBe(false);

//     // Filter by Company Name
//     component.textSearchFilterBeingApplied = 'MicRo';
//     result = component.customFilterPredicate(testStock, null);
//     expect(result).toBe(true);

//     component.textSearchFilterBeingApplied = 'MicRosoft';
//     result = component.customFilterPredicate(testStock, null);
//     expect(result).toBe(true);

//     component.textSearchFilterBeingApplied = 'MicRosoftXCZD';
//     result = component.customFilterPredicate(testStock, null);
//     expect(result).toBe(false);
//   });
// });
