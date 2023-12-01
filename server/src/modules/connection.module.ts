import { Module } from '@nestjs/common';
import { ConnectionController } from '../controllers';
import { ConnectionService } from '../services';
import { ConnectionRepositoty } from '../repository';


@Module({
  controllers: [ConnectionController],
  providers: [ConnectionService,ConnectionRepositoty],
})
export class ConnectionModule {}