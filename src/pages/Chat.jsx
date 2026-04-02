import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Send, Sparkles, ChevronDown, Plus, Clock, Trash2, Archive, X } from 'lucide-react';
import { useCycle } from '../contexts/CycleContext';
import { getLunaResponse, SUGGESTION_CATEGORIES, QUICK_SUGGESTIONS } from '../data/chatResponses';
import { PHASES } from '../data/phases';

export default function Chat() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { cycleInfo, dispatch, conversations, activeConversationId, name, cycleLength, periodLength, todayCheckIn, goals } = useCycle();
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const [showCategories, setShowCategories] = useState(false);
  const [activeCategory, setActiveCategory] = useState(null);
  const [showHistory, setShowHistory] = useState(false);
  const [swipedId, setSwipedId] = useState(null);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);
  const touchStartX = useRef(0);
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

  // Conversation active
  const activeConversation = (conversations || []).find((c) => c.id === activeConversationId);
  const messages = activeConversation?.messages || [];
  const visibleConversations = (conversations || []).filter((c) => !c.archived);
  const archivedConversations = (conversations || []).filter((c) => c.archived);

  // Au chargement : crée ou reprend une conversation
  useEffect(() => {
    if (!conversations || conversations.length === 0) {
      // Première visite : créer une conversation
      createNewConversation();
    } else if (!activeConversationId) {
      // Pas de conversation active : prendre la plus récente non archivée
      const latest = visibleConversations[0];
      if (latest) {
        dispatch({ type: 'SET_ACTIVE_CONVERSATION', payload: { id: latest.id } });
      } else {
        createNewConversation();
      }
    }
    // Gérer le paramètre ?q=
    const q = searchParams.get('q');
    if (q) {
      setTimeout(() => handleSend(q), 300);
    }
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  const createNewConversation = useCallback(() => {
    const id = `conv_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
    dispatch({ type: 'CREATE_CONVERSATION', payload: { id } });
    setShowHistory(false);
    setShowCategories(false);
    setActiveCategory(null);
  }, [dispatch]);

  const switchConversation = useCallback((id) => {
    dispatch({ type: 'SET_ACTIVE_CONVERSATION', payload: { id } });
    setShowHistory(false);
    setSwipedId(null);
  }, [dispatch]);

  const deleteConversation = useCallback((id) => {
    dispatch({ type: 'DELETE_CONVERSATION', payload: { id } });
    setSwipedId(null);
  }, [dispatch]);

  const archiveConversation = useCallback((id) => {
    dispatch({ type: 'ARCHIVE_CONVERSATION', payload: { id } });
    setSwipedId(null);
  }, [dispatch]);

  const handleSend = (text) => {
    const content = text || input;
    if (!content.trim() || !activeConversationId) return;

    const userMsg = { role: 'user', content, date: new Date().toISOString() };
    dispatch({ type: 'ADD_CONVERSATION_MESSAGE', payload: { conversationId: activeConversationId, message: userMsg } });
    setInput('');
    setShowCategories(false);
    setActiveCategory(null);

    // Simule un délai de "réflexion"
    setTyping(true);
    setTimeout(() => {
      const response = getLunaResponse(content, phase, userContext);
      const lunaMsg = { role: 'luna', content: response, date: new Date().toISOString() };
      dispatch({ type: 'ADD_CONVERSATION_MESSAGE', payload: { conversationId: activeConversationId, message: lunaMsg } });
      setTyping(false);
    }, 600 + Math.random() * 800);
  };

  // Swipe handlers pour l'historique
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e, id) => {
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (diff > 60) {
      setSwipedId(swipedId === id ? null : id);
    } else if (diff < -60) {
      setSwipedId(null);
    }
  };

  // Format date relative
  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    const now = new Date();
    const diff = Math.floor((now - d) / (1000 * 60 * 60 * 24));
    if (diff === 0) return "Aujourd'hui";
    if (diff === 1) return 'Hier';
    if (diff < 7) return `Il y a ${diff} jours`;
    return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
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
      if (line.match(/^[🥗🍽️💡⚡✅❌🔍🔔🧠🧘🏋️🏆🌙📋💧✨💪💛💜🌱🌸🌿🚀👑💆‍♀️😴🍫🐟🍎👩‍🍳⏱️📝👉📊🧬☀️🍵]/u)) {
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
          onClick={() => navigate('/dashboard')}
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
        <div className="flex items-center gap-1.5">
          {/* Historique */}
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="w-9 h-9 rounded-full flex items-center justify-center transition-colors"
            style={{
              backgroundColor: showHistory ? `${phaseData.color}20` : 'white',
              boxShadow: '0 2px 8px rgba(45, 34, 38, 0.06)',
              color: showHistory ? phaseData.colorDark : '#8A7B7F',
            }}
          >
            <Clock size={17} />
          </button>
          {/* Nouvelle conversation */}
          <button
            onClick={createNewConversation}
            className="w-9 h-9 rounded-full flex items-center justify-center text-white transition-all"
            style={{
              background: `linear-gradient(135deg, ${phaseData.color}, ${phaseData.colorDark})`,
              boxShadow: `0 2px 8px ${phaseData.color}40`,
            }}
          >
            <Plus size={18} />
          </button>
        </div>
      </div>

      {/* Panneau historique */}
      <AnimatePresence>
        {showHistory && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden mb-3"
          >
            <div
              className="rounded-[20px] p-3 max-h-[45vh] overflow-y-auto"
              style={{ backgroundColor: 'white', boxShadow: '0 4px 20px rgba(45, 34, 38, 0.08)' }}
            >
              <div className="flex items-center justify-between mb-2 px-1">
                <p className="text-xs font-body font-semibold text-luna-text-muted uppercase tracking-wider">
                  Conversations
                </p>
                <button onClick={() => setShowHistory(false)} className="text-luna-text-hint">
                  <X size={14} />
                </button>
              </div>

              {visibleConversations.length === 0 ? (
                <p className="text-xs text-luna-text-hint font-body text-center py-4">Aucune conversation</p>
              ) : (
                <div className="space-y-1">
                  {visibleConversations.map((conv) => (
                    <div
                      key={conv.id}
                      className="relative overflow-hidden rounded-[14px]"
                      onTouchStart={handleTouchStart}
                      onTouchEnd={(e) => handleTouchEnd(e, conv.id)}
                    >
                      {/* Actions swipe */}
                      <AnimatePresence>
                        {swipedId === conv.id && (
                          <motion.div
                            initial={{ opacity: 0, width: 0 }}
                            animate={{ opacity: 1, width: 'auto' }}
                            exit={{ opacity: 0, width: 0 }}
                            className="absolute right-0 top-0 bottom-0 flex items-center gap-1 pr-2 z-10"
                          >
                            <button
                              onClick={() => archiveConversation(conv.id)}
                              className="w-8 h-8 rounded-full bg-amber-50 flex items-center justify-center text-amber-500"
                            >
                              <Archive size={14} />
                            </button>
                            <button
                              onClick={() => deleteConversation(conv.id)}
                              className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center text-red-400"
                            >
                              <Trash2 size={14} />
                            </button>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      <button
                        onClick={() => switchConversation(conv.id)}
                        className="w-full text-left px-3 py-2.5 rounded-[14px] transition-all"
                        style={conv.id === activeConversationId ? {
                          backgroundColor: `${phaseData.color}12`,
                          borderLeft: `3px solid ${phaseData.color}`,
                        } : {
                          backgroundColor: 'transparent',
                          borderLeft: '3px solid transparent',
                        }}
                      >
                        <p className={`text-sm font-body truncate ${conv.id === activeConversationId ? 'font-semibold text-luna-text' : 'text-luna-text-body'}`}>
                          {conv.title}
                        </p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <p className="text-[10px] font-body text-luna-text-hint">
                            {formatDate(conv.createdAt)}
                          </p>
                          <p className="text-[10px] font-body text-luna-text-hint">
                            · {conv.messages.length} messages
                          </p>
                        </div>
                      </button>

                      {/* Desktop: boutons toujours visibles au hover */}
                      <div className="hidden lg:flex absolute right-2 top-1/2 -translate-y-1/2 items-center gap-1 opacity-0 hover:opacity-100 group-hover:opacity-100"
                        style={{ opacity: swipedId === conv.id ? 1 : undefined }}
                      >
                        <button
                          onClick={(e) => { e.stopPropagation(); archiveConversation(conv.id); }}
                          className="w-7 h-7 rounded-full hover:bg-amber-50 flex items-center justify-center text-luna-text-hint hover:text-amber-500 transition-colors"
                        >
                          <Archive size={13} />
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); deleteConversation(conv.id); }}
                          className="w-7 h-7 rounded-full hover:bg-red-50 flex items-center justify-center text-luna-text-hint hover:text-red-400 transition-colors"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Archivées */}
              {archivedConversations.length > 0 && (
                <details className="mt-3">
                  <summary className="text-[10px] font-body font-semibold text-luna-text-hint uppercase tracking-wider cursor-pointer px-1">
                    Archivées ({archivedConversations.length})
                  </summary>
                  <div className="space-y-1 mt-1">
                    {archivedConversations.map((conv) => (
                      <div key={conv.id} className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            archiveConversation(conv.id); // un-archive
                            switchConversation(conv.id);
                          }}
                          className="flex-1 text-left px-3 py-2 rounded-[12px] hover:bg-gray-50 transition-colors"
                        >
                          <p className="text-xs font-body text-luna-text-hint truncate">{conv.title}</p>
                          <p className="text-[10px] font-body text-luna-text-hint">{formatDate(conv.createdAt)}</p>
                        </button>
                        <button
                          onClick={() => deleteConversation(conv.id)}
                          className="w-7 h-7 rounded-full hover:bg-red-50 flex items-center justify-center text-luna-text-hint hover:text-red-400"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                </details>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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
