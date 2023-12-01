import { Module } from '@nestjs/common';
import { ChatGateway } from '../gateways/chat.gateway';
import { ChatRepositoty } from '../repository';
import { ChatService } from '../services';



@Module({
    providers: [ChatGateway,ChatRepositoty,ChatService]
})
export class ChatGatewayModule { }