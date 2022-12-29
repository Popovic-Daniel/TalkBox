export interface IProfile {
    avatar: string;
    authProvider: string;
    email: string;
    name: string;
    uid: string;
    friendIds: string[];
    chatRoomIds: string[];
}