import { Repository, EntityRepository } from 'typeorm';
import { ConflictException, InternalServerErrorException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { AuthCredentialDto, SpiritAnimal, SignUpDto } from '@ratemystocks/api-interface';
import { UserAccount } from '../../../models/userAccount.entity';

@EntityRepository(UserAccount)
export class UserRepository extends Repository<UserAccount> {
  /**
   * Creates a new UserAccount in the database using info from the signup process.
   * @param signUpDto The DTO object containing the new user's registration information
   */
  async signup(signUpDto: SignUpDto): Promise<void> {
    const { username, password, email } = signUpDto;
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

  /**
   *
   * @param authCredentialDto
   * @returns
   */
  async validateUserPassword(authCredentialDto: AuthCredentialDto): Promise<UserAccount> {
    const { username, password } = authCredentialDto;
    const user = await this.findOne({ username });

    if (user && (await user.validatePassword(password))) {
      return user;
    } else {
      return null;
    }
  }

  private async hashPassword(password: string, salt: string): Promise<string> {
    return bcrypt.hash(password, salt);
  }
}
