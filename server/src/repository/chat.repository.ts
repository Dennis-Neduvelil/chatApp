import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ChatMessageDto, GetMessageDto } from '../dto/chat.dto';

@Injectable()
export class ChatRepositoty {
    constructor(private db: PrismaService) { }
    async saveMessage(dto: ChatMessageDto) {
        await this.db.userChats.create({
            data: {
                message: dto.message,
                senderId: dto.sender,
                receiverId: dto.receiver
            }
        })
    }
    async getMessages(dto: GetMessageDto) {
        return await this.db.userChats.findMany({
            select: {
                senderId: true,
                receiverId: true,
                message: true,
            },
            where: {
                AND: [
                    { OR: [{ senderId: dto.sender }, { receiverId: dto.sender }] },
                    { OR: [{ senderId: dto.receiver }, { receiverId: dto.receiver }] },
                ],
            },
            orderBy:{
                createdAt:'asc'
            }
        });
    }
}
