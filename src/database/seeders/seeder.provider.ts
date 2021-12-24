import { Injectable } from '@nestjs/common';
import { SeederCommand } from './interfaces/seeder.interface';
import { TestService } from './services/test_service/test_service.service';

@Injectable()
export class SeederProvider implements SeederCommand {
  constructor(private readonly testService: TestService) {}

  run(): void {
    this.testService.log();
  }
}
