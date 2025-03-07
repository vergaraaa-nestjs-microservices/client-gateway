import {
  createParamDecorator,
  ExecutionContext,
  InternalServerErrorException,
} from '@nestjs/common';
import { Request } from 'express';
import { CurrentUser } from '../interfaces/current-user.interface';

export const User = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): CurrentUser => {
    const request: Request = ctx.switchToHttp().getRequest();

    if (!request['user']) {
      throw new InternalServerErrorException(
        'User not found in request (AuthGuard not called)',
      );
    }

    return request['user'] as CurrentUser;
  },
);
