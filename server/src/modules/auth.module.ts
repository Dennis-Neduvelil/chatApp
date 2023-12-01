import { Module } from '@nestjs/common';
import { AuthController } from '../controllers';
import { AuthService } from '../services';
import { AuthRepositoty } from '../repository';

@Module({
  controllers: [AuthController],
  providers: [AuthService, AuthRepositoty],
})
export class AuthModule {}
