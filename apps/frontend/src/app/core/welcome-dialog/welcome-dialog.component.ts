import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SignInResponseDto } from '@ratemystocks/api-interface';
import { AuthService } from '../services/auth.service';

export interface DialogData {
  user: SignInResponseDto;
}
@Component({
  selector: 'app-welcome-dialog',
  templateUrl: './welcome-dialog.component.html',
  styleUrls: ['./welcome-dialog.component.scss'],
})
export class WelcomeDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData, private authService: AuthService) {}

  /** Event handler for clicking the "Resend" button. Calls the backend to resend the verification email. */
  onClickResendVerificationEmail(): void {
    const emailVerificationInfoDto: { userId: string; username: string; email: string } = {
      userId: this.data.user.userId,
      username: this.data.user.username,
      email: this.data.user.email,
    };
    this.authService.sendVerificationEmail(emailVerificationInfoDto);
  }
}
