import {
  Controller,
  Post,
  Body,
  ForbiddenException,
  HttpException,
  HttpStatus,
  HttpCode
} from '@nestjs/common';
import { AuthService } from '../services';
import { SignInDto, SignUpDto } from '../dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { ResponseBuilder } from '../utils/responseBuilder/responseBuilder.service';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private response: ResponseBuilder,
  ) { }

  @Post('signin')
  @HttpCode(HttpStatus.OK)
  async signIn(@Body() dto: SignInDto) {
    try {
      const data = await this.authService.signIn(dto);
      return this.response
        .status(HttpStatus.OK)
        .message('Login Sucessfull')
        .data(data)
        .build();
    } catch (error) {
      throw new HttpException(error.response, error.status);
    }
  }

  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  async signUp(@Body() dto: SignUpDto) {
    try {
      const data = await this.authService.signUp(dto);
      return this.response
        .status(HttpStatus.CREATED)
        .message('User Created')
        .data(data)
        .build();
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('User with this email already exists');
        }
      }
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
