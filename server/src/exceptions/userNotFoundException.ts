import { HttpException, HttpStatus } from "@nestjs/common";

export class UserNotFoundException extends HttpException {
    constructor() {
      super('User not found with this email', HttpStatus.NOT_FOUND);
    }
  }