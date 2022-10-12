import { Body, Catch, Controller, Get, HttpException, Inject, Post, Req, UnauthorizedException, UseInterceptors } from '@nestjs/common';
import { ClientGrpc, RpcException } from '@nestjs/microservices';
import * as GRPC from '@grpc/grpc-js';
import { catchError, Observable } from 'rxjs';

interface PushRequest {
    arr:PushObject[];
}

interface PushObject {
  name:string;
}

interface PushResponse{
    status:string;
    error:string;
}

interface PushServiceClient{
    push(req:PushRequest):Observable<any>
}

@Controller('push')
export class PushController {
    private pushService;
    constructor(@Inject('PUSH_PACKAGE') private client: ClientGrpc) {}

    onModuleInit() {
        this.pushService = this.client.getService<PushServiceClient>(
        'PushService',
    )}

    @Post()
    // @UseInterceptors(NotFoundInterceptor)
    async pull(@Body() body, @Req() req){

        try{
            const token = req.headers['authorization']
            const metadata = new GRPC.Metadata();
            metadata.add('token',token)
            const a =  this.pushService.push(body,metadata)
            return a.pipe(
                catchError((val)=>{
                    console.log('value')
                    console.log(val)
                    throw new HttpException(val,404)
                })
            )
        }catch(err){
            console.log(err)
            throw new UnauthorizedException();
        }
        
        
        }
}
