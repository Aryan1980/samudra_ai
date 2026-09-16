import React from 'react';
import { X, ShieldCheck, Cpu, Database, Clock, Activity, CheckCircle2 } from 'lucide-react';
import { EvidenceDetails, AgentTrace } from '../../types/marine';

interface EvidenceDrawerProps {
  evidence: EvidenceDetails | null;
  traces?: AgentTrace[];
  onClose: () => void;
}

export const EvidenceDrawer: React.FC<EvidenceDrawerProps> = ({ evidence, traces, onClose }) => {
  if (!evidence) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-cyan-800/80 rounded-2xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-cyan-950 border border-cyan-700/60 flex items-center justify-center text-cyan-400">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-100">Transparent Evidence & Reasoning</h3>
              <p className="text-[10px] text-slate-400">Why am I seeing this recommendation?</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs">
          
          {/* 1. Multi-Agent Reasoning Flow */}
          <div className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800">
            <div className="flex items-center gap-1.5 text-cyan-400 font-semibold mb-2">
              <Cpu className="w-3.5 h-3.5" />
              <span>Multi-Agent Execution Chain</span>
            </div>
            <div className="space-y-1.5">
              {evidence.agent_reasoning_flow.map((step, idx) => (
                <div key={idx} className="flex items-start gap-2 text-slate-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-500 mt-0.5 flex-shrink-0" />
                  <span className="text-[11px]">{step}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 2. Deterministic Risk Engine Matrix */}
          <div className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5 text-cyan-400 font-semibold">
                <Activity className="w-3.5 h-3.5" />
                <span>Deterministic Mathematical Risk Calculation</span>
              </div>
              <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 font-mono text-[11px]">
                Score: {evidence.deterministic_score} / 100
              </span>
            </div>
            <p className="text-[10px] text-slate-400 mb-3">
              Per ISRO maritime safety guidelines, scores are computed deterministically via physical threshold penalties rather than LLM invention.
            </p>
            <div className="space-y-2">
              {Object.entries(evidence.risk_factors || {}).map(([fname, f]: [string, any]) => (
                <div key={fname} className="bg-slate-900/80 p-2 rounded-lg border border-slate-800/80">
                  <div className="flex justify-between items-center text-[11px] mb-1">
                    <span className="font-medium text-slate-200">{fname}</span>
                    <span className={`px-1.5 py-0.2 rounded font-mono text-[10px] ${
                      f.severity === 'LOW' ? 'bg-emerald-950 text-emerald-400' :
                      f.severity === 'MODERATE' ? 'bg-amber-950 text-amber-400' :
                      'bg-rose-950 text-rose-400'
                    }`}>
                      {f.severity} (Weight Contrib: +{f.weighted_contribution})
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-400 flex justify-between">
                    <span>Observed Value: <strong className="text-slate-300">{f.raw_value}</strong></span>
                    <span>Penalty Index: {f.score}/100</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 3. Data Provenance & Satellites */}
          <div className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800">
            <div className="flex items-center gap-1.5 text-cyan-400 font-semibold mb-2">
              <Database className="w-3.5 h-3.5" />
              <span>Data Provenance & Observation Timestamps</span>
            </div>
            <div className="space-y-1.5 text-[11px] text-slate-300">
              {evidence.datasets_used.map((ds, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                  <span>{ds}</span>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-slate-800/80 text-[10px]">
              <div>
                <span className="text-slate-500">Observation Type:</span>
                <p className="text-slate-300 font-medium">{evidence.observed_vs_forecast}</p>
              </div>
              <div>
                <span className="text-slate-500">Provider Status:</span>
                <p className="text-amber-400 font-medium">{evidence.demo_vs_live}</p>
              </div>
            </div>
          </div>

          {/* 4. Active Agent Telemetry */}
          {traces && traces.length > 0 && (
            <div className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800">
              <div className="flex items-center gap-1.5 text-cyan-400 font-semibold mb-2">
                <Clock className="w-3.5 h-3.5" />
                <span>Agent Execution Latencies</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {traces.map((t, idx) => (
                  <div key={idx} className="p-1.5 rounded bg-slate-900 border border-slate-800 flex justify-between items-center text-[10px]">
                    <span className="text-slate-300 truncate max-w-[170px]">{t.agent_name}</span>
                    <span className="text-cyan-400 font-mono">{t.execution_time_ms} ms</span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-slate-800 bg-slate-950/80 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white font-medium rounded-lg text-xs shadow-md shadow-cyan-900/30"
          >
            Close Audit Trail
          </button>
        </div>

      </div>
    </div>
  );
};
