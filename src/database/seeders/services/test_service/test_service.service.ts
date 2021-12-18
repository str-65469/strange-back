import { Injectable } from '@nestjs/common';

@Injectable()
export class TestService {
  log() {
    console.log(321);
  }
}
