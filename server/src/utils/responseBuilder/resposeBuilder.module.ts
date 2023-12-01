import { Module, Global } from '@nestjs/common';
import { ResponseBuilder } from './responseBuilder.service';

@Global()
@Module({
  providers: [ResponseBuilder],
  exports: [ResponseBuilder],
})
export class ResponseBuilderModule {}
