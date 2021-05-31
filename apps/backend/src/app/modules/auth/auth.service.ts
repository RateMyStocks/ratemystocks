import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt-payload.interface';
import { AuthCredentialDto, SignUpDto } from '@ratemystocks/api-interface';
import { UserAccount } from 'apps/backend/src/models/userAccount.entity';

@Injectable()
export class AuthService {
  constructor(@InjectRepository(UserRepository) private userRepo: UserRepository, private jwtService: JwtService) {}

  /**
   *
   * @param signUpDto
   * @returns
   */
  async signUp(signUpDto: SignUpDto): Promise<void> {
    return this.userRepo.signup(signUpDto);
  }

  /**
   *
   * @param authCredentialsDto
   * @returns
   */
  async signIn(authCredentialsDto: AuthCredentialDto): Promise<{ accessToken: string; user: UserAccount }> {
    const user = await this.userRepo.validateUserPassword(authCredentialsDto);
    const username = user.username;

    if (!user) {
      throw new UnauthorizedException('Invalid Credentials');
    }
    const payload: JwtPayload = { username };
    const accessToken = await this.jwtService.sign(payload);
    return { accessToken, user };
  }
}
