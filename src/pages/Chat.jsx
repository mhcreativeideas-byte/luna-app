import { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Send, Sparkles, ChevronDown } from 'lucide-react';
import { useCycle } from '../contexts/CycleContext';
import { getLunaResponse, SUGGESTION_CATEGORIES, QUICK_SUGGESTIONS } from '../data/chatResponses';
import { PHASES } from '../data/phases';

export default function Chat() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { cycleInfo, dispatch, chatHistory, name, cycleLength, periodLength, todayCheckIn, goals } = useCycle();
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [typing, setTyping] = useState(false);
  const [showCategories, setShowCategories] = useState(false);
  const [activeCategory, setActiveCategory] = useState(null);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);
  const phase = cycleInfo?.phase || 'follicular';
  const phaseData = PHASES[phase];

  // Contexte utilisatrice pour personnaliser les réponses
  const userContext = {
    name: name || 'ma belle',
    currentDay: cycleInfo?.currentDay || 1,
    cycleLength: cycleLength || 28,
    periodLength: periodLength || 5,
    daysUntilPeriod: cycleInfo?.daysUntilPeriod || 0,
    energy: todayCheckIn?.energy || null,
    symptoms: todayCheckIn?.symptoms ? Object.values(todayCheckIn.symptoms).flat() : [],
    goals: goals || [],
  };

  useEffect(() => {
    if (chatHistory && chatHistory.length > 0) {
      setMessages(chatHistory.slice(-30));
    }
    const q = searchParams.get('q');
    if (q) {
      handleSend(q);
    }
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  const handleSend = (text) => {
    const content = text || input;
    if (!content.trim()) return;

    const userMsg = { role: 'user', content, date: new Date().toISOString() };
    setMessages((prev) => [...prev, userMsg]);
    dispatch({ type: 'ADD_CHAT_MESSAGE', payload: userMsg });
    setInput('');
    setShowCategories(false);
    setActiveCategory(null);

    // Simule un délai de "réflexion"
    setTyping(true);
    setTimeout(() => {
      const response = getLunaResponse(content, phase, userContext);
      const lunaMsg = { role: 'luna', content: response, date: new Date().toISOString() };
      setMessages((prev) => [...prev, lunaMsg]);
      dispatch({ type: 'ADD_CHAT_MESSAGE', payload: lunaMsg });
      setTyping(false);
    }, 600 + Math.random() * 800);
  };

  // Rendu d'un message LUNA avec formatage
  const renderLunaContent = (content) => {
    const lines = content.split('\n');
    return lines.map((line, i) => {
      if (!line.trim()) return <div key={i} className="h-2" />;
      if (line.startsWith('•')) {
        return (
          <p key={i} className="pl-2 text-sm font-body text-luna-text-body leading-relaxed">
            <span style={{ color: phaseData.color }}>•</span>{line.slice(1)}
          </p>
        );
      }
      if (line.match(/^[🥗🍽️💡⚡✅❌🔍🔔🧠🧘🏋️🏆🌙📋💧✨💪💛💜🌱🌸🌿🚀👑💆‍♀️😴🍫🐟🍎]/u)) {
        return <p key={i} className="text-sm font-body text-luna-text-body leading-relaxed mt-1">{line}</p>;
      }
      if (line.match(/^[A-ZÀ-Ü].*:$/)) {
        return <p key={i} className="text-xs font-body font-bold text-luna-text-hint uppercase tracking-wider mt-2 mb-0.5">{line}</p>;
      }
      return <p key={i} className="text-sm font-body text-luna-text-body leading-relaxed">{line}</p>;
    });
  };

  return (
    <div className="flex flex-col h-[calc(100vh-5rem)] lg:h-[calc(100vh-2rem)]">
      {/* Header */}
      <div className="flex items-center gap-3 pb-3">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-luna-text-muted hover:text-luna-text transition-colors"
          style={{ boxShadow: '0 2px 8px rgba(45, 34, 38, 0.06)' }}
        >
          <ChevronLeft size={20} />
        </button>
        <div className="flex items-center gap-2 flex-1">
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center"
            style={{ background: `linear-gradient(135deg, ${phaseData.color}, ${phaseData.colorDark})` }}
          >
            <Sparkles size={15} className="text-white" />
          </div>
          <div>
            <h1 className="font-display text-lg text-luna-text leading-none">LUNA</h1>
            <p className="text-[10px] font-body" style={{ color: phaseData.color }}>
              {phaseData.shortName} · J{cycleInfo?.currentDay || 1}
            </p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-3 pb-4">
        {messages.length === 0 && (
          <div className="py-4">
            {/* Welcome */}
            <div className="text-center mb-6">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3"
                style={{ background: `linear-gradient(135deg, ${phaseData.bgColor}, ${phaseData.color}30)` }}
              >
                <Sparkles size={24} style={{ color: phaseData.color }} />
              </div>
              <p className="font-display text-lg text-luna-text mb-1">
                {name ? `Hey ${name} 💛` : 'Hey 💛'}
              </p>
              <p className="text-sm text-luna-text-muted font-body max-w-xs mx-auto leading-relaxed">
                Pose-moi n'importe quelle question sur ton cycle, ton alimentation, ton sport, ton sommeil ou ton bien-être.
              </p>
            </div>

            {/* Quick suggestions */}
            <div className="space-y-2 mb-4">
              {QUICK_SUGGESTIONS.map((s, i) => (
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

            {/* More questions by category */}
            <button
              onClick={() => setShowCategories(!showCategories)}
              className="flex items-center gap-2 mx-auto text-xs font-body font-semibold transition-colors"
              style={{ color: phaseData.color }}
            >
              Plus de questions
              <ChevronDown size={14} className={`transition-transform ${showCategories ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
              {showCategories && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-3 space-y-2 overflow-hidden"
                >
                  {/* Category pills */}
                  <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-1">
                    {SUGGESTION_CATEGORIES.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => setActiveCategory(activeCategory === cat.id ? null : cat.id)}
                        className="flex-shrink-0 px-3 py-1.5 rounded-pill text-xs font-body font-semibold transition-all whitespace-nowrap"
                        style={activeCategory === cat.id ? {
                          backgroundColor: phaseData.color,
                          color: 'white',
                        } : {
                          backgroundColor: 'white',
                          color: '#8A7B7F',
                          boxShadow: '0 1px 4px rgba(45,34,38,0.06)',
                        }}
                      >
                        {cat.label}
                      </button>
                    ))}
                  </div>

                  {/* Questions for selected category */}
                  <AnimatePresence mode="wait">
                    {activeCategory && (
                      <motion.div
                        key={activeCategory}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="space-y-1.5"
                      >
                        {SUGGESTION_CATEGORIES.find((c) => c.id === activeCategory)?.questions.map((q, i) => (
                          <button
                            key={i}
                            onClick={() => handleSend(q)}
                            className="block w-full text-left px-4 py-2.5 rounded-[14px] bg-white text-sm font-body text-luna-text-body hover:shadow-md transition-all"
                            style={{ boxShadow: '0 1px 6px rgba(45, 34, 38, 0.04)' }}
                          >
                            {q}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* Message list */}
        {messages.map((msg, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.role === 'luna' && (
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mr-2 mt-1"
                style={{ background: `linear-gradient(135deg, ${phaseData.color}40, ${phaseData.color}20)` }}
              >
                <Sparkles size={12} style={{ color: phaseData.color }} />
              </div>
            )}
            <div
              className={`max-w-[80%] px-4 py-3 ${
                msg.role === 'user'
                  ? 'rounded-[18px] rounded-br-[6px] text-white text-sm font-body leading-relaxed'
                  : 'rounded-[18px] rounded-bl-[6px] bg-white'
              }`}
              style={msg.role === 'user' ? {
                background: `linear-gradient(135deg, ${phaseData.color}, ${phaseData.colorDark})`,
              } : {
                boxShadow: '0 2px 8px rgba(45, 34, 38, 0.04)',
              }}
            >
              {msg.role === 'luna' ? renderLunaContent(msg.content) : msg.content}
            </div>
          </motion.div>
        ))}

        {/* Typing indicator */}
        {typing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2"
          >
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ background: `linear-gradient(135deg, ${phaseData.color}40, ${phaseData.color}20)` }}
            >
              <Sparkles size={12} style={{ color: phaseData.color }} />
            </div>
            <div className="bg-white rounded-[18px] rounded-bl-[6px] px-4 py-3" style={{ boxShadow: '0 2px 8px rgba(45, 34, 38, 0.04)' }}>
              <div className="flex gap-1.5">
                <motion.span animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: 0 }} className="w-2 h-2 rounded-full" style={{ backgroundColor: phaseData.color }} />
                <motion.span animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-2 h-2 rounded-full" style={{ backgroundColor: phaseData.color }} />
                <motion.span animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-2 h-2 rounded-full" style={{ backgroundColor: phaseData.color }} />
              </div>
            </div>
          </motion.div>
        )}

        {/* Follow-up suggestions after conversation */}
        {messages.length > 0 && !typing && (
          <div className="pt-2">
            <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-1">
              {QUICK_SUGGESTIONS.filter((s) => !messages.some((m) => m.content === s)).slice(0, 3).map((s, i) => (
                <button
                  key={i}
                  onClick={() => handleSend(s)}
                  className="flex-shrink-0 px-3.5 py-2 rounded-pill text-xs font-body font-semibold whitespace-nowrap transition-all"
                  style={{ backgroundColor: `${phaseData.color}15`, color: phaseData.colorDark }}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="flex gap-2 pt-3 pb-1">
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && input.trim() && handleSend()}
          placeholder="Pose ta question à LUNA..."
          className="flex-1 px-5 py-3.5 rounded-[18px] bg-white border border-gray-100 text-sm font-body text-luna-text focus:outline-none focus:ring-2 focus:border-transparent"
          style={{ boxShadow: '0 2px 8px rgba(45, 34, 38, 0.04)', '--tw-ring-color': `${phaseData.color}30` }}
        />
        <button
          onClick={() => input.trim() && handleSend()}
          disabled={!input.trim()}
          className="w-12 h-12 flex items-center justify-center rounded-full text-white transition-all disabled:opacity-30"
          style={{
            background: `linear-gradient(135deg, ${phaseData.color}, ${phaseData.colorDark})`,
            boxShadow: `0 2px 12px ${phaseData.color}40`,
          }}
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  );
}
