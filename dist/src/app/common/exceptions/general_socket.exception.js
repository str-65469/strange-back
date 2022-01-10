"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GenericSocketException = void 0;
const websockets_1 = require("@nestjs/websockets");
class GenericSocketException extends websockets_1.WsException {
    constructor(messageCode, message) {
        const generalExceptonProps = {
            messageCode,
            message,
        };
        super(generalExceptonProps);
    }
}
exports.GenericSocketException = GenericSocketException;
//# sourceMappingURL=general_socket.exception.js.map