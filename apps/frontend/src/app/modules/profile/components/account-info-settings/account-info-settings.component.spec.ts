import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MessageService } from 'primeng/api';
import { ProfileModule } from '../../profile.module';

import { AccountInfoSettingsComponent } from './account-info-settings.component';

describe('AccountInfoSettingsComponent', () => {
  let component: AccountInfoSettingsComponent;
  let fixture: ComponentFixture<AccountInfoSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AccountInfoSettingsComponent],
      imports: [ProfileModule, HttpClientTestingModule, RouterTestingModule],
      providers: [
        {
          provide: MessageService,
        },
      ],
    }).compileComponents();
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
