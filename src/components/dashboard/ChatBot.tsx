'use client'

import { useChat } from '@/hooks/use-chat'
import { useSession } from 'next-auth/react'
import { useState } from 'react'
import { Send, User, Bot } from 'lucide-react'
import AdminLayout from '@/layouts/AdminLayout'

export default function ChatPage() {
  const { data: session, status } = useSession();
  const { messages, input, setInput, loading, handleSend, handleKeyDown, messagesEndRef } = useChat(session)
  const [isFocused, setIsFocused] = useState(false)

  return (
    <AdminLayout>
      <div
        className="h-175 flex flex-col max-w-5xl mx-auto bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 text-gray-800 dark:text-gray-100 transition-colors duration-300"
      >
        <header className="bg-gradient-to-r from-orange-600 to-orange-500 text-white px-6 py-4 shadow-lg rounded-b-2xl">
          <h1 className="text-2xl font-semibold tracking-tight">
            {/* {type.charAt(0).toUpperCase() + type.slice(1)} Assistant */}
          </h1>
          <p className="text-sm opacity-80">Ask about anything from AI agent.</p>
        </header>

        <div className="flex-1 overflow-y-auto px-6 py-8 space-y-6">
          {messages.length === 0 && !loading ? (
            <div className="text-center text-gray-500 dark:text-gray-400 mt-16 animate-fade-in">
              <Bot size={32} className="mx-auto mb-2 opacity-50" />
              <p className="text-lg font-medium">No messages yet. Start the conversation!</p>
            </div>
          ) : (
            messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} animate-slide-in`}
              >
                <div
                  className={`flex items-start gap-3 max-w-[70%] p-4 rounded-2xl shadow-md transition-all duration-200
                    ${
                      message.role === 'user'
                        ? 'bg-orange-500 text-white rounded-br-none'
                        : 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-bl-none'
                    } hover:shadow-lg`}
                >
                  {message.role === 'assistant' && (
                    <Bot size={20} className="text-orange-500 dark:text-orange-400 flex-shrink-0" />
                  )}
                  <span>{message.content}</span>
                  {message.role === 'user' && (
                    <User size={20} className="text-white flex-shrink-0" />
                  )}
                </div>
              </div>
            ))
          )}
          {loading && (
            <div className="flex justify-start animate-fade-in">
              <div className="bg-white dark:bg-gray-700 p-4 rounded-2xl shadow-md">
                <div className="animate-pulse flex space-x-2">
                  <div className="w-2 h-2 bg-orange-400 dark:bg-orange-500 rounded-full"></div>
                  <div className="w-2 h-2 bg-orange-400 dark:bg-orange-500 rounded-full"></div>
                  <div className="w-2 h-2 bg-orange-400 dark:bg-orange-500 rounded-full"></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="px-6 py-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 shadow-inner">
          <div className="flex items-center gap-3 max-w-4xl mx-auto">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder="Type your message..."
              className={`
                flex-1 p-4 rounded-xl border-2 transition-all duration-300
                ${
                  isFocused
                    ? 'border-orange-500 ring-2 ring-orange-200 dark:ring-orange-600'
                    : 'border-gray-200 dark:border-gray-600'
                }
                bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500
                focus:outline-none focus:ring-2 focus:ring-orange-300 dark:focus:ring-orange-500
                text-base font-medium
              `}
              disabled={loading}
            />
            <button
              onClick={handleSend}
              disabled={loading || !input.trim()}
              className="p-4 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-xl transition-all duration-300 shadow-md hover:shadow-lg"
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
