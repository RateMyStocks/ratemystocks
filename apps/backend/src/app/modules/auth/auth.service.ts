import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserRepository } from './user.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt-payload.interface';
import {
  AuthCredentialDto,
  ChangePasswordDto,
  ForgotPasswordDto,
  SignUpDto,
  UserSettingsDto,
} from '@ratemystocks/api-interface';
import { UserAccount } from '../../../models/userAccount.entity';
import { redis } from '../../../redis';
import { Response } from 'express';
import { confirmEmailLink } from '../../../utils/confirmEmailLink';
import { sendConfirmationEmail } from '../../../utils/sendConfirmationEmail';
import { CONFIRM_EMAIL_REDIS_KEY_PREFIX } from '../../../constants';
import { sendForgotPasswordEmail } from '../../../utils/sendForgotPasswordEmail';

const jwt = require('jsonwebtoken');

require('dotenv').config();

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

  async sendVerificationEmail(userId: string, username: string, email: string): Promise<void> {
    const link = await confirmEmailLink(userId);
    await sendConfirmationEmail(email, username, link).catch(console.error);
  }

  /**
   * Endpoint that is called when an unverified user is verifying their email address.
   * @param userId The UUID of the user verifying their email.
   * @param res The response object
   */
  async verifyEmail(redisKey: string, res: Response): Promise<void> {
    const userIdFromCache = await redis.get(CONFIRM_EMAIL_REDIS_KEY_PREFIX + redisKey);

    // Either the id in redis has expired and been removed or the given id is invalid
    if (!userIdFromCache) {
      throw new NotFoundException();
    }

    this.userRepo.update({ id: userIdFromCache }, { emailVerified: true });

    // res.send('ok');
  }

  /**
   * Sends an email to a user who has forgotten their password.
   * @param forgotPasswordDto DTO containing the email address.
   */
  async forgotPassword(forgotPasswordDto: ForgotPasswordDto): Promise<void> {
    const user = await this.userRepo.findOne({ where: { email: forgotPasswordDto.email } });

    if (!user) {
      throw new NotFoundException();
    }

    // Create JWT. The secret is the common JWT Secet + the user's password, so that the link we send (that includes the token in the URL) is only valid once
    // So when the user'as password is changed to something new, the old links will not work
    const secret = process.env.JWT_SECRET + user.password;
    const payload = {
      email: user.email,
      id: user.id,
    };
    const token = jwt.sign(payload, secret, { expiresIn: '15m' });

    // Create one-time link that is valid for 15 minutes
    const oneTimeLink = `${process.env.FRONTEND_HOST}/resetpassword/${user.id}/${token}`;
    await sendForgotPasswordEmail(user.email, user.username, oneTimeLink);
  }

  /**
   * Validates the userId and JWT from a reset password one-time link.
   * @param userId The UUID of the user who was sent the one-time link to reset their password.
   * @param token The JWT generated for the one-time link.
   */
  async validateUserResetPassword(userId: string, token: string): Promise<void> {
    const user = await this.userRepo.findOne({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException();
    }

    const secret = process.env.JWT_SECRET + user.password;
    try {
      const payload = jwt.verify(token, secret);
    } catch (error) {
      throw new ForbiddenException();
    }
  }

  /**
   * Changes a user's password.
   * @param userId The UUID of the user to update the password for.
   * @param token The JWT token generated for the reset password link.
   * @param changePasswordDto DTO containing the new password.
   * @return true if the password was updated.
   */
  async resetPassword(userId: string, token: string, changePasswordDto: ChangePasswordDto): Promise<boolean> {
    const user = await this.userRepo.findOne({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException();
    }

    if (changePasswordDto.password !== changePasswordDto.password2) {
      throw new BadRequestException();
    }

    const secret = process.env.JWT_SECRET + user.password;
    try {
      const payload = jwt.verify(token, secret);
    } catch (error) {
      throw new ForbiddenException();
    }

    const password = await this.userRepo.hashPassword(changePasswordDto.password, user.salt);
    user.password = password;
    await user.save();

    return true;
  }

  /**
   * Gets the settings associated with a logged-in User profile.
   * @param user The logged-in user.
   * @returns A DTO containing the fields & data for a User profile.
   */
  getSettings(userAccount: UserAccount): UserSettingsDto {
    const userSettings: UserSettingsDto = {
      email: userAccount.email,
      emailVerified: userAccount.emailVerified,
    };

    return userSettings;
  }

  /**
   * Update the settings associated with a logged-in User profile.
   * @param user The logged-in user.
   */
  async updateSettings(userAccount: UserAccount, userSettings: UserSettingsDto): Promise<void> {
    const { email } = userSettings;
    userAccount.email = email;
    userAccount.emailVerified = false;

    await userAccount.save();
    await this.sendVerificationEmail(userAccount.id, userAccount.username, email);
  }

  /**
   * Changes a logged-in a user's password.
   * @param userAccount The logged-in user.
   * @param changePasswordDto DTO containing the new password to set on the user.
   */
  async changePassword(user: UserAccount, changePasswordDto: ChangePasswordDto): Promise<boolean> {
    const password = await this.userRepo.hashPassword(changePasswordDto.password, user.salt);
    user.password = password;
    await user.save();

    return true;
  }
}
