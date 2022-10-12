import { CanActivate, ExecutionContext, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { Metadata } from '@grpc/grpc-js';
import { ClientGrpc } from '@nestjs/microservices';
import { Observable } from 'rxjs';

interface RegisterRequest {
    username: string;
    password: string;
}
  
interface RegisterResponse {
    status: number;
    error: string[];
}

export interface ValidateRequest {
    token: string;
}
  
export interface ValidateResponse {
    status: number;
    error: string[];
    userId: number;
}

interface AuthServiceClient{
    register(request: RegisterRequest): Observable<RegisterResponse>;
    validate(request: ValidateRequest): Observable<ValidateResponse>;
}

@Injectable()
export class AuthorizationGuard implements CanActivate {

    public authService;
    public validateResponse;
    constructor(@Inject('AUTH_PACKAGE') private client: ClientGrpc,
    ) {}

    onModuleInit() {
        this.authService = this.client.getService<AuthServiceClient>(
        'AuthService',
    )}

    async canActivate(context: ExecutionContext):Promise<boolean> {

    const token = context.getArgByIndex(1).get('token')[0].split(" ")[1];
    // console.log(token);
    const validate = await this.authService.validate({
        token:`Bearer ${token}`
    })

    function getValidation(v){
        //To Convert Observable to Promise
        return v.toPromise()
    }

    const result = await getValidation(validate);
    // console.log(result);
    
    if(result.status===200){
        return true;
    }else{
        console.log(result.error)
        return false;
    }

      

    

  }
}




