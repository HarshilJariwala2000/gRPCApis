import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as path from 'path';
import {Transport} from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice(AppModule, {
    transport: Transport.GRPC,
    options: {
      url: '0.0.0.0:50053',
      package: 'pushapi',
      protoPath: path.resolve(__dirname, '../../proto/push.proto'),
    },
  });
  await app.listen();
}
bootstrap();
