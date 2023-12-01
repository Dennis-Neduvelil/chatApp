import { IsString, IsNotEmpty } from 'class-validator';
export class ChatMessageDto {
    @IsNotEmpty()
    @IsString()
    sender: string;

    @IsNotEmpty()
    @IsString()
    receiver:string;

    @IsNotEmpty()
    @IsString()
    message:string;
}

export class GetMessageDto {
    @IsNotEmpty()
    @IsString()
    sender: string;

    @IsNotEmpty()
    @IsString()
    receiver:string;
}

export class GetVideoDto {
    @IsNotEmpty()
    @IsString()
    sender: string;

    @IsNotEmpty()
    @IsString()
    receiver:string;

    data:any
}

