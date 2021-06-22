import { InternalServerErrorException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { UserRepository } from './user.repository';
import * as bcrypt from 'bcryptjs';

const mockCredentialsDto = {
  username: 'TestUsername',
  password: 'TestPassword23!',
};

// TODO: Cleanup these tests and get them passing
describe('UserRepository', () => {
  let userRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [UserRepository],
    }).compile();

    userRepository = await module.get<UserRepository>(UserRepository);
  });

  describe('signup', () => {
    let save;

    beforeEach(() => {
      save = jest.fn();
      // userRepository.create = jest.fn().mockReturnValue({ save });
      // userRepository.createQueryBuilder = jest.fn().mockReturnValue({ save })
    });

    it('successfully signs up the user', () => {
      save.mockResolvedValue(undefined);
      expect(userRepository.signup(mockCredentialsDto)).resolves.not.toThrow();
    });

    // it('throws a conflict exception as username already exists', async () => {
    //   save.mockRejectedValue({ code: '23505' });

    //   //   expect(userRepository.signUp(mockCredentialsDto)).rejects.toThrow(
    //   //     InternalServerErrorException,
    //   //   );

    //   try {
    //     await userRepository.signup(mockCredentialsDto);
    //   } catch (err) {
    //     expect(err).toEqual(new ConflictException('Username already exists'));
    //   }
    // });

    // it('throws an Internal Server Error exception as username already exists', async () => {
    //   save.mockRejectedValue({ code: '12345' });

    //   //   expect(userRepository.signUp(mockCredentialsDto)).rejects.toThrow(
    //   //     InternalServerErrorException,
    //   //   );

    //   try {
    //     await userRepository.signup(mockCredentialsDto);
    //   } catch (err) {
    //     expect(err).toEqual(new InternalServerErrorException());
    //   }
    // });
  });

  // describe('validateUserPassword', () => {
  //   let user;

  //   beforeEach(() => {
  //     userRepository.findOne = jest.fn();
  //     user = new UserAccount();
  //     user.username = 'TestUsername';
  //     user.validatePassword = jest.fn();
  //   });

  //   it('returns the username as validation is successful', async () => {
  //     userRepository.findOne.mockResolvedValue(user);
  //     user.validatePassword.mockResolvedValue(true);

  //     const result = await userRepository.validateUserPassword(mockCredentialsDto);
  //     expect(result).toEqual('TestUsername');
  //   });

  //   it('returns null as user cannot be found', async () => {
  //     userRepository.findOne.mockResolvedValue(null);
  //     const result = await userRepository.validateUserPassword(mockCredentialsDto);

  //     expect(user.validatePassword).not.toHaveBeenCalled();
  //     expect(result).toBeNull;
  //   });

  //   it('returns null as password is invalid', async () => {
  //     userRepository.findOne.mockResolvedValue(user);
  //     user.validatePassword.mockResolvedValue(false);

  //     const result = await userRepository.validateUserPassword(mockCredentialsDto);

  //     expect(result).toBeNull();
  //   });
  // });

  describe('hashPassword', () => {
    it('calls bcrypt.hash to generate a hash', async () => {
      bcrypt.hash = jest.fn().mockResolvedValue('testHash');
      expect(bcrypt.hash).not.toHaveBeenCalled();
      const result = await userRepository.hashPassword('testPassword', 'testSalt');
      expect(bcrypt.hash).toHaveBeenCalledWith('testPassword', 'testSalt');
      expect(result).toEqual('testHash');
    });
  });
});
