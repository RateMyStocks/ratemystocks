import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt-payload.interface';
import { AuthCredentialDto, SignUpDto } from '@ratemystocks/api-interface';
import { UserAccount } from '../../../models/userAccount.entity';

@Injectable()
export class AuthService {
  constructor(@InjectRepository(UserRepository) private userRepo: UserRepository, private jwtService: JwtService) {}

  /**
   * Calls the user repository to create a new user in the database.
   * @param signUpDto DTO containing registration data like username, email, & password.
   */
  async signUp(signUpDto: SignUpDto): Promise<void> {
    return this.userRepo.signup(signUpDto);
  }

  /**
   * Attempts to sign-in a user if their credentials are valid.
   * @param authCredentialsDto DTO containing login information such as username & password.
   * @returns An object containing the signed access token as well as the user retrieved from the database.
   */
  async signIn(authCredentialsDto: AuthCredentialDto): Promise<{ accessToken: string; user: UserAccount }> {
    const user = await this.userRepo.validateUserPassword(authCredentialsDto);

    if (!user) {
      throw new UnauthorizedException('Invalid Credentials');
    }

    const username = user.username;
    const payload: JwtPayload = { username };
    const accessToken = await this.jwtService.sign(payload);
    return { accessToken, user };
  }
}
