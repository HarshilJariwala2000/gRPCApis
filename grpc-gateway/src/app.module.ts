import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PullController } from './pull/pull.controller';
import { PullModule } from './pull/pull.module';
import { PushModule } from './push/push.module';

@Module({
  imports: [AuthModule, PullModule, PushModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
