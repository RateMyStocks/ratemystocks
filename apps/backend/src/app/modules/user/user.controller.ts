import { Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { PortfolioDto, UserProfileDto } from '@ratemystocks/api-interface';
import { UserService } from './user.service';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../auth/get-user.decorator';
import { UserAccount } from '../../../models/userAccount.entity';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  /**
   * IMPORTANT: When creating no endpoints, make sure the routes do not accidentally clash with this one.
   *
   * Gets a user from the database by username and returns a stripped-down user DTO.
   * @param username The unique username used to query for a single user in the databse.
   * @returns A DTO containing the minimum necessary user data to populate a user profile
   */
  @Get('/:username')
  async getUserByUsername(@Param('username') username: string): Promise<UserProfileDto> {
    const userEntity: UserAccount = await this.userService.getUserByUsername(username);
    const userDto: UserProfileDto = {
      id: userEntity.id,
      username: userEntity.username,
      email: userEntity.email,
      spiritAnimal: userEntity.spiritAnimal,
      dateJoined: userEntity.dateJoined,
      lastLogin: userEntity.lastLogin,
      bio: userEntity.bio,
    };

    return userDto;
  }

  /**
   * Saves/bookmarks a portfolio to a user account.
   * @param userAccount The logged-in user saving the portfolio.
   * @param portfolioId The unique id of the portfolio to save to the user account.
   */
  @Patch('/save-portfolio/:portfolioId')
  @UseGuards(AuthGuard())
  savePortfolioToUserAccount(
    @GetUser() userAccount: UserAccount,
    @Param('portfolioId') portfolioId: string
  ): Promise<void> {
    return this.userService.savePortfolioToUserAccount(userAccount, portfolioId);
  }

  /**
   * "Unsaves" a portfolio from the logged-in user's account.
   * @param userAccount The logged-in user of the saved portfolio about to be unsaved.
   * @param portfolioId The unique id of the portfolio to unsave from the user account.
   */
  @Patch('/unsave-portfolio/:portfolioId')
  @UseGuards(AuthGuard())
  unsavePortfolioFromUserAccount(
    @GetUser() userAccount: UserAccount,
    @Param('portfolioId') portfolioId: string
  ): Promise<void> {
    return this.userService.unsavePortfolioFromUserAccount(userAccount, portfolioId);
  }

  /**
   * Gets a list of portfolios that are saved to the logged-in user's account.
   * @param userAccount The userAccount to get saved portfolios for.
   * @return The array of saved portfolios.
   */
  @Get('/saved/portfolios')
  @UseGuards(AuthGuard())
  getSavedPortfoliosForUser(@GetUser() userAccount: UserAccount): Promise<PortfolioDto[]> {
    return this.userService.getSavedPortfoliosForUser(userAccount);
  }
}
