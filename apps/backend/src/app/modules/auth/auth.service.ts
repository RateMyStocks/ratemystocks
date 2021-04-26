import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt-payload.interface';
import { AuthCredentialDto, UserDto } from '@ratemystocks/api-interface';

@Injectable()
export class AuthService {
  constructor(@InjectRepository(UserRepository) private userRepo: UserRepository, private jwtService: JwtService) {}

  async signUp(userDto: UserDto): Promise<void> {
    return this.userRepo.signup(userDto);
  }

  async signIn(authCredentialsDto: AuthCredentialDto): Promise<string> {
    const username = await this.userRepo.validateUserPassword(authCredentialsDto);
    if (!username) {
      throw new UnauthorizedException('Invalid Credentials');
    }
    const payload: JwtPayload = { username };
    const accessToken = await this.jwtService.sign(payload);
    return accessToken;
  }
}
