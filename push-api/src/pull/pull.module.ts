import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { PullController } from './pull.controller';
import * as path from 'path';
import { TenantModule } from 'src/tenant/tenant.module';
import { TenantConnection } from 'src/tenant/tenant.connection';

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
           TenantModule 
    ],
    controllers:[PullController],
    providers:[]
})
export class PullModule {}
