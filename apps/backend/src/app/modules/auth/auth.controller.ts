import { Controller, Post, Body, ValidationPipe, Get, UseGuards, Put, Param, Redirect, Response } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthCredentialDto, SignUpDto, SignInResponseDto } from '@ratemystocks/api-interface';
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

  @Get('/settings')
  @UseGuards(AuthGuard())
  getSettings(@GetUser() user: UserAccount) {
    console.log(user);
  }

  /**
   * Sends a verification email to a user. This endpoint will primarily be used for user's who need to have
   * the verification email resent if they haven't received one during signup or they defer verification for a later time.
   * @param userId The UUID of the user verifying their email.
   * @param email The email of the user to verify.
   */
  @Get('/sendemail')
  sendVerificationEmail(@Param('userId') userId: string, @Param('email') email: string): Promise<void> {
    return this.authService.sendVerificationEmail(userId, email);
  }

  /**
   * Endpoint that is called when an unverified user is verifying their email address.
   * @param userId The UUID of the user verifying their email.
   * @param res The response object
   */
  @Get('/verifyuser/:userId')
  @Redirect(process.env.FRONTEND_HOST, 200)
  verifyEmail(@Param('userId') userId: string, @Response() res: ExpressResponse): void {
    this.authService.verifyEmail(userId, res);

    // Redirect to the homepage of the frontend
    res.redirect(process.env.FRONTEND_HOST);
  }
}
