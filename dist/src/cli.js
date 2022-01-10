"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const nestjs_command_1 = require("nestjs-command");
const commands_module_1 = require("./commands/commands.module");
async function bootstrap() {
    const app = await core_1.NestFactory.createApplicationContext(commands_module_1.CommandsModule);
    try {
        await app.select(nestjs_command_1.CommandModule).get(nestjs_command_1.CommandService).exec();
    }
    catch (error) {
        console.log('error occured');
        console.error(error);
        await app.close();
    }
    await app.close();
}
bootstrap();
//# sourceMappingURL=cli.js.map