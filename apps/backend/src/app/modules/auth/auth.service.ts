import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt-payload.interface';
import { AuthCredentialDto, SignUpDto } from '@ratemystocks/api-interface';
import { UserAccount } from '../../../models/userAccount.entity';
import { redis } from 'apps/backend/src/redis';
import { Response } from 'express';
import { confirmEmailLink } from 'apps/backend/src/utils/confirmEmailLink';
import { sendEmail } from 'apps/backend/src/utils/sendEmail';

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

  async sendVerificationEmail(userId: string, email: string): Promise<void> {
    const link = await confirmEmailLink(userId);
    await sendEmail(email, link).catch(console.error);
  }

  /**
   * Endpoint that is called when an unverified user is verifying their email address.
   * @param userId The UUID of the user verifying their email.
   * @param res The response object
   */
  async verifyEmail(redisKey: string, res: Response): Promise<void> {
    const userIdFromCache = await redis.get(redisKey);

    // Either the id in redis has expired and been removed or the given id is invalid
    if (!userIdFromCache) {
      throw new NotFoundException();
    }

    this.userRepo.update({ id: userIdFromCache }, { emailVerified: true });

    // res.send('ok');
  }
}
