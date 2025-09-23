import React, { useState, useEffect, useRef, useCallback } from 'react';
import type { Chat } from '@google/genai';
import { startChat } from '../services/geminiService';
import { ChatMessage, MessageRole } from '../types';
import SendIcon from './icons/SendIcon';
import BotIcon from './icons/BotIcon';

const ChatInterface: React.FC = () => {
  const [chat, setChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const initializeChat = useCallback(async () => {
    try {
      const chatSession = startChat();
      setChat(chatSession);
      const response = await chatSession.sendMessageStream({ message: "Hello" });
      
      setIsLoading(false);
      let fullResponse = "";
      setMessages([{ role: MessageRole.MODEL, content: "" }]);

      for await (const chunk of response) {
          fullResponse += chunk.text;
          setMessages([{ role: MessageRole.MODEL, content: fullResponse }]);
      }
    } catch (error) {
      console.error("Failed to initialize chat:", error);
      setIsLoading(false);
      setMessages([{ role: MessageRole.MODEL, content: "Sorry, I'm having trouble connecting. Please try again later." }]);
    }
  }, []);

  useEffect(() => {
    initializeChat();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim() || !chat || isLoading) return;

    const userMessage: ChatMessage = {
      role: MessageRole.USER,
      content: userInput,
    };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setUserInput('');
    setIsLoading(true);
    
    try {
      const response = await chat.sendMessageStream({ message: userInput });
      
      let fullResponse = "";
      setMessages(prev => [...prev, { role: MessageRole.MODEL, content: "" }]);

      for await (const chunk of response) {
          fullResponse += chunk.text;
          setMessages(prev => {
              const newMessages = [...prev];
              newMessages[newMessages.length - 1].content = fullResponse;
              return newMessages;
          });
      }

    } catch (error) {
      console.error("Error sending message:", error);
       setMessages(prev => [...prev, { role: MessageRole.MODEL, content: "An error occurred. Please try again." }]);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="flex flex-col flex-auto flex-shrink-0 rounded-2xl bg-white shadow-xl h-full">
      <div className="flex flex-col h-full overflow-hidden">
        {/* Header */}
        <div className="flex flex-row items-center justify-between p-4 border-b border-gray-200">
           <div className="flex items-center">
             <div className="relative flex items-center justify-center h-10 w-10 rounded-full bg-emerald-500 text-white font-bold text-xl">
               +
             </div>
             <div className="ml-3 text-lg font-semibold">Health Assistant</div>
           </div>
        </div>

        {/* Messages */}
        <div id="messages" className="flex flex-col flex-grow p-4 overflow-y-auto">
          {messages.map((msg, index) => (
            <div key={index} className={`flex items-end ${msg.role === MessageRole.USER ? 'justify-end' : ''}`}>
              <div className={`flex flex-col space-y-2 text-sm max-w-xs mx-2 order-2 ${msg.role === MessageRole.USER ? 'items-end' : 'items-start'}`}>
                <div>
                  <span className={`px-4 py-2 rounded-lg inline-block whitespace-pre-wrap ${msg.role === MessageRole.USER ? 'rounded-br-none bg-sky-600 text-white' : 'rounded-bl-none bg-gray-200 text-gray-800'}`}>
                    {msg.content}
                  </span>
                </div>
              </div>
              {msg.role === MessageRole.MODEL && (
                 <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center order-1 flex-shrink-0">
                    <BotIcon />
                 </div>
              )}
            </div>
          ))}
          {isLoading && messages.length > 0 && (
            <div className="flex items-end">
               <div className="flex flex-col space-y-2 text-sm max-w-xs mx-2 order-2 items-start">
                  <div>
                    <span className="px-4 py-2 rounded-lg inline-block rounded-bl-none bg-gray-200 text-gray-800">
                      <span className="animate-pulse">...</span>
                    </span>
                  </div>
                </div>
                <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center order-1 flex-shrink-0">
                    <BotIcon />
                </div>
            </div>
          )}
           {isLoading && messages.length === 0 && (
             <div className="flex items-center justify-center h-full">
                <div className="flex flex-col items-center">
                    <BotIcon />
                    <p className="text-gray-500 mt-2">Connecting to health assistant...</p>
                </div>
             </div>
           )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="border-t-2 border-gray-200 px-4 pt-4 mb-2 sm:mb-0">
          <form onSubmit={handleSendMessage} className="relative flex">
            <input
              type="text"
              placeholder="Describe your symptoms..."
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              disabled={isLoading}
              className="w-full focus:outline-none focus:placeholder-gray-400 text-gray-600 placeholder-gray-600 pl-4 bg-gray-100 rounded-md py-3"
            />
            <div className="absolute right-0 items-center inset-y-0 hidden sm:flex">
              <button
                type="submit"
                disabled={isLoading || !userInput.trim()}
                className="inline-flex items-center justify-center rounded-lg px-4 py-2 transition duration-500 ease-in-out text-white bg-sky-500 hover:bg-sky-600 focus:outline-none disabled:bg-sky-300 disabled:cursor-not-allowed"
              >
                <span className="font-bold">Send</span>
                <SendIcon />
              </button>
            </div>
          </form>
           <p className="text-xs text-gray-500 text-center mt-2 px-4 pb-2">
            Disclaimer: I am an AI assistant and not a medical professional. This is for informational purposes only and does not constitute medical advice.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;