import { Repository, EntityRepository } from 'typeorm';
import { ConflictException, InternalServerErrorException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { AuthCredentialDto, SpiritAnimal, UserDto } from '@ratemystocks/api-interface';
import { UserAccount } from '../../../models/userAccount.entity';

@EntityRepository(UserAccount)
export class UserRepository extends Repository<UserAccount> {
  /**
   * Creates a new UserAccount in the database using info from the signup process.
   * @param userDto The DTO object containing the new user's registration information
   */
  async signup(userDto: UserDto): Promise<void> {
    const { username, password, email } = userDto;
    const user = new UserAccount();

    user.username = username;
    user.salt = await bcrypt.genSalt();
    user.password = await this.hashPassword(password, user.salt);
    user.email = email;
    user.spiritAnimal = this.selectRandomSpiritAnimal(SpiritAnimal);

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

  /**
   * Randomly select a spirit animal enum hehe.
   * @returns The randomly selected enum value.
   */
  private selectRandomSpiritAnimal<T>(anEnum: T): T[keyof T] {
    const enumValues = (Object.values(anEnum) as unknown) as T[keyof T][];
    const randomIndex = Math.floor(Math.random() * enumValues.length);
    return enumValues[randomIndex];
  }

  // TODO: Return more than just username (return userId as well)
  async validateUserPassword(authCredentialDto: AuthCredentialDto): Promise<string> {
    const { username, password } = authCredentialDto;
    const user = await this.findOne({ username });
    console.log(user);
    if (user && user.validatePassword(password)) {
      // TODO: return DTO
      return user.username;
    } else {
      return null;
    }
  }

  private async hashPassword(password: string, salt: string): Promise<string> {
    return bcrypt.hash(password, salt);
  }
}
