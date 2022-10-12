import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from "@nestjs/common";
import { RpcException } from "@nestjs/microservices";
import { Request, Response } from 'express';
import { ErrorStatusMapper } from "../utils/error-status-mapper.util";
import { Metadata, status } from '@grpc/grpc-js';
    
    interface CustomExceptionDetails {
        type: string;
        details: string,
        domain: string,
        metadata: { service: string }
    }
    interface IRpcException {
        code: status;
        details: string;
        metadata: Metadata;
    }
    
    @Catch()
     export class HttpExceptionFilter implements ExceptionFilter {
        //  constructor(private err){}

        catch(exception: IRpcException, host: ArgumentsHost) {
            const ctx = host.switchToHttp();
            const response = ctx.getResponse<Response>();
            const request = ctx.getRequest<Request>();
    
            const mapper = new ErrorStatusMapper();
            const status = mapper.grpcToHttpMapper(exception.code);
            const type = HttpStatus[status];
    
            response
                .status(status)
                .json({
                    statusCode: status,
                    message: exception.details,
                    error: type,
                });
        }
    }