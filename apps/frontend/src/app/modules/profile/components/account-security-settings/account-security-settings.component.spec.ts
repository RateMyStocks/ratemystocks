import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountSecuritySettingsComponent } from './account-security-settings.component';

describe('AccountSecuritySettingsComponent', () => {
  let component: AccountSecuritySettingsComponent;
  let fixture: ComponentFixture<AccountSecuritySettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccountSecuritySettingsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountSecuritySettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
