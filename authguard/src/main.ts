import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import * as path from 'path';
import { AppModule } from './app.module';

async function bootstrap() {
  // const app = await NestFactory.create(AppModule);
  // await app.listen(3000);
  const app = await NestFactory.createMicroservice(AppModule, {
    transport: Transport.GRPC,
    options: {
      url: '0.0.0.0:50051',
      package: 'authentication',
      protoPath: path.resolve(__dirname, '../../proto/auth.proto'),
    },
  });

  await app.listen();

}
bootstrap();
