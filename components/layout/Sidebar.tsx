'use client';

import { signIn, signOut, useSession } from 'next-auth/react';
import { Conversation } from '@/types';

interface SidebarProps {
  conversations: Conversation[];
  currentConversationId: string | null;
  onSelectConversation: (id: string) => void;
  onNewChat: () => void;
  isOpen: boolean;
  onToggle: () => void;
}

export default function Sidebar({
  conversations,
  currentConversationId,
  onSelectConversation,
  onNewChat,
  isOpen,
  onToggle,
}: SidebarProps) {
  const { data: session } = useSession();

  return (
    <>
      <button
        onClick={onToggle}
        className="fixed top-4 left-4 z-50 p-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-all lg:hidden"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      <aside
        className={`fixed lg:relative inset-y-0 left-0 z-40 w-80 glass-dark border-r border-white/10 transform transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-4 border-b border-white/10">
            <button
              onClick={onNewChat}
              className="w-full px-4 py-3 bg-primary-500 text-white rounded-xl hover:bg-primary-600 transition-all flex items-center justify-center gap-2 font-semibold"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              New Chat
            </button>
          </div>

          {/* Conversations */}
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            <h2 className="text-sm font-semibold text-white/60 mb-2">Recent Chats</h2>
            
            {conversations.length === 0 ? (
              <p className="text-sm text-white/40">No conversations yet</p>
            ) : (
              conversations.map((conv) => (
                <button
                  key={conv.id}
                  onClick={() => onSelectConversation(conv.id)}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-all ${
                    currentConversationId === conv.id
                      ? 'bg-primary-500 text-white'
                      : 'text-white/80 hover:bg-white/10'
                  }`}
                >
                  <p className="font-medium truncate">{conv.title}</p>
                  <p className="text-xs opacity-60 truncate">
                    {new Date(conv.updatedAt).toLocaleDateString()}
                  </p>
                </button>
              ))
            )}
          </div>

          {/* User Section */}
          <div className="p-4 border-t border-white/10">
            {session?.user ? (
              <div className="space-y-2">
                <div className="flex items-center gap-3 px-2">
                  {session.user.image && (
                    <img
                      src={session.user.image}
                      alt={session.user.name || 'User'}
                      className="w-10 h-10 rounded-full"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">
                      {session.user.name || session.user.email}
                    </p>
                    <p className="text-xs text-white/60 truncate">{session.user.email}</p>
                  </div>
                </div>
                <button
                  onClick={() => signOut()}
                  className="w-full px-4 py-2 text-sm text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-all"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <button
                onClick={() => signIn()}
                className="w-full px-4 py-3 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-all"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </aside>

      {/* Overlay */}
      {isOpen && (
        <div
          onClick={onToggle}
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
        />
      )}
    </>
  );
}
