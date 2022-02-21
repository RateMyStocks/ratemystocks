import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShareOnSocialMediaSpeedDialComponent } from './share-on-social-media-speed-dial.component';

describe('ShareOnSocialMediaSpeedDialComponent', () => {
  let component: ShareOnSocialMediaSpeedDialComponent;
  let fixture: ComponentFixture<ShareOnSocialMediaSpeedDialComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShareOnSocialMediaSpeedDialComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShareOnSocialMediaSpeedDialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
