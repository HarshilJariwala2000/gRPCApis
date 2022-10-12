import { Controller, Inject } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { AuthService } from './services/auth.service';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

@Controller('auth')
export class AuthController {

    constructor(private readonly authService:AuthService,
        ){}

    @GrpcMethod('AuthService','Register')
    private register(payload){
        return this.authService.register(payload);
    }

    @GrpcMethod('AuthService','Login')
    private login(payload){
        return this.authService.login(payload);
    }

    @GrpcMethod('AuthService','Validate')
    private validate(token){
        return this.authService.validate(token)
    }
}
