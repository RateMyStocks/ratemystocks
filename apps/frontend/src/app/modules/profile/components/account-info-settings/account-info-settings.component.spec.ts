import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountInfoSettingsComponent } from './account-info-settings.component';

describe('AccountInfoSettingsComponent', () => {
  let component: AccountInfoSettingsComponent;
  let fixture: ComponentFixture<AccountInfoSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccountInfoSettingsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountInfoSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
