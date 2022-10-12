import { Injectable } from '@nestjs/common';
import { JwtService as Jwt } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcryptjs';
import { Model } from 'mongoose';
import { UserDocument, User } from '../schemas/user.schema';

@Injectable()
export class JwtService {
    constructor(
        @InjectModel(User.name) private userModel: Model<UserDocument>,
        private readonly jwt: Jwt
        ){};

    public encodePassword(password: string): string {
        const salt: string = bcrypt.genSaltSync(10);
        return bcrypt.hashSync(password, salt);
    }

    public isPasswordValid(password: string, userPassword: string): boolean {
        const result = bcrypt.compareSync(password, userPassword);
        return result;
    }
    
    public generateToken(user) {
        return this.jwt.sign({ id: user._id, username: user.username,tenantId:user.tenantId });
    }

    public async verify(token: string): Promise<any> {
        console.log(token.split(" ")[1]);
        try {
          return await this.jwt.verify(token.split(" ")[1]);
        } catch (err) {}
    }

    public async validateUser(decoded: any) {
        return this.userModel.findOne({"_id":decoded.id});
      }
}