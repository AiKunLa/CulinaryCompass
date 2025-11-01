export interface Recipe {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  ingredients: string[];
  instructions: string[];
}

export type ChatRole = 'user' | 'model';

export interface ChatMessage {
  role: ChatRole;
  text: string;
}

export type AppView = 'browse' | 'chat' | 'image';
