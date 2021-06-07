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
        case '23505': //duplicate username or email
          throw new ConflictException('Username already exists');
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
   * Validates that a user attempting to login has supplied the correct password.
   * @param authCredentialDto A DTO containing username & password.
   * @returns The UserAccount entity if the login credentials are valid, otherwise return null
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

  /**
   * Hashes a password using the bcrypt hashing function.
   * @param password The plaintext password to hash.
   * @param salt The salt that will be added to the hashing process
   * @returns The hashed password.
   */
  private async hashPassword(password: string, salt: string): Promise<string> {
    return bcrypt.hash(password, salt);
  }
}
