import React from 'react';
import { Cpu, CheckCircle2, Database } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const AgentTracePanel: React.FC = () => {
  const { agentTraces, isAnalyzing } = useApp();

  const DEFAULT_AGENTS = [
    { name: 'Planner Agent', role: 'Autonomous Intent & Subtask Graph', provider: 'Autonomous LLM / Rules', time: 14 },
    { name: 'Weather Intelligence Agent', role: 'Atmospheric & Surface Swell Model', provider: 'WeatherAPI.com (Live Feed)', time: 26 },
    { name: 'Ocean Analytics Agent', role: 'SST & Chlorophyll Inversion', provider: 'Oceansat-3 (EOS-06) OCM-3', time: 32 },
    { name: 'Geospatial Reasoning Agent', role: 'IMBL Demarcation & MPAs', provider: 'Maritime Geofence GIS', time: 18 },
    { name: 'Risk Assessment Agent', role: 'Deterministic Multi-Factor Matrix', provider: 'Deterministic Safety Engine', time: 8 },
    { name: 'PFZ Intelligence Agent', role: 'Thermal-Chlorophyll Frontal Ranking', provider: 'INCOIS PFZ Service', time: 21 },
    { name: 'Route Optimization Agent', role: 'Waypoint Hazard Detour Corridors', provider: 'A* Waypoint Router', time: 16 },
    { name: 'Visualization Agent', role: 'Dynamic Vector Overlay Synthesizer', provider: 'Leaflet Vector Pipeline', time: 9 },
    { name: 'Explanation & Evidence Agent', role: 'Multilingual Operational Reasoning', provider: 'Gemini 3.6 Flash / Local Engine', time: 38 }
  ];

  const totalTime = DEFAULT_AGENTS.reduce((acc, a) => {
    const live = agentTraces.find(t => t.agent_name === a.name);
    return acc + (live ? live.execution_time_ms : a.time);
  }, 0);

  return (
    <div className="bg-[#090d16] border border-white/[0.07] rounded-2xl p-4 text-xs">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between pb-3 border-b border-white/[0.06] gap-2">
        <div className="flex items-center gap-2">
          <Cpu className="w-4 h-4 text-cyan-400" />
          <div>
            <h3 className="font-semibold text-white text-xs">Agent Execution Telemetry</h3>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono text-slate-400 bg-white/[0.04] px-2 py-0.5 rounded border border-white/[0.06]">
            Total Pipeline: <strong>{totalTime}ms</strong>
          </span>
          <span className={`text-[10px] px-2 py-0.5 rounded font-mono font-medium flex items-center gap-1.5 ${
            isAnalyzing
              ? 'text-amber-300 bg-amber-500/10'
              : 'text-emerald-400 bg-emerald-500/10'
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full ${isAnalyzing ? 'bg-amber-400 animate-ping' : 'bg-emerald-400'}`} />
            {isAnalyzing ? 'Active' : 'Ready'}
          </span>
        </div>
      </div>

      {/* Grid of 9 Specialized Agents */}
      <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-2">
        {DEFAULT_AGENTS.map((agent) => {
          const liveTrace = agentTraces.find((t) => t.agent_name === agent.name);
          const latency = liveTrace ? liveTrace.execution_time_ms : agent.time;
          const source = liveTrace ? liveTrace.data_source : agent.provider;

          return (
            <div
              key={agent.name}
              className="p-2.5 rounded-xl border border-white/[0.05] bg-white/[0.01] hover:border-white/[0.1] transition-colors"
            >
              <div className="flex items-center justify-between gap-1 mb-1">
                <span className="font-medium text-slate-200 truncate text-xs">{agent.name}</span>
                <span className="flex items-center gap-1 text-[10px] font-mono text-slate-400">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400/80" />
                  <span>{latency}ms</span>
                </span>
              </div>

              <div className="text-[10px] text-slate-400 leading-tight mb-1.5 truncate">
                {agent.role}
              </div>

              <div className="text-[9px] font-mono text-slate-500 flex items-center gap-1 truncate">
                <Database className="w-2.5 h-2.5 text-cyan-400/60 flex-shrink-0" />
                <span className="truncate">{source}</span>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
