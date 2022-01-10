import { SocketGateway } from 'src/app/socket/socket.gateway';
import { ChatMessages } from 'src/database/entity/chat/chat_messages.entity';
export declare class SocketService {
    private readonly socketGateway;
    constructor(socketGateway: SocketGateway);
    sendMessageToUser(socketId: string, chatMessage: ChatMessages): void;
}
