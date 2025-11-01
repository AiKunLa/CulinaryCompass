import React, { useState, useRef, useEffect } from 'react';
import { createChat } from '../services/geminiService';
import type { ChatMessage } from '../types';
import type { Chat } from '@google/genai';

// Simple markdown-to-HTML parser for recipe formatting
const SimpleMarkdown: React.FC<{ text: string }> = ({ text }) => {
    const formatText = (inputText: string) => {
        return inputText
            .split('\n')
            .map(line => {
                if (line.startsWith('### ')) return `<h3 class="text-xl font-bold mt-4 mb-2">${line.substring(4)}</h3>`;
                if (line.startsWith('**')) return `<p class="font-bold my-1">${line.replace(/\*\*/g, '')}</p>`;
                if (line.startsWith('* ')) return `<li class="ml-4 list-disc">${line.substring(2)}</li>`;
                if (line.startsWith('1. ')) return `<li class="ml-4 list-decimal">${line.substring(3)}</li>`;
                if (line.trim() === '') return '<br />';
                return `<p>${line}</p>`;
            })
            .join('');
    };

    return <div dangerouslySetInnerHTML={{ __html: formatText(text) }} />;
};

const Spinner: React.FC = () => (
    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-900"></div>
);

const RecipeChat: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const chatRef = useRef<Chat | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    chatRef.current = createChat();
    setMessages([{ role: 'model', text: 'Hello! I am Gemi, your personal chef assistant. What would you like to cook today?' }]);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = { role: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      if (chatRef.current) {
        const response = await chatRef.current.sendMessage({ message: input });
        const modelMessage: ChatMessage = { role: 'model', text: response.text };
        setMessages(prev => [...prev, modelMessage]);
      }
    } catch (error) {
      console.error("Error sending message:", error);
      const errorMessage: ChatMessage = { role: 'model', text: 'Sorry, I had trouble connecting. Please try again.' };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-12rem)] max-w-3xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
      <div className="flex-1 p-6 overflow-y-auto space-y-4">
        {messages.map((msg, index) => (
          <div key={index} className={`flex items-start gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}>
            {msg.role === 'model' && <div className="w-8 h-8 rounded-full bg-[#FF6B6B] flex-shrink-0"></div>}
            <div className={`max-w-md p-3 rounded-2xl ${msg.role === 'user' ? 'bg-[#FFDAB9] rounded-br-none' : 'bg-gray-100 rounded-bl-none'}`}>
              <div className="prose prose-sm max-w-none">
                 <SimpleMarkdown text={msg.text} />
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-[#FF6B6B] flex-shrink-0"></div>
            <div className="max-w-md p-3 rounded-2xl bg-gray-100 rounded-bl-none flex items-center">
              <Spinner />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-4 bg-white border-t border-gray-200">
        <form onSubmit={handleSend} className="flex items-center space-x-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="e.g., How do I make pancakes?"
            className="flex-1 w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#FF6B6B]"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="p-3 rounded-full bg-[#FF6B6B] text-white disabled:bg-gray-300 transition-colors duration-200 hover:bg-[#ff5252] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FF6B6B]"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
};

export default RecipeChat;
