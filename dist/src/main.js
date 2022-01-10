"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cookieParser = require("cookie-parser");
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app/modules/app.module");
const common_1 = require("@nestjs/common");
const path_1 = require("path");
const all_exception_filter_1 = require("./app/common/exception_filters/all_exception.filter");
core_1.NestFactory.create(app_module_1.AppModule).then(async (app) => {
    const port = 4000;
    const httpAdapterHost = app.get(core_1.HttpAdapterHost);
    app.useGlobalPipes(new common_1.ValidationPipe({ transform: true }));
    app.use(cookieParser());
    app.useGlobalFilters(new all_exception_filter_1.AllExceptionsFilter(httpAdapterHost));
    app.enableCors({ origin: true, methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS', credentials: true });
    app.useStaticAssets((0, path_1.join)(__dirname, '../..', 'upload'), { prefix: '/upload' });
    app.useStaticAssets((0, path_1.join)(__dirname, '../..', 'public'), { prefix: '/public' });
    app.setViewEngine('hbs');
    app.set('trust proxy', 1);
    await app.listen(port);
    console.log({ DEBUG_MODE: process.env.NODE_ENV, PORT: port });
});
//# sourceMappingURL=main.js.map