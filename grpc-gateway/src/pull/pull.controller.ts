import { Controller, Get, Inject, Req, Post } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import * as GRPC from '@grpc/grpc-js';

interface PullRequest {
  
}

interface PullObject {
    _id:string;
  name:string;
}

interface PullResponse{
    arr:PullObject[]
}

interface PullServiceClient{
    pull(req:PullRequest):Observable<any>
}

@Controller('pull')
export class PullController {
    private pullService;
    constructor(@Inject('PULL_PACKAGE') private client: ClientGrpc) {}

    onModuleInit() {
        this.pullService = this.client.getService<PullServiceClient>(
        'PullService',
    )}

    @Get()
    async pull(@Req() req){
        const token = req.headers['authorization']
        const metadata = new GRPC.Metadata();
        console.log(token);
        metadata.add('token',token)
        return this.pullService.pull({},metadata)
    }

}
