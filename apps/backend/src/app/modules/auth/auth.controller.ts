import { Controller, Post, Body, ValidationPipe, UseGuards, Res, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from './get-user.decorator';
import { Response } from 'express';
import { AuthCredentialDto, UserDto } from '@ratemystocks/api-interface';
import { UserAccount } from '../../../models/userAccount.entity';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  signUp(@Body(ValidationPipe) userDto: UserDto): Promise<void> {
    return this.authService.signUp(userDto);
  }

  // TODO: Return the logged-in userId as well
  @Post('/signin')
  async signIn(@Body() authCredentialDto: AuthCredentialDto, @Res() response: Response): Promise<Response> {
    const token: string = await this.authService.signIn(authCredentialDto);
    const now: Date = new Date();
    const expirationDate: Date = new Date(now.getTime() + 3600 * 1000);
    response.cookie('accessToken', token, { httpOnly: true, expires: expirationDate });
    response.status(200).json({
      expiresIn: 3600,
    });
    return response.send();
  }

  @Post('/invalidateCookie')
  async invalidateCookie(@Res() response: Response): Promise<Response> {
    response.clearCookie('accessToken');
    response.status(200).json({
      message: 'Sucessfully invalidated token',
    });
    return response.send();
  }

  @Get('/settings')
  @UseGuards(AuthGuard())
  getSettings(@GetUser() user: UserAccount) {
    console.log(user);
  }
}
