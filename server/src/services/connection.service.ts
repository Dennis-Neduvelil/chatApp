import { Injectable } from '@nestjs/common';
import { NothingToReturnException } from '../exceptions';
import { Jwt } from '../utils/jwt/jwt.service';
import { ConnectionRepositoty } from '../repository';
import { RequestDto } from '../dto';




@Injectable({})
export class ConnectionService {
  constructor(private connectionRepositoty: ConnectionRepositoty, private jwt: Jwt) { }
  async all(userId: string) {
    let user = await this.connectionRepositoty.all(userId)
    if (user.length === 0) {
      throw new NothingToReturnException()
    }
    return user;
  }

  async requestSended(userId: string) {
    let requests = await this.connectionRepositoty.requestsSended(userId);
    if (requests.length === 0) {
      throw new NothingToReturnException()
    }
    return requests;
  }

  async requestReceived(userId: string) {
    let requests = await this.connectionRepositoty.requestsReceived(userId);
    if (requests.length === 0) {
      throw new NothingToReturnException()
    }
    return requests;
  }

  async sendRequest(userId: string, dto: RequestDto) {
    return await this.connectionRepositoty.sendRequest(userId, dto);
  }

  async acceptRequest(dto: RequestDto) {
    return await this.connectionRepositoty.acceptRequest(dto);
  }

  async getConnections(userId: string) {
    let requests = await this.connectionRepositoty.getConnections(userId);
    if (requests.length === 0) {
      throw new NothingToReturnException()
    }
    return requests;
  }
}
