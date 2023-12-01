import { Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken'
import { ConfigService } from '@nestjs/config/dist';

@Injectable()
export class Jwt {
    constructor(private config: ConfigService) { }
    signJwt(paylaod: unknown, expiresIn: string) {
        const token = jwt.sign({
            data: paylaod
        }, this.config.get('JWT_SECRET'), { expiresIn });
        return token;
    }
}