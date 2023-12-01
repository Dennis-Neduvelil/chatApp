import { HttpException, HttpStatus } from "@nestjs/common";

export class InvalidCredentiasException extends HttpException {
  constructor() {
    super('Invalid Credentials', HttpStatus.UNAUTHORIZED);
  }
}