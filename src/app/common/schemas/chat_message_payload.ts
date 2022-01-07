import { MessageType } from '../enum/message_type.enum';

export interface ChatMessagePayload {
  textMessage?: string;
  imgUrl?: string;
  voiceUrl?: string;
  videoUrl?: string;
  gifURl?: string;
  messageType: MessageType;
}
