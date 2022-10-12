import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import * as path from 'path';
import { PullController } from './pull.controller';

@Module({
    imports:[
        ClientsModule.register([
            {
              name: 'PULL_PACKAGE',
              transport: Transport.GRPC,
              options: {
                url: '0.0.0.0:50052',
                package: 'pullapi',
                protoPath: path.resolve(__dirname, '../../../proto/pull.proto'),
              },
            },
          ]),
    ],
    controllers:[PullController]
})
export class PullModule {}
