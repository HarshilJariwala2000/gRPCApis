import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GuardModule } from './guard/guard.module';
import { PullModule } from './pull/pull.module';
import { TenantModule } from './tenant/tenant.module';
import { MongooseModule } from '@nestjs/mongoose';


@Module({
  imports: [PullModule, TenantModule,
    MongooseModule.forRoot('mongodb+srv://user:abcd1234@database.yny8c.mongodb.net/MasterDB?retryWrites=true&w=majority'),
    GuardModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
