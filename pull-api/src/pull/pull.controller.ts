import { Metadata } from '@grpc/grpc-js';
import { Controller, Get, UseGuards } from '@nestjs/common';
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

@Controller('pull')
export class PullController {

    constructor(private tenantConnection:TenantConnection){}

    @GrpcMethod('PullService','Pull')
    @UseGuards(AuthorizationGuard)
    private async pull({},metadata:Metadata){

        const token = metadata.get('token')[0].toString().split(" ")[1]

        const tenantId:TenantId = jwt_decode(token);
        console.log(tenantId);
        const arr = await this.tenantConnection.pull(tenantId.tenantId)       
        
        return {arr};

    }

}
