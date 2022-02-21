import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CopyPageLinkComponent } from './copy-page-link.component';

describe('CopyPageLinkComponent', () => {
  let component: CopyPageLinkComponent;
  let fixture: ComponentFixture<CopyPageLinkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CopyPageLinkComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CopyPageLinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
