import {
  Controller,
  Post,
  Body,
  ValidationPipe,
  Get,
  UseGuards,
  Param,
  Redirect,
  Response,
  Patch,
  ParseUUIDPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import {
  AuthCredentialDto,
  ChangePasswordDto,
  ForgotPasswordDto,
  SignUpDto,
  SignInResponseDto,
  UserSettingsDto,
} from '@ratemystocks/api-interface';
import { UserAccount } from '../../../models/userAccount.entity';
import { GetUser } from './get-user.decorator';
import { Response as ExpressResponse } from 'express';

require('dotenv').config();

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  /**
   * Attempts to sign-up a new user given some registration data.
   * @param signupDto The DTO containing new user info (i.e. username, email, password, etc.)
   */
  @Post('/signup')
  signUp(@Body(ValidationPipe) signupDto: SignUpDto): Promise<void> {
    return this.authService.signUp(signupDto);
  }

  /**
   * Attempts to sign-in a user given their login credentials.
   * @param authCredentialDto DTO containing username and password.
   * @returns A response DTO containing relevant login information.
   */
  @Post('/signin')
  async signIn(@Body() authCredentialDto: AuthCredentialDto): Promise<SignInResponseDto> {
    const signInData: { accessToken: string; user: UserAccount } = await this.authService.signIn(authCredentialDto);

    const signInDto: SignInResponseDto = {
      accessToken: signInData.accessToken,
      userId: signInData.user.id,
      username: signInData.user.username,
      email: signInData.user.email,
      spiritAnimal: signInData.user.spiritAnimal,
      // TODO: set expires in as ENV variable or something
      expiresIn: 3600,
    };
    return signInDto;
  }

  /**
   * Sends a verification email to a user. This endpoint will primarily be used for user's who need to have
   * the verification email resent if they haven't received one during signup or they defer verification for a later time.
   * @param userId The UUID of the user verifying their email.
   * @param email The email of the user to verify.
   */
  @Post('/sendverificationemail')
  @UseGuards(AuthGuard())
  sendVerificationEmail(@Body() userInfo: { userId: string; username: string; email: string }): Promise<void> {
    const { userId, username, email } = userInfo;
    return this.authService.sendVerificationEmail(userId, username, email);
  }

  /**
   * Endpoint that is called when an unverified user is verifying their email address.
   * @param userId The UUID of the user verifying their email.
   * @param res The response object
   */
  @Get('/verifyuser/:userId')
  @Redirect(process.env.FRONTEND_HOST, 200)
  async verifyEmail(@Param('userId', new ParseUUIDPipe()) userId: string, @Response() res: ExpressResponse): Promise<void> {
    try {
      await this.authService.verifyEmail(userId, res);
    } catch (error) {
      res.redirect(process.env.FRONTEND_HOST + '/not-found');
    }

    // Redirect to the homepage of the frontend
    res.redirect(process.env.FRONTEND_HOST);
  }

  /**
   * Sends an email to a user with a link to reset their password.
   * @param forgotPasswordDto DTO containing the email of the user to reset the password for.
   */
  @Post('/forgotpassword')
  async forgotPassword(@Body(ValidationPipe) forgotPasswordDto: ForgotPasswordDto): Promise<void> {
    return this.authService.forgotPassword(forgotPasswordDto);
  }

  /**
   * Validates the userId and JWT from a reset password one-time link.
   * @param userId The UUID of the user who was sent the one-time link to reset their password.
   * @param token The JWT generated for the one-time link.
   */
  @Get('/resetpassword/validation/:userid/:token')
  async validateUserResetPassword(@Param('userid', new ParseUUIDPipe()) userId: string, @Param('token') token: string): Promise<void> {
    return this.authService.validateUserResetPassword(userId, token);
  }

  /**
   * Resets a given user's password.
   * @param changePasswordDto DTO containing the new password to set on the user.
   * @param userId The UUID of the user to reset the password for.
   * @param token The JWT token generated for the reset password link.
   */
  @Patch('/resetpassword/:userid/:token')
  async resetPassword(
    @Param('userid', new ParseUUIDPipe()) userId: string,
    @Param('token') token: string,
    @Body() changePasswordDto: ChangePasswordDto
  ): Promise<boolean> {
    return this.authService.resetPassword(userId, token, changePasswordDto);
  }

  /**
   * Gets the settings associated with a logged-in User profile.
   * @param user The logged-in user.
   * @returns A DTO containing the fields & data for a User profile.
   */
  @Get('/profile/settings')
  @UseGuards(AuthGuard())
  getSettings(@GetUser() user: UserAccount): UserSettingsDto {
    return this.authService.getSettings(user);
  }

  /**
   * Update the settings associated with a logged-in User profile.
   * @param user The logged-in user.
   */
  @Patch('/profile/settings')
  @UseGuards(AuthGuard())
  async updateSettings(@GetUser() userAccount: UserAccount, @Body() userSettings: UserSettingsDto): Promise<void> {
    return this.authService.updateSettings(userAccount, userSettings);
  }

  /**
   * Changes a logged-in a user's password.
   * @param userAccount The logged-in user.
   * @param changePasswordDto DTO containing the new password to set on the user.
   */
  @Patch('/changepassword')
  @UseGuards(AuthGuard())
  async changePassword(
    @GetUser() userAccount: UserAccount,
    @Body() changePasswordDto: ChangePasswordDto
  ): Promise<boolean> {
    return this.authService.changePassword(userAccount, changePasswordDto);
  }
}
