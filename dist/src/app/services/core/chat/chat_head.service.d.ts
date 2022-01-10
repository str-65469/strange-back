import { ChatHeadRepository } from 'src/app/repositories/chat_head.repository';
export declare class ChatHeadService {
    private readonly chatHeadRepository;
    constructor(chatHeadRepository: ChatHeadRepository);
    createTableModel(): import("../../../../database/entity/chat/chat_heads.entity").ChatHeads;
    getChatHeads(chatHeadIds: number[]): Promise<import("../../../../database/entity/chat/chat_heads.entity").ChatHeads[]>;
}
