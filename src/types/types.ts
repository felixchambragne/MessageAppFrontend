export interface User {
  id: string;
}

export interface Conversation {
  id: string;
  messages: Message[];
}

export interface Message {
  id: string;
  content: string;
  senderId: string;
  isTemp?: boolean;
}
