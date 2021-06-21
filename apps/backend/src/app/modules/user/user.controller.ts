import { Controller, Get, Param } from '@nestjs/common';
import { UserProfileDto } from '@ratemystocks/api-interface';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('/:username')
  getPortfolioById(@Param('username') id: string): Promise<UserProfileDto> {
    return this.userService.getUserByUsername(id);
  }
}
