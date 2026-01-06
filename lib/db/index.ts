import { sql } from '@vercel/postgres';
import { config } from '@/lib/config';
import type { User, Conversation, Message } from '@/types';

// In-memory store as fallback
class MemoryStore {
  private users: Map<string, User> = new Map();
  private conversations: Map<string, Conversation> = new Map();
  private messages: Map<string, Message> = new Map();

  async getUser(id: string): Promise<User | null> {
    return this.users.get(id) || null;
  }

  async getUserByEmail(email: string): Promise<User | null> {
    return Array.from(this.users.values()).find(u => u.email === email) || null;
  }

  async createUser(email: string, name?: string, image?: string): Promise<User> {
    const user: User = {
      id: Math.random().toString(36).substring(7),
      email,
      name,
      image,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.users.set(user.id, user);
    return user;
  }

  async getConversations(userId: string): Promise<Conversation[]> {
    return Array.from(this.conversations.values())
      .filter(c => c.userId === userId)
      .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
  }

  async getConversation(id: string): Promise<Conversation | null> {
    const conv = this.conversations.get(id);
    if (!conv) return null;

    const messages = Array.from(this.messages.values())
      .filter(m => m.conversationId === id)
      .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());

    return { ...conv, messages };
  }

  async createConversation(userId: string, title: string): Promise<Conversation> {
    const conversation: Conversation = {
      id: Math.random().toString(36).substring(7),
      userId,
      title,
      createdAt: new Date(),
      updatedAt: new Date(),
      messages: [],
    };
    this.conversations.set(conversation.id, conversation);
    return conversation;
  }

  async updateConversation(id: string, title: string): Promise<Conversation | null> {
    const conv = this.conversations.get(id);
    if (!conv) return null;
    
    conv.title = title;
    conv.updatedAt = new Date();
    return conv;
  }

  async deleteConversation(id: string): Promise<boolean> {
    Array.from(this.messages.values())
      .filter(m => m.conversationId === id)
      .forEach(m => this.messages.delete(m.id));
    
    return this.conversations.delete(id);
  }

  async createMessage(
    conversationId: string,
    role: 'user' | 'assistant' | 'system',
    content: string,
    metadata?: Record<string, unknown>
  ): Promise<Message> {
    const message: Message = {
      id: Math.random().toString(36).substring(7),
      conversationId,
      role,
      content,
      timestamp: new Date(),
      metadata,
    };
    this.messages.set(message.id, message);

    // Update conversation timestamp
    const conv = this.conversations.get(conversationId);
    if (conv) {
      conv.updatedAt = new Date();
    }

    return message;
  }

  async getMessages(conversationId: string): Promise<Message[]> {
    return Array.from(this.messages.values())
      .filter(m => m.conversationId === conversationId)
      .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
  }
}

const memoryStore = new MemoryStore();
let usingMemoryStore = false;

// Check if database is available
async function isDatabaseAvailable(): Promise<boolean> {
  if (!config.databaseUrl) {
    return false;
  }

  try {
    await sql`SELECT 1`;
    return true;
  } catch {
    return false;
  }
}

// Initialize database
let dbAvailable: boolean | null = null;

async function checkDb() {
  if (dbAvailable === null) {
    dbAvailable = await isDatabaseAvailable();
    if (!dbAvailable) {
      console.warn('⚠️  Database not available, using in-memory store');
      usingMemoryStore = true;
    }
  }
  return dbAvailable;
}

// Database operations
export const db = {
  async getUser(id: string): Promise<User | null> {
    if (!(await checkDb())) return memoryStore.getUser(id);

    try {
      const result = await sql`SELECT * FROM users WHERE id = ${id}`;
      return result.rows[0] as User || null;
    } catch (error) {
      console.error('Database error:', error);
      return memoryStore.getUser(id);
    }
  },

  async getUserByEmail(email: string): Promise<User | null> {
    if (!(await checkDb())) return memoryStore.getUserByEmail(email);

    try {
      const result = await sql`SELECT * FROM users WHERE email = ${email}`;
      return result.rows[0] as User || null;
    } catch (error) {
      console.error('Database error:', error);
      return memoryStore.getUserByEmail(email);
    }
  },

  async createUser(email: string, name?: string, image?: string): Promise<User> {
    if (!(await checkDb())) return memoryStore.createUser(email, name, image);

    try {
      const result = await sql`
        INSERT INTO users (email, name, image, created_at, updated_at)
        VALUES (${email}, ${name || null}, ${image || null}, NOW(), NOW())
        RETURNING *
      `;
      return result.rows[0] as User;
    } catch (error) {
      console.error('Database error:', error);
      return memoryStore.createUser(email, name, image);
    }
  },

  async getConversations(userId: string): Promise<Conversation[]> {
    if (!(await checkDb())) return memoryStore.getConversations(userId);

    try {
      const result = await sql`
        SELECT * FROM conversations 
        WHERE user_id = ${userId}
        ORDER BY updated_at DESC
      `;
      return result.rows as Conversation[];
    } catch (error) {
      console.error('Database error:', error);
      return memoryStore.getConversations(userId);
    }
  },

  async getConversation(id: string): Promise<Conversation | null> {
    if (!(await checkDb())) return memoryStore.getConversation(id);

    try {
      const convResult = await sql`SELECT * FROM conversations WHERE id = ${id}`;
      if (convResult.rows.length === 0) return null;

      const messagesResult = await sql`
        SELECT * FROM messages 
        WHERE conversation_id = ${id}
        ORDER BY timestamp ASC
      `;

      return {
        ...(convResult.rows[0] as Conversation),
        messages: messagesResult.rows as Message[],
      };
    } catch (error) {
      console.error('Database error:', error);
      return memoryStore.getConversation(id);
    }
  },

  async createConversation(userId: string, title: string): Promise<Conversation> {
    if (!(await checkDb())) return memoryStore.createConversation(userId, title);

    try {
      const result = await sql`
        INSERT INTO conversations (user_id, title, created_at, updated_at)
        VALUES (${userId}, ${title}, NOW(), NOW())
        RETURNING *
      `;
      return { ...(result.rows[0] as Conversation), messages: [] };
    } catch (error) {
      console.error('Database error:', error);
      return memoryStore.createConversation(userId, title);
    }
  },

  async updateConversation(id: string, title: string): Promise<Conversation | null> {
    if (!(await checkDb())) return memoryStore.updateConversation(id, title);

    try {
      const result = await sql`
        UPDATE conversations 
        SET title = ${title}, updated_at = NOW()
        WHERE id = ${id}
        RETURNING *
      `;
      return result.rows[0] as Conversation || null;
    } catch (error) {
      console.error('Database error:', error);
      return memoryStore.updateConversation(id, title);
    }
  },

  async deleteConversation(id: string): Promise<boolean> {
    if (!(await checkDb())) return memoryStore.deleteConversation(id);

    try {
      await sql`DELETE FROM messages WHERE conversation_id = ${id}`;
      await sql`DELETE FROM conversations WHERE id = ${id}`;
      return true;
    } catch (error) {
      console.error('Database error:', error);
      return memoryStore.deleteConversation(id);
    }
  },

  async createMessage(
    conversationId: string,
    role: 'user' | 'assistant' | 'system',
    content: string,
    metadata?: Record<string, unknown>
  ): Promise<Message> {
    if (!(await checkDb())) return memoryStore.createMessage(conversationId, role, content, metadata);

    try {
      const result = await sql`
        INSERT INTO messages (conversation_id, role, content, timestamp, metadata)
        VALUES (${conversationId}, ${role}, ${content}, NOW(), ${JSON.stringify(metadata || {})})
        RETURNING *
      `;

      await sql`UPDATE conversations SET updated_at = NOW() WHERE id = ${conversationId}`;

      return result.rows[0] as Message;
    } catch (error) {
      console.error('Database error:', error);
      return memoryStore.createMessage(conversationId, role, content, metadata);
    }
  },

  async getMessages(conversationId: string): Promise<Message[]> {
    if (!(await checkDb())) return memoryStore.getMessages(conversationId);

    try {
      const result = await sql`
        SELECT * FROM messages 
        WHERE conversation_id = ${conversationId}
        ORDER BY timestamp ASC
      `;
      return result.rows as Message[];
    } catch (error) {
      console.error('Database error:', error);
      return memoryStore.getMessages(conversationId);
    }
  },

  isUsingMemoryStore(): boolean {
    return usingMemoryStore;
  },
};
