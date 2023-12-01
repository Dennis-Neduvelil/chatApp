import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RequestDto } from '../dto';

@Injectable()
export class ConnectionRepositoty {
    constructor(private db: PrismaService) { }

    async all(userId: string) {
        return await this.db.user.findMany({
            select: {
                id: true,
                email: true,
                fullName: true
            },
            where: {
                id: { not: userId },
                NOT: [
                    { sentConnectionRequests: { some: { receiverId: userId } } },
                    { receivedConnectionRequests: { some: { senderId: userId } } },
                ],
            },
        });
    }


    async sendRequest(userId: string, dto: RequestDto) {
        return await this.db.connectionRequest.create({
            select: {
                id: true,
                createdAt: true
            },
            data: {
                senderId: userId,
                receiverId: dto.connectionId
            }
        })
    }

    async requestsSended(userId: string) {
        return await this.db.connectionRequest.findMany({
            select: {
                id: true,
                receiver: {
                    select: {
                        id: true,
                        email: true,
                        fullName: true,
                    }
                }
            },
            where: {
                senderId: userId,
                accepted: false
            }
        })
    }

    async requestsReceived(userId: string) {
        return await this.db.connectionRequest.findMany({
            select: {
                id: true,
                sender: {
                    select: {
                        id: true,
                        email: true,
                        fullName: true,
                    }
                }
            },
            where: {
                receiverId: userId,
                accepted: false
            }
        })
    }

    async acceptRequest(dto: RequestDto) {
        return await this.db.connectionRequest.update({
            select: { id: true },
            where: {
                id: dto.connectionId
            }, data: {
                accepted: true
            }
        })
    }

    async getConnections(userId: string) {
        const [sentRequests, receivedRequests] = await Promise.all([
            this.db.user
                .findUnique({
                    where: { id: userId },
                })
                .sentConnectionRequests({
                    where: { accepted: true },
                    include: {
                        receiver: {
                            select: {
                                id: true,
                                email: true,
                                fullName: true,
                            },
                        },
                    },
                }),

            this.db.user
                .findUnique({
                    where: { id: userId },
                })
                .receivedConnectionRequests({
                    where: { accepted: true },
                    include: {
                        sender: {
                            select: {
                                id: true,
                                email: true,
                                fullName: true,
                            },
                        },
                    },
                }),
        ]);

        return [
            ...sentRequests.map((req) => ({ ...req.receiver })),
            ...receivedRequests.map((req) => ({ ...req.sender })),
        ];

    }
}
