import { Module, Global } from '@nestjs/common';
import { Jwt } from './jwt.service';


@Global()
@Module({
  providers: [Jwt],
  exports: [Jwt],
})
export class JwtModule {}