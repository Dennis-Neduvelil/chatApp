import {
    Controller,
    Post,
    Body,
    Get,
    HttpException,
    HttpStatus,
    HttpCode,
    UseGuards,
    ForbiddenException,
} from '@nestjs/common';
import { ConnectionService } from '../services';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { ResponseBuilder } from '../utils/responseBuilder/responseBuilder.service';
import { JwtAuthGuard } from '../guards';
import { Userid } from '../decorators';
import { RequestDto } from '../dto';

@UseGuards(JwtAuthGuard)
@Controller('connections')
export class ConnectionController {
    constructor(
        private connectionService: ConnectionService,
        private response: ResponseBuilder,
    ) { }

    @Get('all')
    @HttpCode(HttpStatus.OK)
    async all(@Userid() userId: string) {
        try {
            const data = await this.connectionService.all(userId)
            return this.response
                .status(HttpStatus.OK)
                .message('Data Fetched Successfully')
                .data(data)
                .build();
        } catch (error) {
            throw new HttpException(error.response, error.status);
        }
    }

    @Get('requests-sended')
    @HttpCode(HttpStatus.OK)
    async requestSended(@Userid() userId: string) {
        try {
            const data = await this.connectionService.requestSended(userId)
            return this.response
                .status(HttpStatus.OK)
                .message('Data Fetched Successfully')
                .data(data)
                .build();

        } catch (error) {
            throw new HttpException(error.response, error.status);
        }
    }

    @Get('requests-received')
    @HttpCode(HttpStatus.OK)
    async requestReceived(@Userid() userId: string) {
        try {
            const data = await this.connectionService.requestReceived(userId)
            return this.response
                .status(HttpStatus.OK)
                .message('Data Fetched Successfully')
                .data(data)
                .build();

        } catch (error) {
            throw new HttpException(error.response, error.status);
        }
    }

    @Post('send-request')
    @HttpCode(HttpStatus.OK)
    async sendRequests(@Userid() userId: string, @Body() dto: RequestDto) {
        try {
            const data = await this.connectionService.sendRequest(userId, dto)
            return this.response
                .status(HttpStatus.OK)
                .message('Request Sent Successfully')
                .data(data)
                .build();
        } catch (error) {
            if (error instanceof PrismaClientKnownRequestError) {
                if (error.code === 'P2003') {
                    throw new ForbiddenException('Request Failed, Connection Id is not valid');
                }
                else if (error.code === 'P2002') {
                    throw new ForbiddenException('Request Failed, Alerady send request to this Connection Id');
                } else {
                    throw new HttpException("Unkonwn DB Eroor", HttpStatus.INTERNAL_SERVER_ERROR);
                }
            }
            throw new HttpException(error.response, error.status);
        }
    }

    @Post('accept-request')
    @HttpCode(HttpStatus.OK)
    async acceptRequests(@Body() dto: RequestDto) {
        try {
            const data = await this.connectionService.acceptRequest(dto)
            return this.response
                .status(HttpStatus.OK)
                .message('Request Accepted Successfully')
                .data(data)
                .build();
        } catch (error) {
            if (error instanceof PrismaClientKnownRequestError) {
                if (error.code === 'P2025') {
                    throw new HttpException("Request to update not found", HttpStatus.NOT_FOUND);
                }
            }
            throw new HttpException(error.response, error.status);
        }
    }

    @Get('get-connections')
    @HttpCode(HttpStatus.OK)
    async getConnections(@Userid() userId: string) {
        try {
            const data = await this.connectionService.getConnections(userId)
            return this.response
                .status(HttpStatus.OK)
                .message('Request Accepted Successfully')
                .data(data)
                .build();
        } catch (error) {
            throw new HttpException(error.response, error.status);
        }
    }
}
