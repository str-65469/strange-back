"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegisterCacheExceptionFilter = void 0;
const dotenv = require("dotenv");
const common_1 = require("@nestjs/common");
const config_1 = require("../../../configs/config");
const url_builder_1 = require("../../utils/url_builder");
const general_exception_1 = require("../exceptions/general.exception");
let RegisterCacheExceptionFilter = class RegisterCacheExceptionFilter {
    catch(exception, host) {
        dotenv.config();
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const exceptionResponse = exception.getResponse();
        const status = exception.getStatus();
        const url = (0, url_builder_1.buildUrl)(config_1.configs.general.routes.MARKUP_URL);
        const { registerTimeout, notFound } = config_1.configs.general.frontMarkupRoutes;
        if (exceptionResponse.statusCode === common_1.HttpStatus.UNAUTHORIZED) {
            return response.status(status).redirect(url.addUrlParams(registerTimeout).getUrl);
        }
        return response.status(status).redirect(url.addUrlParams(notFound).getUrl);
    }
};
RegisterCacheExceptionFilter = __decorate([
    (0, common_1.Catch)(general_exception_1.GenericException)
], RegisterCacheExceptionFilter);
exports.RegisterCacheExceptionFilter = RegisterCacheExceptionFilter;
//# sourceMappingURL=register_cache.excpetion.filter.js.map