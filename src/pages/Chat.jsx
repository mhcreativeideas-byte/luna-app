import { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, Send } from 'lucide-react';
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
    // Load history
    if (chatHistory && chatHistory.length > 0) {
      setMessages(chatHistory.slice(-20));
    }
    // Auto-send if query param
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
        <button onClick={() => navigate(-1)} className="text-luna-text-muted hover:text-luna-text">
          <ChevronLeft size={24} />
        </button>
        <div>
          <h1 className="font-display text-lg text-luna-text">LUNA</h1>
          <p className="text-xs text-luna-text-hint font-body">Ton assistante bien-être</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-3 pb-4">
        {messages.length === 0 && (
          <div className="text-center py-8">
            <span className="text-5xl block mb-4">🌿</span>
            <p className="text-sm text-luna-text-muted font-body mb-4">
              Pose-moi une question sur ton cycle, ton alimentation, ton sport ou ton bien-être !
            </p>
            <div className="space-y-2">
              {CHAT_SUGGESTIONS.map((s, i) => (
                <button
                  key={i}
                  onClick={() => handleSend(s)}
                  className="block w-full text-left px-4 py-2.5 rounded-luna-sm bg-luna-cream-card text-sm font-body text-luna-text-body hover:bg-luna-sage/20 transition-colors"
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
              className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm font-body leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-luna-orange text-white rounded-br-sm'
                  : 'bg-luna-cream-card text-luna-text-body rounded-bl-sm'
              }`}
            >
              {msg.content}
            </div>
          </motion.div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="flex gap-2 pt-2 border-t border-luna-sage/20">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && input.trim() && handleSend()}
          placeholder="Écris ta question..."
          className="flex-1 px-4 py-3 rounded-pill bg-luna-cream-card border border-luna-sage/20 text-sm font-body text-luna-text focus:outline-none focus:ring-2 focus:ring-luna-orange/30"
        />
        <button
          onClick={() => input.trim() && handleSend()}
          disabled={!input.trim()}
          className="w-11 h-11 flex items-center justify-center rounded-full bg-luna-orange text-white hover:bg-luna-orange-deep transition-colors disabled:opacity-30"
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  );
}
