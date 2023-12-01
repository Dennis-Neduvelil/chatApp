import { Injectable } from '@nestjs/common';
import { ChatMessageDto, GetMessageDto } from '../dto/chat.dto';
import { ChatRepositoty } from '../repository';

interface IChatService {
    saveMessage(dto: ChatMessageDto): Promise<void>
    getMessages(dto: ChatMessageDto): Promise<any>
}

@Injectable({})
export class ChatService implements IChatService {
    constructor(private chatRepository: ChatRepositoty) { }

    async saveMessage(dto: ChatMessageDto): Promise<void> {
        try {
            await this.chatRepository.saveMessage(dto);
            console.log("Message saved in the DB 💾")
        } catch (error) {
            console.log(error)
        }
    }

    async getMessages (dto: GetMessageDto){
        try{
            return await this.chatRepository.getMessages(dto);
        }catch (error) {
            console.log(error)
        }
    }
}
