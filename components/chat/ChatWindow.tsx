'use client';

import { useState, useRef, useEffect } from 'react';
import MessageList from './MessageList';
import ChatInput from './ChatInput';
import { Message } from '@/types';

interface ChatWindowProps {
  conversationId: string | null;
  onConversationCreated: (id: string) => void;
}

export default function ChatWindow({ conversationId, onConversationCreated }: ChatWindowProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [currentStreamingMessage, setCurrentStreamingMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (conversationId) {
      fetchMessages();
    } else {
      setMessages([]);
    }
  }, [conversationId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, currentStreamingMessage]);

  const fetchMessages = async () => {
    try {
      const response = await fetch(`/api/conversations/${conversationId}`);
      if (response.ok) {
        const data = await response.json();
        setMessages(data.conversation?.messages || []);
      }
    } catch (error) {
      console.error('Failed to fetch messages:', error);
    }
  };

  const handleSendMessage = async (message: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      conversationId: conversationId || 'temp',
      role: 'user',
      content: message,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsStreaming(true);
    setCurrentStreamingMessage('');

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message,
          conversationId,
        }),
      });

      if (!response.ok) throw new Error('Failed to send message');

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let streamedContent = '';

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          const lines = chunk.split('\n');

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              try {
                const data = JSON.parse(line.slice(6));
                
                if (data.done) {
                  if (data.conversationId && !conversationId) {
                    onConversationCreated(data.conversationId);
                  }
                  
                  const assistantMessage: Message = {
                    id: data.messageId || Date.now().toString(),
                    conversationId: data.conversationId || conversationId || 'temp',
                    role: 'assistant',
                    content: streamedContent,
                    timestamp: new Date(),
                  };
                  
                  setMessages(prev => [...prev, assistantMessage]);
                  setCurrentStreamingMessage('');
                } else if (data.content) {
                  streamedContent += data.content;
                  setCurrentStreamingMessage(streamedContent);
                }
              } catch (e) {
                // Ignore parsing errors
              }
            }
          }
        }
      }
    } catch (error) {
      console.error('Failed to send message:', error);
      alert('Failed to send message. Please try again.');
    } finally {
      setIsStreaming(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <header className="glass-dark px-6 py-4 border-b border-white/10">
        <h1 className="text-xl font-semibold text-white">AI Chat</h1>
      </header>
      
      <MessageList
        messages={messages}
        streamingMessage={currentStreamingMessage}
        isStreaming={isStreaming}
        messagesEndRef={messagesEndRef}
      />
      
      <ChatInput
        onSendMessage={handleSendMessage}
        disabled={isStreaming}
      />
    </div>
  );
}
