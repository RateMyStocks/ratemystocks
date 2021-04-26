import { Repository, EntityRepository } from 'typeorm';
import { ConflictException, InternalServerErrorException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { AuthCredentialDto, UserDto } from '@ratemystocks/api-interface';
import { UserAccount } from '../../../models/userAccount.entity';

@EntityRepository(UserAccount)
export class UserRepository extends Repository<UserAccount> {
  async signup(userDto: UserDto): Promise<void> {
    const { username, password, email } = userDto;
    const user = new UserAccount();

    user.username = username;
    user.salt = await bcrypt.genSalt();
    user.password = await this.hashPassword(password, user.salt);
    user.email = email;

    try {
      await user.save();
    } catch (error) {
      switch (error.code) {
        case '23505': //duplicate username
          throw new ConflictException('Username already exists');
          break;
        default:
          throw new InternalServerErrorException();
      }
    }
  }

  async validateUserPassword(authCredentialDto: AuthCredentialDto): Promise<string> {
    const { username, password } = authCredentialDto;
    const user = await this.findOne({ username });
    if (user && user.validatePassword(password)) {
      return user.username;
    } else {
      return null;
    }
  }

  private async hashPassword(password: string, salt: string): Promise<string> {
    return bcrypt.hash(password, salt);
  }
}
