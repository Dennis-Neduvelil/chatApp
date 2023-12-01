import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule, ConnectionModule, ChatGatewayModule } from './modules';
import { ResponseBuilderModule } from './utils/responseBuilder/resposeBuilder.module';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from './utils/jwt/jwt.module';

@Module({
  imports: [JwtModule,
    PrismaModule,
    ChatGatewayModule,
    AuthModule,
    ConnectionModule,
    ResponseBuilderModule,
    ConfigModule.forRoot({
      isGlobal: true
    })],
})
export class AppModule { }
