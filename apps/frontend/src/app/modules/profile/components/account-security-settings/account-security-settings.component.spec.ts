import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MessageService } from 'primeng/api';
import { ProfileModule } from '../../profile.module';

import { AccountSecuritySettingsComponent } from './account-security-settings.component';

describe('AccountSecuritySettingsComponent', () => {
  let component: AccountSecuritySettingsComponent;
  let fixture: ComponentFixture<AccountSecuritySettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AccountSecuritySettingsComponent],
      imports: [ProfileModule, HttpClientTestingModule, RouterTestingModule],
      providers: [{ provide: MessageService }],
    }).compileComponents();
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
