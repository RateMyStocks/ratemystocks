import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DebugElement } from '@angular/core';
import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { MatSort } from '@angular/material/sort';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import {
  CreatePortfolioRatingDto,
  PortfolioDto,
  PortfolioRatingDto,
  PortfolioStockDto,
} from '@ratemystocks/api-interface';
import { AuthService } from '../../../../core/services/auth.service';
import { IexCloudService } from '../../../../core/services/iex-cloud.service';
import { PortfolioService } from '../../../../core/services/portfolio.service';
import { Observable, of, Subject } from 'rxjs';
import { PortfolioComponent } from './portfolio.component';
import { PortfolioModule } from '../../portfolio.module';

Date.now = jest.fn(() => new Date(Date.UTC(2021, 5, 28)).valueOf()); // 6/28/2021

class MockAuthService {
  isAuthorized() {
    return true;
  }

  getUserId(): string {
    return '2498f310-cbc6-4af0-bab6-793e640aede4';
  }

  getAuthStatusListener(): Observable<boolean> {
    return new Subject<boolean>();
  }
}

class MockPortfolioService {
  getPortfolio(id: string) {
    const portfolio: PortfolioDto = {
      id,
      name: 'Test Portfolio',
      description: 'Test Description',
      dateCreated: '2021-01-08T06:49:31.108Z',
      lastUpdated: '2021-01-09T06:49:31.108Z',
      user: {
        id: '2498f310-cbc6-4af0-bab6-793e640aede4',
        username: 'johnsmith23',
        email: 'jsmith23@gmail.com',
      },
    };
    return of(portfolio);
  }

  getPortfolioStocks(id: string) {
    const portfolioStocks: PortfolioStockDto[] = [
      { ticker: 'MSFT', weighting: 40 },
      { ticker: 'AMZN', weighting: 60 },
    ];

    return of(portfolioStocks);
  }

  getPortfolioRatingCounts(portfolioId: string) {
    return of({ likes: 78, dislikes: 2 });
  }

  getPortfolioUserRating(portfolioId: string) {
    return of(null);
  }

  createOrUpdatePortfolioRating(
    portfolioId: string,
    portfolioRatingsDto: CreatePortfolioRatingDto
  ): Observable<PortfolioRatingDto> {
    return of({
      id: '7227ca17-dce3-4a11-b978-eec09b6a93a8',
      userId: '5aa5ea07-96a1-4568-b222-058a1a1b4af0',
      portfolioId: 'ebf4758a-f78b-4375-ad66-1c951df0cdc0',
      isLiked: true,
      lastUpdated: new Date(),
    });
  }

  deletePortfolioRating(portfolioId: string) {
    return of(void 0);
  }
}

class MockIexCloudService {
  batchGetStocks(symbols: string[], endpoints: string[]) {
    const iexStockDataMap = {
      MSFT: {
        company: {
          companyName: 'Microsoft Corp.',
          country: 'US',
          sector: 'Information Technology',
        },
        stats: {
          companyName: 'Microsoft Corp.',
          dividendYield: 0.0105,
          marketcap: 1733000000000,
          peRatio: 32.02,
          beta: 0.81,
        },
      },
      AMZN: {
        company: {
          companyName: 'Amazon',
          country: 'US',
          sector: 'Consumer Goods',
        },
        stats: {
          companyName: 'Amazon',
          dividendYield: 0,
          marketcap: 1643000000000,
          peRatio: 71.83,
          beta: 1.13,
        },
      },
    };

    return of(iexStockDataMap);
  }
}

describe('PortfolioComponent', () => {
  let component: PortfolioComponent;
  let fixture: ComponentFixture<PortfolioComponent>;

  let mockPortfolioService: MockPortfolioService;
  let mockIexCloudService: MockIexCloudService;
  let mockAuthService: MockAuthService;

  /**
   * Official Jest workaround for mocking methods that are not implemented in JSDOM
   * {@link https://jestjs.io/docs/manual-mocks#mocking-methods-which-are-not-implemented-in-jsdom}
   * {@link https://stackoverflow.com/questions/39830580/jest-test-fails-typeerror-window-matchmedia-is-not-a-function}
   */
  beforeAll(() => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(), // Deprecated
        removeListener: jest.fn(), // Deprecated
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })),
    });
  });

  beforeEach(async(() => {
    mockPortfolioService = new MockPortfolioService();
    mockIexCloudService = new MockIexCloudService();
    mockAuthService = new MockAuthService();

    TestBed.configureTestingModule({
      declarations: [PortfolioComponent, MatSort],
      imports: [HttpClientTestingModule, PortfolioModule, BrowserAnimationsModule, RouterTestingModule],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: of({ get: (id: string) => '7227ca17-dce3-4a11-b978-eec09b6a93a8' }),
          },
        },
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
        {
          provide: PortfolioService,
          useValue: mockPortfolioService,
        },
        {
          provide: IexCloudService,
          useValue: mockIexCloudService,
        },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PortfolioComponent);
    component = fixture.componentInstance;

    component.portfolioLoaded = true;

    fixture.detectChanges();
  });

  it('should call the /GET portfolio API endpoint with the portfolio ID from URL path param', () => {
    spyOn(mockPortfolioService, 'getPortfolio').and.callThrough();

    component.ngOnInit();

    expect(mockPortfolioService.getPortfolio).toHaveBeenCalledWith('7227ca17-dce3-4a11-b978-eec09b6a93a8');
  });

  it('should populate the page with Portfolio data', async(() => {
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      fixture.detectChanges();

      /** BANNER SECTION */
      const portfolioHeader: DebugElement = fixture.debugElement.query(By.css('.active-breadcrumb'));
      expect(portfolioHeader.nativeElement.textContent.trim()).toEqual('Test Portfolio');

      const portfolioOwnerHeader: DebugElement = fixture.debugElement.query(By.css('#portfolio-creator'));
      expect(portfolioOwnerHeader.nativeElement.textContent.trim()).toEqual('Creator: johnsmith23');

      const portfolioCreatedDate: DebugElement = fixture.debugElement.query(By.css('#portfolio-created-date'));
      expect(portfolioCreatedDate.nativeElement.textContent.trim()).toEqual('Created on January 8, 2021');

      const portfolioLastUpdatedDate: DebugElement = fixture.debugElement.query(By.css('#portfolio-last-updated-date'));
      expect(portfolioLastUpdatedDate.nativeElement.textContent.trim()).toEqual('Last Updated 6 months ago');

      const portfolioLikes: DebugElement = fixture.debugElement.query(By.css('#portfolio-likes-value'));
      expect(portfolioLikes.nativeElement.textContent.trim()).toEqual('78');

      const portfolioDislikes: DebugElement = fixture.debugElement.query(By.css('#portfolio-dislikes-value'));
      expect(portfolioDislikes.nativeElement.textContent.trim()).toEqual('2');

      /** DESCRIPTION SECTION */
      const portfolioDescription: DebugElement = fixture.debugElement.query(By.css('#portfolio-description'));
      expect(portfolioDescription.nativeElement.textContent.trim()).toEqual('Test Description');

      /** STATS SECTION */
      const portfolioStats: DebugElement[] = fixture.debugElement.queryAll(
        By.css('#portfolio-stats-card .portfolio-stat')
      );
      expect(portfolioStats[0].nativeElement.textContent.trim()).toEqual('# of Holdings: 2');
      expect(portfolioStats[1].nativeElement.textContent.trim()).toEqual('Top 10 Weighting: 100.00%');
      expect(portfolioStats[2].nativeElement.textContent.trim()).toEqual('Top Holding: AMZN');
      expect(portfolioStats[3].nativeElement.textContent.trim()).toEqual('Top Country: US');
      expect(portfolioStats[4].nativeElement.textContent.trim()).toEqual('Top Sector: Consumer Goods');
      expect(portfolioStats[5].nativeElement.textContent.trim()).toEqual('Dividend Yield: 0.42%');
      expect(portfolioStats[6].nativeElement.textContent.trim()).toEqual('Market Cap: $1.7T');
      expect(portfolioStats[7].nativeElement.textContent.trim()).toEqual('P/E Ratio: 55.91');
      expect(portfolioStats[8].nativeElement.textContent.trim()).toEqual('Beta: 1.00');
    });
  }));

  it('should show default text for the portfolio description when there is no actual description set', () => {
    component.portfolio.description = null;
    fixture.detectChanges();

    const portfolioDescription: DebugElement = fixture.debugElement.query(By.css('#portfolio-description'));
    expect(portfolioDescription.nativeElement.textContent.trim()).toEqual('No description');
  });

  it('should update the portfolio ratings counts when the like or dislike buttons are clicked', fakeAsync(() => {
    const portfolioLikes: DebugElement = fixture.debugElement.query(By.css('#portfolio-likes-value'));
    expect(portfolioLikes.nativeElement.textContent.trim()).toEqual('78');

    const portfolioDislikes: DebugElement = fixture.debugElement.query(By.css('#portfolio-dislikes-value'));
    expect(portfolioDislikes.nativeElement.textContent.trim()).toEqual('2');

    // Click Like button
    const likeButton: DebugElement = fixture.debugElement.query(By.css('#portfolio-like-icon'));
    likeButton.triggerEventHandler('click', null);
    tick();
    fixture.detectChanges();
    expect(portfolioLikes.nativeElement.textContent.trim()).toEqual('79');
    expect(portfolioDislikes.nativeElement.textContent.trim()).toEqual('2');

    // Click Like button again to undo like
    likeButton.triggerEventHandler('click', null);
    tick();
    fixture.detectChanges();
    expect(portfolioLikes.nativeElement.textContent.trim()).toEqual('78');
    expect(portfolioDislikes.nativeElement.textContent.trim()).toEqual('2');

    // Mock the PortfolioService so the next created rating will be a "Dislike"
    const createRatingSpy = spyOn(mockPortfolioService, 'createOrUpdatePortfolioRating').and.returnValue(
      of({
        id: '7227ca17-dce3-4a11-b978-eec09b6a93a8',
        userId: '5aa5ea07-96a1-4568-b222-058a1a1b4af0',
        portfolioId: 'ebf4758a-f78b-4375-ad66-1c951df0cdc0',
        // Mock the next portfolio rating that is created to be a dislike
        isLiked: false,
        lastUpdated: new Date(),
      })
    );

    // Click Dislike button
    const dislikeButton: DebugElement = fixture.debugElement.query(By.css('#portfolio-dislike-icon'));
    dislikeButton.triggerEventHandler('click', null);
    tick();
    fixture.detectChanges();
    expect(portfolioLikes.nativeElement.textContent.trim()).toEqual('78');
    expect(portfolioDislikes.nativeElement.textContent.trim()).toEqual('3');

    // Click Dislike button again to undo dislike
    dislikeButton.triggerEventHandler('click', null);
    tick();
    fixture.detectChanges();
    expect(portfolioLikes.nativeElement.textContent.trim()).toEqual('78');
    expect(portfolioDislikes.nativeElement.textContent.trim()).toEqual('2');

    createRatingSpy.and.returnValue(
      of({
        id: '7227ca17-dce3-4a11-b978-eec09b6a93a8',
        userId: '5aa5ea07-96a1-4568-b222-058a1a1b4af0',
        portfolioId: 'ebf4758a-f78b-4375-ad66-1c951df0cdc0',
        // Mock the next portfolio rating that is created to be a dislike
        isLiked: true,
        lastUpdated: new Date(),
      })
    );

    // Click Like button
    likeButton.triggerEventHandler('click', null);
    tick();
    fixture.detectChanges();
    expect(portfolioLikes.nativeElement.textContent.trim()).toEqual('79');
    expect(portfolioDislikes.nativeElement.textContent.trim()).toEqual('2');

    createRatingSpy.and.returnValue(
      of({
        id: '7227ca17-dce3-4a11-b978-eec09b6a93a8',
        userId: '5aa5ea07-96a1-4568-b222-058a1a1b4af0',
        portfolioId: 'ebf4758a-f78b-4375-ad66-1c951df0cdc0',
        // Mock the next portfolio rating that is created to be a dislike
        isLiked: false,
        lastUpdated: new Date(),
      })
    );

    // Click Dislike button again to undo like
    dislikeButton.triggerEventHandler('click', null);
    tick();
    fixture.detectChanges();
    expect(portfolioLikes.nativeElement.textContent.trim()).toEqual('78');
    expect(portfolioDislikes.nativeElement.textContent.trim()).toEqual('3');

    // Click Like button to undo dislike
    likeButton.triggerEventHandler('click', null);
    tick();
    fixture.detectChanges();
    expect(portfolioLikes.nativeElement.textContent.trim()).toEqual('79');
    expect(portfolioDislikes.nativeElement.textContent.trim()).toEqual('2');
  }));

  it('should redirect to the appropriate social media site when the corresponding icon is clicked', () => {
    const socialMediaIcons: DebugElement[] = fixture.debugElement.queryAll(By.css('.social-media-icons-container img'));

    const shareOnSocialMediaSpy = spyOn(component, 'shareOnSocialMedia').and.callThrough();
    const windowSpy = spyOn(window, 'open');

    socialMediaIcons[0].triggerEventHandler('click', null); // Click Reddit
    socialMediaIcons[1].triggerEventHandler('click', null); // Click Facebok
    socialMediaIcons[2].triggerEventHandler('click', null); // Click Twitter

    expect(shareOnSocialMediaSpy).toHaveBeenCalledWith('http://www.reddit.com/submit?url=');
    expect(windowSpy).toHaveBeenCalledWith('http://www.reddit.com/submit?url=' + window.location.href, '_blank');

    expect(shareOnSocialMediaSpy).toHaveBeenCalledWith('https://www.facebook.com/sharer/sharer.php?u=');
    expect(windowSpy).toHaveBeenCalledWith(
      'https://www.facebook.com/sharer/sharer.php?u=' + window.location.href,
      '_blank'
    );

    expect(shareOnSocialMediaSpy).toHaveBeenCalledWith('http://twitter.com/share?text=Check out my portfolio!&url=');
    expect(windowSpy).toHaveBeenCalledWith(
      'http://twitter.com/share?text=Check out my portfolio!&url=' + window.location.href,
      '_blank'
    );

    expect(shareOnSocialMediaSpy).toHaveBeenCalledTimes(3);
    expect(windowSpy).toHaveBeenCalledTimes(3);
  });

  it('should call the correct handler when the copy link button is clicked', () => {
    const copyButton: DebugElement = fixture.debugElement.queryAll(By.css('.social-media-icons-container img'))[3];

    const copySpy = spyOn(component, 'onCopyPageLink').and.callThrough();

    copyButton.triggerEventHandler('click', null);

    expect(copySpy).toHaveBeenCalledTimes(1);
  });

  // Edge & Corner cases: call component methods directly

  // TODO: Test for no holdings

  // TODO: empty string when getHighestWeightedIexCloudValue is called but the valueWeightingMap is empty

  // TODO: Check if isAuth and user owns the portfolio - if so, "edit" buttons/icons should show

  // TODO: Test if "getLargestHolding" when all holdings are the same (should default to something)
});
