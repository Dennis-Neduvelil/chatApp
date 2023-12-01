import { IsString, IsNotEmpty } from 'class-validator';
export class RequestDto {
    @IsNotEmpty()
    @IsString()
    connectionId: string;
}


