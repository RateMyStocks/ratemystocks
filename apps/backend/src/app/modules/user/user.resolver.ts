import { Resolver, Mutation, Args, Query, ResolveField, Parent } from '@nestjs/graphql';
import { Inject } from '@nestjs/common';
import { UserService } from './user.service';
import { UserAccount } from 'apps/backend/src/models/userAccount.entity';
import { Portfolio } from 'apps/backend/src/models/portfolio.entity';
import { PortfolioService } from '../portfolio/portfolio.service';
import { UserPortfolioDto } from '@ratemystocks/api-interface';

@Resolver((of) => UserAccount)
export class UserResolver {
  constructor(@Inject(UserService) private userService: UserService, private portfolioService: PortfolioService) {}

  @Query((returns) => UserAccount)
  async user(@Args('username') username: string): Promise<UserAccount> {
    return await this.userService.getUserByUsername(username);
  }
  @ResolveField((returns) => [Portfolio])
  async portfolios(@Parent() user) {
    const { id } = user;
    return this.portfolioService.getPortfoliosByUserId(id);
  }
}
