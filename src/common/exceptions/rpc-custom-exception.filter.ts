import { Catch, ArgumentsHost, ExceptionFilter } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { Response } from 'express';

@Catch(RpcException)
export class RpcCustomExceptionFilter implements ExceptionFilter<RpcException> {
  catch(exception: RpcException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const rpcError = exception.getError();

    if (
      typeof rpcError === 'object' &&
      'status' in rpcError &&
      typeof rpcError.status === 'number' &&
      'message' in rpcError
    ) {
      return response.status(rpcError.status).json(rpcError);
    }

    const message =
      typeof rpcError === 'object' && 'message' in rpcError
        ? rpcError.message
        : rpcError;

    return response.status(500).json({
      statusCode: 500,
      message: message,
    });
  }
}
