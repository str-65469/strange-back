"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.configs = void 0;
const general_1 = require("./addons/general");
const messages_1 = require("./addons/messages");
const socket_1 = require("./addons/socket");
const tokens_1 = require("./addons/tokens");
exports.configs = {
    tokens: tokens_1.default,
    messages: messages_1.default,
    socket: socket_1.default,
    general: general_1.default,
};
//# sourceMappingURL=config.js.map