import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserAccount } from '../../../models/userAccount.entity';

// Creating a parameter decorator that just extracts the user out of the request
export const GetUser = createParamDecorator(
  (data, ctx: ExecutionContext): UserAccount => {
    const req = ctx.switchToHttp().getRequest();
    return req.user;
  }
);
