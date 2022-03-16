import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { SharedModule } from '../../shared.module';

import { ShareOnSocialMediaSpeedDialComponent } from './share-on-social-media-speed-dial.component';

describe('ShareOnSocialMediaSpeedDialComponent', () => {
  let component: ShareOnSocialMediaSpeedDialComponent;
  let fixture: ComponentFixture<ShareOnSocialMediaSpeedDialComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ShareOnSocialMediaSpeedDialComponent],
      imports: [SharedModule, RouterTestingModule],
    }).compileComponents();
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
