import { Body, Controller, Get, Inject, Post } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { NATS_SERVICE } from 'src/config/services';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { catchError } from 'rxjs';

@Controller('auth')
export class AuthController {
  constructor(@Inject(NATS_SERVICE) private readonly client: ClientProxy) {}

  @Post('register')
  register(@Body() registerUserDto: RegisterUserDto) {
    return this.client.send('auth.register.user', registerUserDto).pipe(
      catchError((error) => {
        if (typeof error === 'object') {
          throw new RpcException(error as object);
        }

        throw new RpcException('Unknown error');
      }),
    );
  }

  @Post('login')
  login(@Body() loginUserDto: LoginUserDto) {
    return this.client.send('auth.login.user', loginUserDto).pipe(
      catchError((error) => {
        if (typeof error === 'object') {
          throw new RpcException(error as object);
        }

        throw new RpcException('Unknown error');
      }),
    );
  }

  @Get('verify')
  verify() {
    return this.client.send('auth.verify.user', {}).pipe(
      catchError((error) => {
        if (typeof error === 'object') {
          throw new RpcException(error as object);
        }

        throw new RpcException('Unknown error');
      }),
    );
  }
}
