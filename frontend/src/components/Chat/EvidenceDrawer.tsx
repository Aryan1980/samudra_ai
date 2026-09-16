import { X, ShieldCheck, Cpu, Database, Activity, CheckCircle2 } from 'lucide-react';
import { EvidenceDetails, AgentTrace } from '../../types/marine';

interface EvidenceDrawerProps {
  evidence: EvidenceDetails | null;
  traces?: AgentTrace[];
  onClose: () => void;
}

export const EvidenceDrawer = ({ evidence, traces, onClose }: EvidenceDrawerProps) => {
  if (!evidence) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 select-none">
      <div className="bg-[#FFF570] border-2 border-black max-w-2xl w-full max-h-[85vh] flex flex-col shadow-[8px_8px_0px_0px_#000000] overflow-hidden font-mono text-xs">
        
        {/* Header */}
        <div className="px-5 py-3 border-b-2 border-black flex items-center justify-between bg-black text-[#FFF570]">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#FFF570]" />
            <div>
              <h3 className="text-sm font-bold uppercase">PHYSICAL EVIDENCE & REASONING TRACE</h3>
              <p className="text-[10px] text-[#FFF570]/70">DETERMINISTIC VERIFICATION SPECIFICATION</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="border border-[#FFF570] px-2 py-0.5 text-xs font-bold hover:bg-[#FFF570] hover:text-black transition-colors cursor-pointer"
          >
            [X] CLOSE
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-4">
          
          {/* 1. Multi-Agent Reasoning Flow */}
          <div className="border-2 border-black bg-white/80 p-3.5 space-y-2">
            <div className="flex items-center gap-1.5 text-black font-bold uppercase border-b border-black/30 pb-1">
              <Cpu className="w-3.5 h-3.5 text-black" />
              <span>AGENTIC EXECUTION GRAPH</span>
            </div>
            <div className="space-y-1.5">
              {evidence.agent_reasoning_flow.map((step, idx) => (
                <div key={idx} className="flex items-start gap-2 text-black">
                  <CheckCircle2 className="w-3.5 h-3.5 text-black mt-0.5 flex-shrink-0" />
                  <span className="text-[11px] font-sans">{step}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 2. Deterministic Risk Engine Matrix */}
          <div className="border-2 border-black bg-white/80 p-3.5 space-y-2">
            <div className="flex items-center justify-between border-b border-black/30 pb-1">
              <div className="flex items-center gap-1.5 text-black font-bold uppercase">
                <Activity className="w-3.5 h-3.5 text-black" />
                <span>PHYSICAL SAFETY ENGINE LIMITS</span>
              </div>
              <span className="text-[9px] bg-black text-[#FFF570] px-1.5 py-0.5 font-bold">
                SCORE: {evidence.deterministic_score}/100
              </span>
            </div>
            <div className="space-y-1">
              {Object.entries(evidence.risk_factors || {}).map(([key, val], idx) => (
                <div key={idx} className="text-[11px] text-black font-mono border-l-2 border-black pl-2">
                  <strong>{key.toUpperCase()}:</strong> {typeof val === 'object' ? JSON.stringify(val) : String(val)}
                </div>
              ))}
            </div>
          </div>

          {/* 3. Live Datasets Ingested */}
          <div className="border-2 border-black bg-white/80 p-3.5 space-y-2">
            <div className="flex items-center gap-1.5 text-black font-bold uppercase border-b border-black/30 pb-1">
              <Database className="w-3.5 h-3.5 text-black" />
              <span>ACTIVE DATASETS INGESTED</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[10px]">
              {evidence.datasets_used.map((ds, idx) => (
                <div key={idx} className="border border-black/40 p-1.5 bg-black/5 flex justify-between">
                  <span className="font-bold">{ds}</span>
                  <span className="text-black/60">SYNCHRONIZED</span>
                </div>
              ))}
            </div>
          </div>

          {/* 4. Agent Execution Traces (if present) */}
          {traces && traces.length > 0 && (
            <div className="border-2 border-black bg-white/80 p-3.5 space-y-2">
              <div className="font-bold uppercase text-black border-b border-black/30 pb-1">
                EXECUTION SUBTASK LATENCY
              </div>
              <div className="space-y-1 font-mono text-[10px]">
                {traces.map((t, idx) => (
                  <div key={idx} className="flex justify-between items-center border-b border-black/10 pb-0.5">
                    <span className="font-semibold">{t.agent_name}</span>
                    <span className="font-bold">{t.execution_time_ms}ms</span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
