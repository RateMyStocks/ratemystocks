import { Repository, EntityRepository } from 'typeorm';
import { UserAccount } from '../../../models/userAccount.entity';

@EntityRepository(UserAccount)
export class UserRepository extends Repository<UserAccount> {}
