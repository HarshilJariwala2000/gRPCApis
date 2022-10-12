import { Metadata } from '@grpc/grpc-js';
import { Body, Controller, Get, UseGuards } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { AuthorizationGuard } from 'src/guard/authorization.guard';
import { TenantConnection } from 'src/tenant/tenant.connection';
import jwt_decode from 'jwt-decode'

interface TenantId{
    id:string;
    username:string;
    tenantId:string;
    iat:number;
    exp:number;
}

@Controller('push')
export class PullController {

    constructor(private tenantConnection:TenantConnection){}

    @GrpcMethod('PushService','Push')
    @UseGuards(AuthorizationGuard)
    private async push(pushObject,metadata:Metadata){
        const token = metadata.get('token')[0].toString().split(" ")[1]
        console.log(token);
        const tenantId:TenantId = jwt_decode(token);
        try{
            return await this.tenantConnection.push(pushObject,tenantId.tenantId)
        }catch(err){
            console.log(err)
        }
    
    }   
        

    }


