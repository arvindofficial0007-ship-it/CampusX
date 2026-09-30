import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  AgentChatMessage, 
  Building, 
  MapNode, 
  CampusPreset, 
  AgentActionCard 
} from '../types';
import { 
  Send, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  Bot, 
  User, 
  Navigation, 
  Building2, 
  Clock, 
  Calendar, 
  ShieldAlert, 
  ArrowRight, 
  CheckCircle2, 
  HelpCircle,
  CornerDownRight
} from 'lucide-react';

interface NavigationAgentChatProps {
  campusPreset: CampusPreset;
  currentLocationNode: MapNode;
  onExecuteActionCard: (card: AgentActionCard) => void;
  onNavigateToBuilding: (buildingId: string, roomId?: string) => void;
  onOpenBuildingDetail: (building: Building) => void;
  onOpenScheduleOptimizer: () => void;
  onOpenEmergency: () => void;
  buildings: Building[];
}

export const NavigationAgentChat: React.FC<NavigationAgentChatProps> = ({
  campusPreset,
  currentLocationNode,
  onExecuteActionCard,
  onNavigateToBuilding,
  onOpenBuildingDetail,
  onOpenScheduleOptimizer,
  onOpenEmergency,
  buildings
}) => {
  const [messages, setMessages] = useState<AgentChatMessage[]>([
    {
      id: 'welcome-msg',
      sender: 'agent',
      timestamp: 'Just now',
      text: `Hello! I am **NaviGenius**, your intelligent college campus guide for **${campusPreset.name}**.\n\nAsk me anything: classroom directions, faculty office hours, quiet study pods, accessible wheelchair paths, or cafeteria menus!`,
      suggestedFollowUps: [
        'How do I get to CS Lab 108?',
        'Where is a quiet study spot with power?',
        'Wheelchair route to Newton Hall',
        'Show campus shuttle bus timings'
      ]
    }
  ]);
  const [inputText, setInputText] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isListening, setIsListening] = useState<boolean>(false);
  const [isAudioSpeechEnabled, setIsAudioSpeechEnabled] = useState<boolean>(true);
  const [speechError, setSpeechError] = useState<string | null>(null);

  const chatContainerRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  // Auto scroll to bottom when messages update
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  // Initialize Speech Recognition
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputText(transcript);
        handleSendMessage(transcript);
        setIsListening(false);
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        setSpeechError('Microphone input interrupted.');
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, []);

  // Text-To-Speech helper
  const speakText = (text: string) => {
    if (!isAudioSpeechEnabled || !('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      // Strip markdown bold and headers for natural speech
      const cleanText = text.replace(/[*#_`]/g, '').replace(/\[.*?\]/g, '');
      const utterance = new SpeechSynthesisUtterance(cleanText.slice(0, 240));
      utterance.rate = 1.05;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn('TTS playback error:', e);
    }
  };

  const toggleVoiceInput = () => {
    if (!recognitionRef.current) {
      alert('Speech recognition is not supported in this browser. Please type your query.');
      return;
    }
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      setSpeechError(null);
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err) {
        console.error('Error starting speech:', err);
      }
    }
  };

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputText).trim();
    if (!query || isLoading) return;

    const userMsg: AgentChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: query
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/campus-agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          currentLocation: currentLocationNode,
          campusPreset,
          chatHistory: messages.slice(-4)
        })
      });

      const data = await res.json();

      const agentMsg: AgentChatMessage = {
        id: `agent-${Date.now()}`,
        sender: 'agent',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        text: data.text || "I found information for your campus query.",
        actionCard: data.actionCard,
        suggestedFollowUps: data.suggestedFollowUps || []
      };

      setMessages(prev => [...prev, agentMsg]);
      speakText(agentMsg.text);
    } catch (error) {
      console.error('Error communicating with campus agent:', error);
      const fallbackMsg: AgentChatMessage = {
        id: `agent-error-${Date.now()}`,
        sender: 'agent',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        text: `Here are the key locations on campus. You can click any building directly on the map for routing!`,
        suggestedFollowUps: ['Show Alan Turing CS Building', 'Find Alexandria Library', 'View Student Union Dining']
      };
      setMessages(prev => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleActionCardClick = (card: AgentActionCard) => {
    if (card.type === 'navigate' && card.buildingId) {
      onNavigateToBuilding(card.buildingId, card.roomId);
    } else if (card.type === 'building_info' && card.buildingId) {
      const bldg = buildings.find(b => b.id === card.buildingId);
      if (bldg) onOpenBuildingDetail(bldg);
    } else if (card.type === 'study_recommendation' || card.type === 'dining_recommendation') {
      if (card.buildingId) {
        onNavigateToBuilding(card.buildingId);
      }
    } else if (card.type === 'schedule_plan') {
      onOpenScheduleOptimizer();
    } else if (card.type === 'emergency') {
      onOpenEmergency();
    } else {
      onExecuteActionCard(card);
    }
  };

  return (
    <div id="navigation-agent-chat-panel" className="flex flex-col h-full bg-slate-900/95 backdrop-blur-xl border border-slate-800/90 rounded-2xl shadow-2xl overflow-hidden">
      {/* Agent Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-slate-900 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="relative">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-cyan-500 flex items-center justify-center text-slate-950 font-bold shadow-md shadow-emerald-500/20">
              <Bot className="w-5 h-5 text-slate-950" />
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 border-2 border-slate-900 rounded-full" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h2 className="text-sm font-bold text-slate-100">NaviGenius AI</h2>
              <span className="px-1.5 py-0.5 text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded">GEMINI 3.7</span>
            </div>
            <p className="text-[11px] text-slate-400 flex items-center gap-1">
              <span>Near: {currentLocationNode.name.split(' ')[0]}</span>
            </p>
          </div>
        </div>

        {/* Audio speech output toggle */}
        <button
          id="btn-toggle-voice-output"
          onClick={() => {
            if (isAudioSpeechEnabled) window.speechSynthesis?.cancel();
            setIsAudioSpeechEnabled(!isAudioSpeechEnabled);
          }}
          className={`p-2 rounded-lg text-xs transition-colors ${
            isAudioSpeechEnabled ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-slate-800 text-slate-400 hover:text-slate-200'
          }`}
          title={isAudioSpeechEnabled ? 'Voice Guidance Active' : 'Voice Guidance Muted'}
        >
          {isAudioSpeechEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
        </button>
      </div>

      {/* Messages List Container */}
      <div 
        ref={chatContainerRef} 
        className="flex-1 overflow-y-auto p-4 space-y-4 text-sm scroll-smooth custom-scrollbar"
      >
        {messages.map(msg => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div className="flex items-start gap-2 max-w-[92%]">
              {msg.sender === 'agent' && (
                <div className="w-6 h-6 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-300 flex-shrink-0 mt-0.5">
                  <Sparkles className="w-3.5 h-3.5" />
                </div>
              )}
              <div
                className={`p-3.5 rounded-2xl leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-tr-none shadow-md shadow-emerald-900/20'
                    : 'bg-slate-800/90 text-slate-200 border border-slate-700/80 rounded-tl-none shadow-md'
                }`}
              >
                {/* Text body with simple bold formatting parser */}
                <div className="whitespace-pre-wrap">
                  {msg.text.split('\n').map((line, idx) => (
                    <p key={idx} className={idx > 0 ? 'mt-2' : ''}>
                      {line}
                    </p>
                  ))}
                </div>

                {/* Render Rich Action Card if returned by Gemini */}
                {msg.actionCard && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-3 p-3 bg-slate-900/90 rounded-xl border border-emerald-500/40 shadow-lg"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-300">
                          {msg.actionCard.type === 'navigate' ? <Navigation className="w-4 h-4" /> : <Building2 className="w-4 h-4" />}
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-slate-100">{msg.actionCard.title || 'Location Route'}</h4>
                          {msg.actionCard.subtitle && (
                            <p className="text-[11px] text-emerald-400">{msg.actionCard.subtitle}</p>
                          )}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => msg.actionCard && handleActionCardClick(msg.actionCard)}
                      className="mt-2.5 w-full py-1.5 px-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-xs rounded-lg flex items-center justify-center gap-1.5 transition-all shadow-md active:scale-95"
                    >
                      <span>Plot Route on Map</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </motion.div>
                )}
              </div>
            </div>

            {/* Suggested Follow-Up Chips */}
            {msg.suggestedFollowUps && msg.suggestedFollowUps.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2 ml-8">
                {msg.suggestedFollowUps.map((chip, cIdx) => (
                  <button
                    key={cIdx}
                    onClick={() => handleSendMessage(chip)}
                    className="px-2.5 py-1 text-[11px] font-medium bg-slate-800/80 hover:bg-emerald-900/40 text-slate-300 hover:text-emerald-300 border border-slate-700 hover:border-emerald-500/40 rounded-full transition-all flex items-center gap-1"
                  >
                    <CornerDownRight className="w-2.5 h-2.5 text-emerald-400" />
                    <span>{chip}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}

        {/* Loading Bubble */}
        {isLoading && (
          <div className="flex items-center gap-2 text-slate-400 text-xs py-2">
            <div className="w-6 h-6 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-300">
              <Sparkles className="w-3.5 h-3.5 animate-spin" />
            </div>
            <div className="flex items-center gap-1 bg-slate-800/80 px-3 py-2 rounded-2xl rounded-tl-none border border-slate-700">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce" />
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce [animation-delay:0.2s]" />
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce [animation-delay:0.4s]" />
              <span className="ml-1 text-slate-300">NaviGenius is mapping the campus...</span>
            </div>
          </div>
        )}
      </div>

      {/* Voice Listening Active Banner */}
      {isListening && (
        <div className="px-4 py-2 bg-emerald-950/80 border-t border-emerald-500/40 flex items-center justify-between text-xs text-emerald-300 animate-pulse">
          <div className="flex items-center gap-2">
            <Mic className="w-4 h-4 text-emerald-400 animate-bounce" />
            <span>Listening to your voice... Speak your destination or question</span>
          </div>
          <button onClick={toggleVoiceInput} className="text-slate-400 hover:text-white text-[11px] underline">Cancel</button>
        </div>
      )}

      {/* Quick Category Action Bar */}
      <div className="px-3 py-2 bg-slate-950/60 border-t border-slate-800/70 flex items-center gap-1.5 overflow-x-auto no-scrollbar text-xs">
        <button
          onClick={() => handleSendMessage('Where can I get vegetarian/halal food on campus?')}
          className="px-2.5 py-1 bg-slate-800/60 hover:bg-slate-800 text-slate-300 hover:text-white rounded-lg border border-slate-700/60 whitespace-nowrap flex items-center gap-1 flex-shrink-0"
        >
          <span>🍔 Dining</span>
        </button>
        <button
          onClick={() => handleSendMessage('Find me a quiet study spot with power outlets')}
          className="px-2.5 py-1 bg-slate-800/60 hover:bg-slate-800 text-slate-300 hover:text-white rounded-lg border border-slate-700/60 whitespace-nowrap flex items-center gap-1 flex-shrink-0"
        >
          <span>📚 Study Pods</span>
        </button>
        <button
          onClick={() => handleSendMessage('Where is the campus health center and pharmacy?')}
          className="px-2.5 py-1 bg-slate-800/60 hover:bg-slate-800 text-slate-300 hover:text-white rounded-lg border border-slate-700/60 whitespace-nowrap flex items-center gap-1 flex-shrink-0"
        >
          <span>🏥 Health Clinic</span>
        </button>
        <button
          onClick={() => handleSendMessage('What are the campus shuttle bus routes and arrival times?')}
          className="px-2.5 py-1 bg-slate-800/60 hover:bg-slate-800 text-slate-300 hover:text-white rounded-lg border border-slate-700/60 whitespace-nowrap flex items-center gap-1 flex-shrink-0"
        >
          <span>🚌 Shuttles</span>
        </button>
      </div>

      {/* Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="p-3 bg-slate-900 border-t border-slate-800 flex items-center gap-2"
      >
        <button
          type="button"
          id="btn-voice-input"
          onClick={toggleVoiceInput}
          className={`p-2.5 rounded-xl border transition-all ${
            isListening
              ? 'bg-rose-500 text-white border-rose-400 shadow-lg shadow-rose-500/30 animate-pulse'
              : 'bg-slate-800 text-slate-300 hover:text-emerald-300 hover:bg-slate-700 border-slate-700'
          }`}
          title="Voice Search"
        >
          {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
        </button>

        <input
          type="text"
          id="agent-chat-input"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Ask NaviGenius for directions, rooms, or amenities..."
          className="flex-1 bg-slate-950 text-slate-100 placeholder-slate-500 text-sm px-4 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
          disabled={isLoading}
        />

        <button
          type="submit"
          id="btn-send-message"
          disabled={isLoading || !inputText.trim()}
          className="p-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 disabled:opacity-40 disabled:pointer-events-none text-slate-950 font-bold rounded-xl transition-all shadow-md shadow-emerald-500/20 active:scale-95"
          title="Send query"
        >
          <Send className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
};
