import { ArgumentsHost, Catch, ExceptionFilter, HttpException, 
  HttpStatus } from "@nestjs/common";
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
  interface CustomException<T> {
      code: status;
      details: T;
      metadata: Metadata;
  }
  
  @Catch(RpcException)
   export class HttpExceptionFilter implements ExceptionFilter {
      catch(exception: RpcException, host: ArgumentsHost) {

          const err = exception.getError();
          console.log('err');
          console.log(err);
          let _exception: CustomException<string>;
          let details: CustomExceptionDetails;
  
          if (typeof err === 'object') {
              _exception = err as CustomException<string>;
              details = <CustomExceptionDetails>(JSON.parse(_exception.details));
          }
  
          const ctx = host.switchToHttp();
          const response = ctx.getResponse<Response>();
  
          const mapper = new ErrorStatusMapper();
          const status = mapper.grpcToHttpMapper(_exception.code);
          const type = HttpStatus[status];
  
          response
              .status(status)
              .json({
                  statusCode: status,
                  message: details.details,
                  error: type,
              });
      }
  }