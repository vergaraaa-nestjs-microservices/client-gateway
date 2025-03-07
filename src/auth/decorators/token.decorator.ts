import {
  createParamDecorator,
  ExecutionContext,
  InternalServerErrorException,
} from '@nestjs/common';
import { Request } from 'express';

export const Token = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): string => {
    const request: Request = ctx.switchToHttp().getRequest();

    if (!request['token']) {
      throw new InternalServerErrorException(
        'Token not found in request (AuthGuard not called)',
      );
    }

    return request['token'] as string;
  },
);
