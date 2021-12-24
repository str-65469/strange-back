import { Injectable } from '@nestjs/common';

@Injectable()
export class TestService {
  log() {
    return 123;
  }
}
