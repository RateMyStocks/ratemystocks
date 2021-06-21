import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserProfileDto } from '@ratemystocks/api-interface';
import { UserAccount } from 'apps/backend/src/models/userAccount.entity';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository
  ) {}

  async getUserByUsername(username: string): Promise<UserProfileDto> {
    // const userEntity: UserAccount = await this.userRepository.findOne({ where: username });
    const userEntity: UserAccount = await this.userRepository
      .createQueryBuilder('user')
      .where('LOWER(user.username) = LOWER(:username)', { username })
      .getOne();

    const userDto: UserProfileDto = {
      id: userEntity.id,
      username: userEntity.username,
      email: userEntity.email,
      spiritAnimal: userEntity.spiritAnimal,
    };

    return userDto;
  }
}
