import { useState, useRef, useEffect, type FormEvent } from 'react';
import {
  Send,
  Mic,
  MicOff,
  Bot,
  User,
  Shield,
  Activity
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { DemoQueries } from './DemoQueries';
import { EvidenceDrawer } from './EvidenceDrawer';
import { voiceService } from '../../services/voice';
import { EvidenceDetails, AgentTrace } from '../../types/marine';

export const ChatPanel = () => {
  const {
    chatMessages,
    isAnalyzing,
    language,
    sendQuery
  } = useApp();

  const [inputQuery, setInputQuery] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [activeEvidence, setActiveEvidence] = useState<EvidenceDetails | null>(null);
  const [activeTraces, setActiveTraces] = useState<AgentTrace[] | undefined>(undefined);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isAnalyzing]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!inputQuery.trim() || isAnalyzing) return;
    const q = inputQuery;
    setInputQuery('');
    sendQuery(q);
  };

  const toggleVoiceInput = () => {
    if (isListening) {
      voiceService.stopListening();
      setIsListening(false);
    } else {
      setIsListening(true);
      voiceService.startListening(
        language,
        (transcript) => {
          setInputQuery(transcript);
          setIsListening(false);
          sendQuery(transcript);
        },
        (err) => {
          console.warn('Voice error:', err);
          setIsListening(false);
        },
        () => {
          setIsListening(false);
        }
      );
    }
  };

  return (
    <div className="flex flex-col h-full border-2 border-black bg-[#FFF570]/90 shadow-[4px_4px_0px_0px_#000000] overflow-hidden font-mono text-xs">
      
      {/* 1. Interactive Demo Scenarios Ribbon */}
      <DemoQueries />

      {/* 2. Messages Stream */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {chatMessages.map((msg) => {
          const isUser = msg.role === 'user';
          return (
            <div
              key={msg.id}
              className={`flex items-start gap-2.5 ${isUser ? 'flex-row-reverse' : ''}`}
            >
              {/* Avatar Stamp */}
              <div
                className={`w-7 h-7 border-2 border-black flex items-center justify-center flex-shrink-0 font-bold ${
                  isUser
                    ? 'bg-black text-[#FFF570]'
                    : 'bg-white text-black'
                }`}
              >
                {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              {/* Message Bubble */}
              <div
                className={`max-w-[88%] border-2 border-black p-3 shadow-[2px_2px_0px_0px_#000] ${
                  isUser
                    ? 'bg-black text-[#FFF570]'
                    : 'bg-white text-black'
                }`}
              >
                {/* Safety verdict header for assistant */}
                {!isUser && msg.safety_verdict && (
                  <div className="mb-2 flex items-center justify-between gap-2 pb-1.5 border-b border-black">
                    <span className="inline-flex items-center gap-1 font-bold text-[9px] px-1.5 py-0.5 uppercase tracking-wider bg-black text-[#FFF570]">
                      <Shield className="w-3 h-3 text-[#FFF570]" />
                      {msg.safety_verdict.replace(/_/g, ' ')}
                    </span>
                    <span className="text-[9px] text-black/60">{msg.timestamp}</span>
                  </div>
                )}

                {/* Message Content */}
                <div className="whitespace-pre-line leading-relaxed text-[11px] font-sans text-current">
                  {msg.content}
                </div>

                {/* Attached Actions: Evidence Drawer Button */}
                {!isUser && (
                  <div className="mt-2.5 pt-2 border-t border-black/30 flex flex-wrap items-center justify-between gap-2">
                    {msg.evidence ? (
                      <button
                        onClick={() => {
                          setActiveEvidence(msg.evidence || null);
                          setActiveTraces(msg.traces);
                        }}
                        className="flex items-center gap-1 text-[9px] font-bold uppercase border border-black px-2 py-0.5 bg-black/5 hover:bg-black hover:text-[#FFF570] transition-colors cursor-pointer"
                      >
                        [+] INSPECT EVIDENCE & TRACES
                      </button>
                    ) : (
                      <span className="text-[9px] text-black/50">DETERMINISTIC VERIFIED</span>
                    )}

                    {msg.evidence?.intent_detected && (
                      <span className="text-[8px] uppercase border border-black/40 px-1 py-0.2 text-black/70">
                        {msg.evidence.intent_detected}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* Loading Indicator */}
        {isAnalyzing && (
          <div className="flex items-center gap-2 p-3 border-2 border-black bg-white text-black animate-pulse">
            <Activity className="w-4 h-4 text-black animate-spin" />
            <span className="font-bold text-[10px] tracking-wider uppercase">
              ORCHESTRATING MULTI-AGENT SWARM INGESTION...
            </span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* 3. Input Formulation Strip */}
      <form onSubmit={handleSubmit} className="border-t-2 border-black p-2.5 bg-[#FFF570] flex items-center gap-2">
        <input
          type="text"
          value={inputQuery}
          onChange={(e) => setInputQuery(e.target.value)}
          placeholder="DISPATCH QUERY OR ASK HARBOR COORDINATOR..."
          disabled={isAnalyzing}
          className="flex-1 border-2 border-black px-3 py-2 bg-white text-black font-mono text-xs outline-none focus:ring-1 focus:ring-black placeholder:text-black/50 font-semibold"
        />

        {/* Voice Input Button */}
        <button
          type="button"
          onClick={toggleVoiceInput}
          title={isListening ? 'Stop listening' : 'Start voice input'}
          className={`border-2 border-black p-2 cursor-pointer transition-colors ${
            isListening
              ? 'bg-rose-500 text-white animate-bounce'
              : 'bg-white text-black hover:bg-black hover:text-[#FFF570]'
          }`}
        >
          {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
        </button>

        {/* Send Button */}
        <button
          type="submit"
          disabled={isAnalyzing || !inputQuery.trim()}
          className="border-2 border-black p-2 bg-black text-[#FFF570] hover:bg-transparent hover:text-black transition-colors disabled:opacity-40 cursor-pointer"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>

      {/* Evidence Drawer Modal */}
      {activeEvidence && (
        <EvidenceDrawer
          evidence={activeEvidence}
          traces={activeTraces}
          onClose={() => {
            setActiveEvidence(null);
            setActiveTraces(undefined);
          }}
        />
      )}

    </div>
  );
};
