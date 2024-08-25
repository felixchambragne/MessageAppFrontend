export interface User {
  id: string;
  publicKey: string;
}

export interface Conversation {
  id: string;
  messages: Message[];
  users: User[];
}

export interface Message {
  id: string;
  content?: string;
  cipher: string;
  iv: string;
  salt: string;
  senderId: string;
  createdAt: Date;
  isTemp?: boolean;
}
