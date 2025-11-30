import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";
import { AnimalProfile, ChatMessage } from '../types';
import { Send, User, Ghost } from 'lucide-react';

interface ChatViewProps {
  country: string;
  animal: AnimalProfile;
}

export const ChatView: React.FC<ChatViewProps> = ({ country, animal }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatSessionRef = useRef<Chat | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initialize chat
    const apiKey = process.env.API_KEY;
    if (apiKey) {
      const ai = new GoogleGenAI({ apiKey });
      chatSessionRef.current = ai.chats.create({
        model: 'gemini-2.5-flash',
        config: {
          systemInstruction: `You are the Spirit Guide of the ${animal.name} from ${country}. 
          Speak with wisdom, brevity, and a slightly mystical tone. 
          Your goal is to educate the user about your species, your habitat, and your connection to the nation's culture.`,
        },
      });
      // Initial greeting
      setMessages([{
        id: 'init',
        role: 'model',
        text: `I am the spirit of the ${animal.name}. Ask me about my life in ${country}, or my hidden connection to the land.`
      }]);
    }
  }, [country, animal]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSend = async () => {
    if (!input.trim() || !chatSessionRef.current) return;

    const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const response = await chatSessionRef.current.sendMessageStream({ message: input });
      
      let fullText = '';
      const botMsgId = (Date.now() + 1).toString();
      
      // Add placeholder bot message
      setMessages(prev => [...prev, { id: botMsgId, role: 'model', text: '' }]);

      for await (const chunk of response) {
         const c = chunk as GenerateContentResponse;
         if (c.text) {
             fullText += c.text;
             setMessages(prev => prev.map(m => m.id === botMsgId ? { ...m, text: fullText } : m));
         }
      }

    } catch (error) {
      console.error("Chat error:", error);
      setMessages(prev => [...prev, { id: Date.now().toString(), role: 'model', text: "The connection has been severed." }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto h-[600px] flex flex-col bg-mystic-800/50 rounded-xl border border-mystic-700 shadow-xl overflow-hidden animate-fade-in">
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg) => (
                <div key={msg.id} className={`flex items-start gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                        msg.role === 'user' ? 'bg-mystic-600' : 'bg-mystic-accent text-black'
                    }`}>
                        {msg.role === 'user' ? <User size={16} /> : <Ghost size={16} />}
                    </div>
                    <div className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                        msg.role === 'user' 
                            ? 'bg-mystic-700 text-white rounded-tr-sm' 
                            : 'bg-mystic-900/80 text-gray-200 border border-mystic-700 rounded-tl-sm'
                    }`}>
                        {msg.text}
                    </div>
                </div>
            ))}
            {isTyping && (
                <div className="flex items-center gap-2 ml-12 text-gray-500 text-xs animate-pulse">
                    The spirit is thinking...
                </div>
            )}
            <div ref={messagesEndRef} />
        </div>

        <div className="p-4 bg-mystic-900 border-t border-mystic-700 flex gap-2">
            <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask the spirit guide..."
                className="flex-1 bg-mystic-800 border border-mystic-600 rounded-full px-4 py-3 text-white focus:outline-none focus:border-mystic-accent transition-colors placeholder-gray-500"
            />
            <button 
                onClick={handleSend}
                disabled={!input.trim() || isTyping}
                className="p-3 bg-mystic-accent text-black rounded-full hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <Send size={20} />
            </button>
        </div>
    </div>
  );
};