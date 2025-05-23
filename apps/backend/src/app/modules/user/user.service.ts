import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserAccount } from '../../../models/userAccount.entity';
import { UserRepository } from './user.repository';
import { PortfolioRepository } from '../portfolio/portfolio.repository';
import { Portfolio } from '../../../models/portfolio.entity';
import { getConnection } from 'typeorm';
import { EditUserProfileDto, PortfolioDto } from '@ratemystocks/api-interface';
import { StockFollowerRepository } from '../stock/stock-follower.repository';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    @InjectRepository(PortfolioRepository)
    private portfolioRepository: PortfolioRepository,
    @InjectRepository(StockFollowerRepository)
    private stockFollowerRepository: StockFollowerRepository
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

  /**
   * Saves/bookmarks a portfolio to a user account.
   * @param userAccount The logged-in user saving the portfolio.
   * @param portfolioId The portfolio to save to the user account.
   */
  async savePortfolioToUserAccount(userAccount: UserAccount, portfolioId: string): Promise<void> {
    const portfolioToSave: Portfolio = await this.portfolioRepository.findOne({ where: { id: portfolioId } });

    await getConnection()
      .createQueryBuilder()
      .relation(UserAccount, 'savedPortfolios')
      .of(userAccount)
      .add(portfolioToSave);
  }

  /**
   * "Unsaves" portfolio from a user account.
   * @param userAccount The logged-in user of the saved portfolio about to be unsaved.
   * @param portfolioId The portfolio to save to the user account.
   */
  async unsavePortfolioFromUserAccount(userAccount: UserAccount, portfolioId: string): Promise<void> {
    const savedPortfolioToRemove: Portfolio = await this.portfolioRepository.findOne({ where: { id: portfolioId } });

    await getConnection()
      .createQueryBuilder()
      .relation(UserAccount, 'savedPortfolios')
      .of(userAccount)
      .remove(savedPortfolioToRemove);
  }

  /**
   * Gets a list of portfolios that are saved to the logged-in user's account.
   * @param userAccount The userAccount to get saved portfolios for.
   * @return The array of saved portfolios.
   */
  async getSavedPortfoliosForUser(userAccount: UserAccount): Promise<PortfolioDto[]> {
    const savedPortfolios: Portfolio[] = await getConnection()
      .createQueryBuilder()
      .relation(UserAccount, 'savedPortfolios')
      .of(userAccount)
      .loadMany();

    const savedPortfolioDtos: PortfolioDto[] = savedPortfolios.map((portfolio: Portfolio) => {
      const portfolioDto: PortfolioDto = {
        id: portfolio.id,
        dateCreated: portfolio.dateCreated.toDateString(),
        description: portfolio.description,
        lastUpdated: portfolio.lastUpdated.toDateString(),
        name: portfolio.name,
        user: null, // TODO: Figure out how to load the user as well in one db call
        stocks: null, // not currently needed for this endpoint
      };

      return portfolioDto;
    });

    return savedPortfolioDtos;
  }

  /**
   * Gets the stocks a user is following.
   * @param userAccount The userAccount object of the logged-in user.
   * @returns The list of stocks the logged-in user is following.
   */
  async getSavedStocksForUser(userAccount: UserAccount): Promise<any[]> {
    const followedStocks = await this.stockFollowerRepository.getFollowedStocksByUser(userAccount);
    return followedStocks;
  }

  /**
   * Endpoint for updating the Profile information for the logged-in User.
   * @param userAccount The userAccount object of the logged-in user.
   * @param profileDto The DTO containing the User Profile data to be updated.
   */
  async updateUserProfile(userAccount: UserAccount, profileDto: EditUserProfileDto): Promise<void> {
    const { bio } = profileDto;
    userAccount.bio = bio;

    await userAccount.save();
  }
}
