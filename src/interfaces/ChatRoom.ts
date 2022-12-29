import { Message } from "./Message";

export interface ChatRoom {
    memberIds: string[];
    messages: Message[];
    imageUrl: string;
    name: string;
    uid?: string;
}