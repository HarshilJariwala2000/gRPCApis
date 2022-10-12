import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Master, MasterSchema } from 'src/schema/masterdb.schema';
import { TenantConnection } from './tenant.connection';
import { TenantController } from './tenant.controller';

@Module({
  imports:[
    MongooseModule.forFeature([{ name: Master.name, schema: MasterSchema }])
  ],
  controllers: [TenantController],
  providers:[TenantConnection],
  exports:[TenantConnection]
})
export class TenantModule {}
