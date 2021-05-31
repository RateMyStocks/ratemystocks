import { Controller, Post, Body, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthCredentialDto, SignUpDto, SignInResponseDto } from '@ratemystocks/api-interface';
import { UserAccount } from '../../../models/userAccount.entity';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  /**
   *
   * @param signupDto
   * @returns
   */
  @Post('/signup')
  signUp(@Body(ValidationPipe) signupDto: SignUpDto): Promise<void> {
    return this.authService.signUp(signupDto);
  }

  /**
   *
   * @param authCredentialDto
   * @returns
   */
  @Post('/signin')
  async signIn(@Body() authCredentialDto: AuthCredentialDto): Promise<SignInResponseDto> {
    const signInData: { accessToken: string; user: UserAccount } = await this.authService.signIn(authCredentialDto);
    const signInDto: SignInResponseDto = {
      accessToken: signInData.accessToken,
      userId: signInData.user.id,
      // TODO: set expires in as ENV variable or something
      expiresIn: 3600,
    };
    return signInDto;
  }
}
