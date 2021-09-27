import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WelcomeDialogComponent } from './welcome-dialog.component';
import { CoreModule } from '../core.module';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RouterTestingModule } from '@angular/router/testing';

describe('WelcomeDialogComponent', () => {
  let component: WelcomeDialogComponent;
  let fixture: ComponentFixture<WelcomeDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CoreModule, RouterTestingModule],
      declarations: [WelcomeDialogComponent],
      providers: [{ provide: MAT_DIALOG_DATA, useValue: { user: { name: 'Test', email: 'test@email.com' } } }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WelcomeDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
