import { Controller, Post, Body, ValidationPipe, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthCredentialDto, SignUpDto, SignInResponseDto } from '@ratemystocks/api-interface';
import { UserAccount } from '../../../models/userAccount.entity';
import { GetUser } from './get-user.decorator';

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
}
