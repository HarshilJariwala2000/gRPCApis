import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { PushController } from './push.controller';
import * as path from 'path';

@Module({
  imports:[
    ClientsModule.register([
      {
        name: 'PUSH_PACKAGE',
        transport: Transport.GRPC,
        options: {
          url: '0.0.0.0:50053',
          package: 'pushapi',
          protoPath: path.resolve(__dirname, '../../../proto/push.proto'),
        },
      },
    ]),
  ],
  controllers: [PushController]
})
export class PushModule {}
