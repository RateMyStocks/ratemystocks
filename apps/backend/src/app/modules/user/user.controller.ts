import { Controller, Get, Param } from '@nestjs/common';
import { UserProfileDto } from '@ratemystocks/api-interface';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  /**
   * Gets a user from the database by username and returns a stripped-down user DTO.
   * @param username The unique username used to query for a single user in the databse.
   * @returns A DTO containing the minimum necessary user data to populate a user profile
   */
  @Get('/:username')
  async getUserByUsername(@Param('username') username: string): Promise<UserProfileDto> {
    const userEntity = await this.userService.getUserByUsername(username);
    const userDto: UserProfileDto = {
      id: userEntity.id,
      username: userEntity.username,
      email: userEntity.email,
      spiritAnimal: userEntity.spiritAnimal,
    };

    return userDto;
  }
}
