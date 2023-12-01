import { Injectable } from '@nestjs/common';

@Injectable()
export class ResponseBuilder {
  private _status?: number;
  private _message?: string;
  private _data?: any;

  status(status: number): ResponseBuilder {
    this._status = status;
    return this;
  }

  message(message: string): ResponseBuilder {
    this._message = message;
    return this;
  }

  data(data: any): ResponseBuilder {
    this._data = data;
    return this;
  }

  build(): { statusCode: number; message?: string; data?: any } {
    const response: { statusCode: number; message?: string; data?: any } = {
      statusCode: this._status ?? 200,
    };
    if (this._message) response.message = this._message;
    if (this._data) response.data = this._data;

    return response;
  }
}
