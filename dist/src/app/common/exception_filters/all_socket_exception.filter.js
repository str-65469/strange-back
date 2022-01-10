"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AllSocketExceptionsFilter = void 0;
const common_1 = require("@nestjs/common");
const websockets_1 = require("@nestjs/websockets");
const config_1 = require("../../../configs/config");
const exception_message_code_enum_1 = require("../enum/message_codes/exception_message_code.enum");
const general_socket_exception_1 = require("../exceptions/general_socket.exception");
let AllSocketExceptionsFilter = class AllSocketExceptionsFilter extends websockets_1.BaseWsExceptionFilter {
    catch(exception, host) {
        var _a, _b;
        const props = exception.getError();
        const responseBody = {
            message: (_a = props === null || props === void 0 ? void 0 : props.message) !== null && _a !== void 0 ? _a : config_1.configs.messages.exceptions.generalMessage,
            messageCode: (_b = props === null || props === void 0 ? void 0 : props.messageCode) !== null && _b !== void 0 ? _b : exception_message_code_enum_1.ExceptionMessageCode.INTERNAL_SERVER_ERROR,
            stack: process.env.NODE_ENV === 'development' ? exception.stack : null,
        };
        const genericSocketException = new websockets_1.WsException(responseBody);
        super.catch(genericSocketException, host);
    }
};
AllSocketExceptionsFilter = __decorate([
    (0, common_1.Catch)(general_socket_exception_1.GenericSocketException)
], AllSocketExceptionsFilter);
exports.AllSocketExceptionsFilter = AllSocketExceptionsFilter;
//# sourceMappingURL=all_socket_exception.filter.js.map