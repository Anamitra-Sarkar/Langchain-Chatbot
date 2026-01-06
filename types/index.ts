export interface User {
  id: string;
  email: string;
  name?: string;
  image?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Conversation {
  id: string;
  userId: string;
  title: string;
  createdAt: Date;
  updatedAt: Date;
  messages: Message[];
}

export interface Message {
  id: string;
  conversationId: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  metadata?: Record<string, unknown>;
}

export interface AIProvider {
  name: 'openai' | 'huggingface' | 'mock';
  enabled: boolean;
}

export interface ChatRequest {
  message: string;
  conversationId?: string;
  provider?: string;
  tools?: string[];
}

export interface ChatResponse {
  message: string;
  conversationId: string;
  messageId: string;
  provider: string;
}

export interface Tool {
  id: string;
  name: string;
  description: string;
  icon: string;
  enabled: boolean;
}

export interface CanvasState {
  id: string;
  conversationId: string;
  data: {
    drawings: Array<{
      type: 'line' | 'rect' | 'circle';
      points: number[];
      color: string;
    }>;
    notes: Array<{
      id: string;
      content: string;
      position: { x: number; y: number };
      color: string;
    }>;
  };
  updatedAt: Date;
}

export interface SearchResult {
  title: string;
  url: string;
  snippet: string;
  source: string;
}
