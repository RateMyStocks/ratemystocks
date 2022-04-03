import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShareOnSocialMediaBarComponent } from './share-on-social-media-bar.component';

describe('ShareOnSocialMediaBarComponent', () => {
  let component: ShareOnSocialMediaBarComponent;
  let fixture: ComponentFixture<ShareOnSocialMediaBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShareOnSocialMediaBarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShareOnSocialMediaBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
