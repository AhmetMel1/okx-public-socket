import { Injectable } from '@nestjs/common';
import { CustomWsResponse } from './abstract';

@Injectable()
export class CustomResponse {
  success = <T>(event: string, data: T): CustomWsResponse<T> => {
    return {
      event: event,
      msg: '',
      code: '0',
      data: data,
    };
  };

  error = (
    event: string,
    msg: string,
    code: string,
  ): CustomWsResponse<null> => {
    return {
      event: event,
      msg: msg,
      code: '400-' + code,
      data: null,
    };
  };
}
