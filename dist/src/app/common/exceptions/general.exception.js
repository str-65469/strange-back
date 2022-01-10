"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GenericException = void 0;
const common_1 = require("@nestjs/common");
class GenericException extends common_1.HttpException {
    constructor(statusCode, messageCode, message) {
        const generalExceptonProps = {
            statusCode,
            messageCode,
            message,
        };
        super(generalExceptonProps, statusCode);
    }
}
exports.GenericException = GenericException;
//# sourceMappingURL=general.exception.js.map