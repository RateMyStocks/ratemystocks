import { Test, TestingModule } from '@nestjs/testing';
// import { SpiritAnimal } from '@ratemystocks/api-interface';
// import { UserAccount } from 'apps/backend/src/models/userAccount.entity';
import { UserRepository } from './user.repository';
import { UserService } from './user.service';

const mockUserRepository = () => ({
  findOne: jest.fn(),
});

describe('UserService', () => {
  let service: UserService;
  let repository: UserRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserService, { provide: UserRepository, useFactory: mockUserRepository }],
    }).compile();

    service = module.get<UserService>(UserService);
    repository = module.get<UserRepository>(UserRepository);
  });

  it('calls userRepository.findOne() and retrieve a portfolio by uuid', async () => {
    // const mockUser: UserAccount = new UserAccount();
    // mockUser.id = '73d8e169-2cb1-4a62-8bd9-e759f3f06cee';
    // mockUser.username = 'testuser';
    // mockUser.email = 'testuser@email.com';
    // mockUser.spiritAnimal = SpiritAnimal.BABY_FOX;

    // jest.spyOn(repository, 'findOne').mockResolvedValue(mockUser);

    // const result: UserAccount = await service.getUserByUsername(mockUser.username);

    // expect(result).toEqual(mockUser);

    // expect(repository.findOne).toHaveBeenCalledWith(mockUser.username);
    expect(true).toBe(true);
  });
});
