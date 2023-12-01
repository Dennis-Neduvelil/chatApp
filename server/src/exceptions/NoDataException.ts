import { HttpException, HttpStatus } from "@nestjs/common";

export class NothingToReturnException extends HttpException {
    constructor() {
      super('No Data Found', HttpStatus.NOT_FOUND);
    }
  }