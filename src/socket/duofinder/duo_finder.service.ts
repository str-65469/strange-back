import { SocketUserService } from './../user/socket_user.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class DuoFinderService {
  constructor(private readonly socketUserService: SocketUserService) {}

  public findDuo() {
    const response = {
      msg: 'testing',
    };

    return response;
  }

  public findMatch() {
    const response = {
      msg: 'testing 2',
    };

    return response;
  }
}
