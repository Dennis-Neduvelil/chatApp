import { OnModuleInit } from "@nestjs/common";
import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server } from 'socket.io'
import { ChatService } from "../services";
import { ChatMessageDto, GetMessageDto, GetVideoDto } from "../dto/chat.dto";

@WebSocketGateway({
    cors: {
        origin: ['http://localhost:3000']
    }
})
export class ChatGateway implements OnModuleInit {
    constructor(
        private chatService: ChatService,
    ) { }

    @WebSocketServer()
    server: Server;
    onModuleInit() {
        this.server.on('connection', (socket) => {
            console.log(`${socket.id} - Connected 🍾🎉`)
        })
    }
    @SubscribeMessage('fetchMessage')
    async onFetchMessage(@MessageBody() body: GetMessageDto) {
        let result = await this.chatService.getMessages(body);
        this.server.emit(`message-history-from-${body.sender}-to-${body.receiver}`, result)
    }
    @SubscribeMessage('newMessage')
    async onNewMessage(@MessageBody() body: ChatMessageDto) {
        await this.chatService.saveMessage(body)
        this.server.emit(`message-from-${body.sender}-to-${body.receiver}`, body.message)
    }

    @SubscribeMessage('newVideoCall')
    async onNewVideoCall(@MessageBody() body: GetMessageDto) {
        this.server.emit(`video-call-from-${body.sender}-to-${body.receiver}`)
    }

    @SubscribeMessage('videoCallAccepted')
    async onVideoCallAccept(@MessageBody() body: GetMessageDto) {
        this.server.emit(`video-call-accepted-by-${body.sender}-to-${body.receiver}`)
    }

    @SubscribeMessage('videoCallRejected')
    async onVideoCallReject(@MessageBody() body: GetMessageDto) {
        this.server.emit(`video-call-rejected-by-${body.sender}-to-${body.receiver}`)
    }

    @SubscribeMessage('ice-candidate-webRtc')
    async onReceiveIceCandidateWebRTC(@MessageBody() body: GetVideoDto) {
        console.log("ice-candidate-webRtc : triggerd")
        this.server.emit(`ice-candidate-received-from-${body.sender}-to-${body.receiver}`, body.data)
    }

    @SubscribeMessage('offer-created')
    async onOfferReceiveWebRTC(@MessageBody() body: GetVideoDto) {
        console.log("offer-created : triggerd", body)
        this.server.emit(`offer-received-from-${body.sender}-to-${body.receiver}`, body.data)
    }

    @SubscribeMessage('answer-created')
    async onAnswerReceiveWebRTC(@MessageBody() body: GetVideoDto) {
        console.log("answer-created : triggerd")
        this.server.emit(`answer-received-from-${body.sender}-to-${body.receiver}`, body.data)
    }

    @SubscribeMessage('call-ended')
    async onCallEndWebRTC(@MessageBody() body: GetMessageDto) {
        console.log("call end : triggerd")
        this.server.emit(`call-end-by-${body.sender}-to-${body.receiver}`);
        this.server.emit(`call-end-by-${body.receiver}-to-${body.sender}`)
    }

}
