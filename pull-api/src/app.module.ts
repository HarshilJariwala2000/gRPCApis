import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PullController } from './pull/pull.controller';
import { PullModule } from './pull/pull.module';
import { TenantModule } from './tenant/tenant.module';
import { GuardModule } from './guard/guard.module';

@Module({
  imports: [PullModule, TenantModule,
    MongooseModule.forRoot('mongodb+srv://user:abcd1234@database.yny8c.mongodb.net/MasterDB?retryWrites=true&w=majority'),
    GuardModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
