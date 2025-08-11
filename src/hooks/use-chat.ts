'use client'

import { useEffect, useRef, useState } from 'react'
import api from '@/lib/api/axios'
import { Session } from 'next-auth'

export type Message = {
  role: 'user' | 'assistant' | 'system'
  content: string
}

type ChatRow = {
  id: string
  userId: number
  type?: string
  question: string
  answer: string
  created_at: string
  createdAt: Date
}

export const useChat = (session: Session | null) => {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    scrollToBottom()
  }, [messages, loading])

  const loadChats = async () => {
    if (!session?.user?.id) {
      console.warn('No user session found, skipping chat history load.')
      return
    }

    try {
      const response = await api.get(`chatbot/user/${session.user.id}`)
      const data: ChatRow[] = response.data

      const sorted = data.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())

      const formatted: Message[] = sorted.flatMap((chat: ChatRow) => [
        { role: 'user', content: chat.question },
        { role: 'assistant', content: chat.answer }
      ])

      setMessages(formatted)
    } catch (error) {
      console.error('Error loading chats:', error)
    }
  }

  useEffect(() => {
    if (session?.user?.id) {
      loadChats()
    }
  }, [session])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleSend = async () => {
    if (!input.trim()) return;
  
    const userMessage: Message = { role: 'user', content: input };
    const updatedMessages = [...messages, userMessage];
  
    setMessages(updatedMessages);
    setInput('');
    setLoading(true);
  
    try {
      const { data } = await api.post('/chatbot/intelligent-query', {
        query: input
      });
  
      const rawAnswer = data.answer;
  
      const openAiResponse = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [ { role: 'user', content: `rephrase this message, remove AI generated text and return the original rephrased message \n ${rawAnswer}`} ]
        }),
      });
  
      if (openAiResponse.status !== 200) {
        throw new Error(`OpenAI API returned status ${openAiResponse.status}`);
      }
  
      const chatData = await openAiResponse.json();
      const assistantReply: Message = chatData.reply;
  
      setMessages([...updatedMessages, assistantReply]);
  
      if (!session?.user?.id) {
        console.warn('No user session found, skipping chatbot API save.');
        return;
      }
  
      await api.post('/chatbot', {
        userId: Number(session.user.id),
        type: 'ai_general',
        question: userMessage.content, 
        answer: assistantReply.content 
      });
  
    } catch (error) {
      console.error('Error processing message:', error);
      setMessages([...updatedMessages, {
        role: 'assistant',
        content: 'Sorry, something went wrong. Please try again later.'
      }]);
    } finally {
      setLoading(false);
    }
  };  

  return {
    messages,
    input,
    setInput,
    loading,
    handleSend,
    handleKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault()
        handleSend()
      }
    },
    messagesEndRef
  }
}
