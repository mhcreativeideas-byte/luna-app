import { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, Send, Sparkles } from 'lucide-react';
import { useCycle } from '../contexts/CycleContext';
import { getLunaResponse, CHAT_SUGGESTIONS } from '../data/chatResponses';

export default function Chat() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { cycleInfo, dispatch, chatHistory } = useCycle();
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const bottomRef = useRef(null);
  const phase = cycleInfo?.phase || 'follicular';

  useEffect(() => {
    if (chatHistory && chatHistory.length > 0) {
      setMessages(chatHistory.slice(-20));
    }
    const q = searchParams.get('q');
    if (q) {
      handleSend(q);
    }
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (text) => {
    const userMsg = { role: 'user', content: text || input, date: new Date().toISOString() };
    const response = getLunaResponse(text || input, phase);
    const lunaMsg = { role: 'luna', content: response, date: new Date().toISOString() };

    setMessages((prev) => [...prev, userMsg, lunaMsg]);
    dispatch({ type: 'ADD_CHAT_MESSAGE', payload: userMsg });
    dispatch({ type: 'ADD_CHAT_MESSAGE', payload: lunaMsg });
    setInput('');
  };

  return (
    <div className="flex flex-col h-[calc(100vh-5rem)] lg:h-[calc(100vh-2rem)]">
      {/* Header */}
      <div className="flex items-center gap-3 pb-4">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-luna-text-muted hover:text-luna-text transition-colors"
          style={{ boxShadow: '0 2px 8px rgba(45, 34, 38, 0.06)' }}
        >
          <ChevronLeft size={20} />
        </button>
        <div className="flex items-center gap-2">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #C4727F, #D4846A)' }}
          >
            <Sparkles size={14} className="text-white" />
          </div>
          <div>
            <h1 className="font-display text-lg text-luna-text leading-none">LUNA</h1>
            <p className="text-[10px] text-luna-text-hint font-body">Ton assistante bien-etre</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-3 pb-4">
        {messages.length === 0 && (
          <div className="text-center py-8">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
              style={{ background: 'linear-gradient(135deg, #F5D0D5, #F2C0A8)' }}
            >
              <Sparkles size={24} className="text-white" />
            </div>
            <p className="text-sm text-luna-text-muted font-body mb-5 max-w-xs mx-auto leading-relaxed">
              Pose-moi une question sur ton cycle, ton alimentation, ton sport ou ton bien-etre !
            </p>
            <div className="space-y-2 max-w-sm mx-auto">
              {CHAT_SUGGESTIONS.map((s, i) => (
                <button
                  key={i}
                  onClick={() => handleSend(s)}
                  className="block w-full text-left px-4 py-3 rounded-[16px] bg-white text-sm font-body text-luna-text-body hover:shadow-md transition-all"
                  style={{ boxShadow: '0 2px 8px rgba(45, 34, 38, 0.04)' }}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] px-4 py-3 text-sm font-body leading-relaxed ${
                msg.role === 'user'
                  ? 'rounded-[18px] rounded-br-[6px] text-white'
                  : 'rounded-[18px] rounded-bl-[6px] bg-white text-luna-text-body'
              }`}
              style={msg.role === 'user' ? {
                background: 'linear-gradient(135deg, #C4727F, #D4846A)',
              } : {
                boxShadow: '0 2px 8px rgba(45, 34, 38, 0.04)',
              }}
            >
              {msg.content}
            </div>
          </motion.div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="flex gap-2 pt-3 pb-1">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && input.trim() && handleSend()}
          placeholder="Ecris ta question..."
          className="flex-1 px-5 py-3.5 rounded-[18px] bg-white border border-gray-100 text-sm font-body text-luna-text focus:outline-none focus:ring-2 focus:ring-luna-rose/30 focus:border-transparent"
          style={{ boxShadow: '0 2px 8px rgba(45, 34, 38, 0.04)' }}
        />
        <button
          onClick={() => input.trim() && handleSend()}
          disabled={!input.trim()}
          className="w-12 h-12 flex items-center justify-center rounded-full text-white transition-all disabled:opacity-30"
          style={{
            background: 'linear-gradient(135deg, #C4727F, #D4846A)',
            boxShadow: '0 2px 12px rgba(196, 114, 127, 0.25)',
          }}
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  );
}
