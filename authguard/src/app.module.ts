import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { WinstonModule } from 'nest-winston';
const {winston,format,transports} = require('winston');
// const {combine,timestamp,printf} = format;
const MESSAGE = Symbol.for('message');
// const myFormat = printf(({timestamp})=>{
//   return `${timestamp} `
// })
const jsonFormatter = (logEntry) => {
  const base = { timestamp: new Date() };
  const json = Object.assign(base, logEntry)
  logEntry[MESSAGE] = JSON.stringify(json);
  return logEntry;
}

@Module({
  imports: [
    MongooseModule.forRoot('mongodb+srv://user:abcd1234@database.yny8c.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'),
    AuthModule,
    WinstonModule.forRoot({
      format:format(jsonFormatter)(),
      transports: [new transports.File({ filename: './logs/authguard.log' })],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
