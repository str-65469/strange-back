"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const seeder_module_1 = require("./seeder.module");
const seeder_provider_1 = require("./seeder.provider");
async function bootstrap() {
    const app = await core_1.NestFactory.createApplicationContext(seeder_module_1.SeederModule);
    try {
        await app.select(seeder_module_1.SeederModule).get(seeder_provider_1.SeederProvider).run();
    }
    catch (error) {
        await app.close();
    }
    await app.close();
}
bootstrap();
//# sourceMappingURL=seeder.bootstrap.js.map