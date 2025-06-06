require('dotenv').config();

import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtPayload } from './jwt-payload.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';
import { UserAccount } from '../../../models/userAccount.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(@InjectRepository(UserRepository) private userRepo: UserRepository) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  // Attaches a validated user to the request, if the end point is guarded
  async validate(payload: JwtPayload): Promise<UserAccount> {
    const { username } = payload;
    const user = await this.userRepo.findOne({ username });

    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
