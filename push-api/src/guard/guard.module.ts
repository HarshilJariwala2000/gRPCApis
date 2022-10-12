import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import * as path from 'path';
import { AuthorizationGuard } from './authorization.guard';

@Module({
  imports:[
    ClientsModule.register([
        {
            name: 'AUTH_PACKAGE',
            transport: Transport.GRPC,
            options: {
            url: '0.0.0.0:50051',
            package: 'authentication',
            protoPath: path.resolve(__dirname, '../../../proto/auth.proto'),
            },
        },
        ]),
    ],
  controllers: [],
  providers:[]
})
export class GuardModule {}
