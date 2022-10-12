import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthController } from './auth.controller';
import {User,UserSchema} from './schemas/user.schema'
import { AuthService } from './services/auth.service';
import { JwtService } from './services/jwt.service';

@Module({
  imports:[
    JwtModule.register({
      secret: 'dev',
      signOptions: { expiresIn: '365d' },
    }),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])
  ],
  controllers: [AuthController],
  providers:[AuthService,JwtService]
})
export class AuthModule {}
