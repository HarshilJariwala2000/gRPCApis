import { HttpException, HttpStatus, Inject, Injectable, Scope } from "@nestjs/common";
import {Connection,Model} from "mongoose";
import mongoose from "mongoose";
import { InjectConnection, InjectModel } from "@nestjs/mongoose";
import { REQUEST } from "@nestjs/core";
import e, { Request } from 'express';
import { Master, MasterDocument } from "src/schema/masterdb.schema";
import { ClientSchema } from "src/schema/client.schema";

@Injectable({ scope: Scope.REQUEST })
export class TenantConnection {

    constructor(
        @Inject(REQUEST) private request: Request,
        @InjectModel(Master.name) private masterModel: Model<MasterDocument>
    ) {}

    async pull(tenantId){
        const model1 = (await this.modelProvider(tenantId)).database;
        return model1.find({});
    }
    
    async getConnection(tenantId): Promise<Connection> {

        // Get the tenant details from the database
        const tenant = await this.masterModel.findOne({"tenantId":tenantId});

        // Validation check if tenant exist
        if (!tenant) {
            throw new HttpException('Tenant not found', HttpStatus.NOT_FOUND);
        }

        //Get the underlying mongoose connections
        const connections: Connection[] = mongoose.connections;

        // Find existing connection
        const foundConn = connections.find((con: Connection) => {
            return con.name === `${tenant.databasename}`;
        });

        // Check if connection exist and is ready to execute
        if (foundConn && foundConn.readyState === 1) {
            console.log('found connection'); 
            return foundConn;
        }

        // Create a new connection
        console.log('new connection');
        return await this.createConnection(tenant);
    }

    private async createConnection(tenant: MasterDocument): Promise<Connection> {
        // Create or Return a mongo connection
        const uri = `mongodb+srv://${tenant.username}:${tenant.password}@database.yny8c.mongodb.net/${tenant.databasename}?retryWrites=true&w=majority`;
        const db = mongoose.createConnection(uri);
        console.log(uri);
        console.log('created connection');
        return db;

    }

    private async modelProvider(tenantId){
        const db = await this.getConnection(tenantId);
        const session = await db.startSession();

        return {
            "database": db.model('Client', ClientSchema)
        }
        
    }


    

}

//mongodb://localhost:27017/MasterDB/