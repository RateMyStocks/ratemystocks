import { Resolver, Mutation, Args, Query, ResolveField, Parent, ObjectType, Field, InputType } from '@nestjs/graphql';
import { PortfolioService } from '../portfolio/portfolio.service';
import { Portfolio } from '../../../models/portfolio.entity';
import { PortfolioStock } from '../../../models/portfolioStock.entity';
import { UserService } from '../user/user.service';
import { UserAccount } from '../../../models/userAccount.entity';
import { UseGuards } from '@nestjs/common';
import { CurrentUser } from '../auth/graphql/user.decorator';
import { GqlAuthGuard } from '../auth/graphql/auth.guard';

// import { Field, InputType } from 'type-graphql'

@InputType()
export class UpdatePortfolioDto {
  // @Field() readonly name: string;
  @Field() description: string;
  // @Field() readonly holdings: { ticker: string; weighting: number };
}

@ObjectType()
class PortfolioRatingCounts {
  @Field()
  likes: number;
  @Field()
  dislikes: number;
}

@Resolver((of) => Portfolio)
export class PortfolioResolver {
  constructor(private portfolioService: PortfolioService, private userService: UserService) {}

  /**
   *
   * @param id
   */
  @Query((returns) => Portfolio)
  async portfolio(@Args('id') id: string): Promise<Portfolio> {
    return await this.portfolioService.getPortfolioById(id);
  }
  @ResolveField((returns) => [PortfolioStock])
  async stocks(@Parent() portfolio) {
    const { id } = portfolio;
    return this.portfolioService.getPortfolioStocks(id);
  }
  @ResolveField((returns) => PortfolioRatingCounts)
  async ratingCounts(@Parent() portfolio) {
    const { id } = portfolio;
    return this.portfolioService.getPortfolioRatingCounts(id);
  }

  /**
   *
   * @param id
   * @param portfolioDto
   * @param user
   */
  @UseGuards(GqlAuthGuard)
  @Mutation((returns) => Portfolio)
  async updatePortfolio(
    @Args('id') id: string,
    @Args('portfolio') portfolioDto: UpdatePortfolioDto,
    @CurrentUser() user: UserAccount
  ) {
    return this.portfolioService.partialUpdatePortfolio(id, user, portfolioDto);
  }
}
