import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {User, UserDocument} from './../schemas/user.schema'
import {JwtService} from './jwt.service';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class AuthService {
    constructor(@InjectModel(User.name) private userModel: Model<UserDocument>,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    private readonly jwtService: JwtService
    ) {}


    public async register(payload){
        let user = await this.userModel.findOne({'username':payload.username});

        if(user!=null){
            this.logger.error('E-Mail already exists', { "Service": "AuthService", "Method": "Register" })
            throw new RpcException({
                code:6,
                message:'E-Mail already exists'
            })
            // return {status: HttpStatus.CONFLICT, error: ['E-Mail already exists']}
        }

        const newUser = new this.userModel({
            username:payload.username,
            password:this.jwtService.encodePassword(payload.password),
            tenantId:payload.tenantId
        })

        await newUser.save();

        return { status: HttpStatus.CREATED, error: null };

    }

    public async login(payload){
        let user = await this.userModel.findOne({'username':payload.username});

        if (user===null) {
            return { status: HttpStatus.NOT_FOUND, error: ['E-Mail not found'], token: null };
        }

        const isPasswordValid: boolean = this.jwtService.isPasswordValid(payload.password, user.password);

        if (!isPasswordValid) {
            return { status: HttpStatus.NOT_FOUND, error: ['Password wrong'], token: null };
        }
      
        const token: string = this.jwtService.generateToken(user);
      
        return { token, status: HttpStatus.OK, error: null };

    }

    public async validate({token}){
        const decoded = await this.jwtService.verify(token);

        if (!decoded) {
            return { status: HttpStatus.FORBIDDEN, error: ['Token is invalid'], userId: null };
        }

        const auth = await this.jwtService.validateUser(decoded);

        if (!auth) {
            return { status: HttpStatus.CONFLICT, error: ['User not found'], userId: null };
        }
      
        return { status: HttpStatus.OK, error: null, tenantId: decoded.tenantId };

    }

}