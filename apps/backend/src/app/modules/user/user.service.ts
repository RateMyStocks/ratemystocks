import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserAccount } from 'apps/backend/src/models/userAccount.entity';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository
  ) {}

  /**
   * Gets user by username from the database.
   * @param username The username used to query for a single user in the database.
   * @returns The user entity from the database with the given username.
   */
  async getUserByUsername(username: string): Promise<UserAccount> {
    // const userEntity: UserAccount = await this.userRepository.findOne({ where: username });
    const userEntity: UserAccount = await this.userRepository
      .createQueryBuilder('user')
      .where('LOWER(user.username) = LOWER(:username)', { username })
      .getOne();

    return userEntity;
  }
}
