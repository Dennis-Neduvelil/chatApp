import { HttpException, HttpStatus } from "@nestjs/common";

export class UserFoundException extends HttpException {
    constructor() {
      super('User Found with this email', HttpStatus.CONFLICT);
    }
  }