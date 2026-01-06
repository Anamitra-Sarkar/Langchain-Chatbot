'use client';

import { Message } from '@/types';
import MessageBubble from './MessageBubble';

interface MessageListProps {
  messages: Message[];
  streamingMessage: string;
  isStreaming: boolean;
  messagesEndRef: React.RefObject<HTMLDivElement>;
}

export default function MessageList({
  messages,
  streamingMessage,
  isStreaming,
  messagesEndRef,
}: MessageListProps) {
  return (
    <div className="flex-1 overflow-y-auto px-4 py-6">
      <div className="max-w-4xl mx-auto space-y-4">
        {messages.length === 0 && !isStreaming && (
          <div className="text-center text-gray-500 mt-20">
            <h2 className="text-2xl font-bold mb-2">Start a Conversation</h2>
            <p>Send a message to begin chatting with AI</p>
          </div>
        )}
        
        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}
        
        {isStreaming && streamingMessage && (
          <MessageBubble
            message={{
              id: 'streaming',
              conversationId: '',
              role: 'assistant',
              content: streamingMessage,
              timestamp: new Date(),
            }}
            isStreaming
          />
        )}
        
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}
