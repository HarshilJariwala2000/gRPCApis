import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type MasterDocument = Master & Document;

@Schema()
export class Master {

  @Prop()
  tenantId: string;

  @Prop()
  databasename:string;

  @Prop()
  username: string;
  
  @Prop()
  password: string;
}

export const MasterSchema = SchemaFactory.createForClass(Master);