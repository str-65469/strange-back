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
exports.SocketService = void 0;
const common_1 = require("@nestjs/common");
const socket_gateway_1 = require("../../socket/socket.gateway");
const config_1 = require("../../../configs/config");
const chat_messages_entity_1 = require("../../../database/entity/chat/chat_messages.entity");
let SocketService = class SocketService {
    constructor(socketGateway) {
        this.socketGateway = socketGateway;
    }
    sendMessageToUser(socketId, chatMessage) {
        this.socketGateway.wss.sockets.to(socketId).emit(config_1.configs.socket.chat, chatMessage);
    }
};
SocketService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [socket_gateway_1.SocketGateway])
], SocketService);
exports.SocketService = SocketService;
//# sourceMappingURL=socket.service.js.map