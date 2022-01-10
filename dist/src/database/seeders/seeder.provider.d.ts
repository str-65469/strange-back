import { SeederCommand } from './interfaces/seeder.interface';
import { TestService } from './services/test_service/test_service.service';
export declare class SeederProvider implements SeederCommand {
    private readonly testService;
    constructor(testService: TestService);
    run(): void;
}
