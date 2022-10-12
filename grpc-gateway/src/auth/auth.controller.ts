import { Body, Controller, Get, Header, Inject, Post, Req, UseFilters } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import {HttpExceptionFilter} from '../filters/http-exception.filters'

interface RegisterRequest {
    username: string;
    password: string;
}
  
interface RegisterResponse {
    status: number;
    error: string[];
}

interface AuthServiceClient{
    register(request: RegisterRequest): Observable<RegisterResponse>;
}

@Controller('auth')
export class AuthController {

    private authService;
    constructor(@Inject('AUTH_PACKAGE') private client: ClientGrpc) {}

    onModuleInit() {
        this.authService = this.client.getService<AuthServiceClient>(
        'AuthService',
        )}

    @Post('register')
    @UseFilters(HttpExceptionFilter)
    async register(@Body() body){
        const payload = {
            username:body.username,
            password:body.password,
            tenantId:body.tenantId
        }
        console.log(payload);
        return this.authService.register(payload);
    }

    @Get('login')
    async login(@Body() body){
        const payload = {
            username:body.username,
            password:body.password,
        }
        return this.authService.login(payload)
    }


    @Get('validate')
    async validate(@Req() req){
        const token = req.headers['authorization']
        return this.authService.validate({
            token:token
        })
    }

}
