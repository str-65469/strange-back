"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AllExceptionsFilter = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const config_1 = require("../../../configs/config");
const exception_message_code_enum_1 = require("../enum/message_codes/exception_message_code.enum");
const general_exception_1 = require("../exceptions/general.exception");
let AllExceptionsFilter = class AllExceptionsFilter {
    constructor(httpAdapterHost) {
        this.httpAdapterHost = httpAdapterHost;
    }
    catch(exception, host) {
        var _a, _b, _c;
        const httpAdapter = (_a = this.httpAdapterHost) === null || _a === void 0 ? void 0 : _a.httpAdapter;
        const ctx = host.switchToHttp();
        const request = ctx.getRequest();
        let responseBody = null;
        if (exception instanceof general_exception_1.GenericException) {
            const exceptionResponse = exception.getResponse();
            const statusCode = exception.getStatus() || common_1.HttpStatus.INTERNAL_SERVER_ERROR;
            responseBody = {
                message: (_b = exceptionResponse === null || exceptionResponse === void 0 ? void 0 : exceptionResponse.message) !== null && _b !== void 0 ? _b : config_1.configs.messages.exceptions.generalMessage,
                messageCode: (_c = exceptionResponse === null || exceptionResponse === void 0 ? void 0 : exceptionResponse.messageCode) !== null && _c !== void 0 ? _c : exception_message_code_enum_1.ExceptionMessageCode.INTERNAL_SERVER_ERROR,
                statusCode,
                stack: this.getAdditionInfo(request, exception),
            };
            return httpAdapter.reply(ctx.getResponse(), responseBody, statusCode);
        }
        if (exception instanceof common_1.HttpException) {
            const exceptionResponseBody = exception.getResponse();
            const statusCode = exception.getStatus() || common_1.HttpStatus.INTERNAL_SERVER_ERROR;
            const message = Array.isArray(exceptionResponseBody === null || exceptionResponseBody === void 0 ? void 0 : exceptionResponseBody.message) ? exceptionResponseBody === null || exceptionResponseBody === void 0 ? void 0 : exceptionResponseBody.message[0] : null;
            responseBody = {
                message: message !== null && message !== void 0 ? message : exception.message,
                messageCode: exception_message_code_enum_1.ExceptionMessageCode.GENERAL_ERROR,
                statusCode,
                stack: this.getAdditionInfo(request, exception),
            };
            return httpAdapter.reply(ctx.getResponse(), responseBody, statusCode);
        }
        return httpAdapter.reply(ctx.getResponse(), {
            message: 'internal server error',
            messageCode: exception_message_code_enum_1.ExceptionMessageCode.INTERNAL_SERVER_ERROR,
            statusCode: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
            stack: this.getAdditionInfo(request, exception),
        }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
    }
    getAdditionInfo(request, exception) {
        const additionalParams = {
            timestamp: new Date().toISOString(),
            path: request.url,
            method: request.method,
            headers: request.headers,
            extraStack: exception && Object.values(exception).length ? exception : undefined,
        };
        return process.env.NODE_ENV === 'development' ? additionalParams : undefined;
    }
};
AllExceptionsFilter = __decorate([
    (0, common_1.Catch)(),
    __metadata("design:paramtypes", [core_1.HttpAdapterHost])
], AllExceptionsFilter);
exports.AllExceptionsFilter = AllExceptionsFilter;
//# sourceMappingURL=all_exception.filter.js.map