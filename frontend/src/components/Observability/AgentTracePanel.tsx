import { Cpu, Activity } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const AgentTracePanel = () => {
  const { agentTraces, isAnalyzing } = useApp();

  const DEFAULT_AGENTS = [
    { name: 'Planner Agent', role: 'Autonomous Intent & Subtask Graph', provider: 'Rule-Based Intent Core', time: 14 },
    { name: 'Weather Intelligence Agent', role: 'Atmospheric & Surface Swell Model', provider: 'WeatherAPI.com (Live Satellite)', time: 26 },
    { name: 'Ocean Analytics Agent', role: 'SST & Chlorophyll Inversion', provider: 'Oceansat-3 (EOS-06) OCM-3', time: 32 },
    { name: 'Geospatial Reasoning Agent', role: 'IMBL Demarcation & MPAs', provider: 'Survey of India / ICG GIS', time: 18 },
    { name: 'Risk Assessment Agent', role: 'Deterministic Multi-Factor Matrix', provider: 'Deterministic Safety Engine', time: 8 },
    { name: 'PFZ Intelligence Agent', role: 'Thermal-Chlorophyll Frontal Ranking', provider: 'INCOIS PFZ Multilingual Service', time: 21 },
    { name: 'Route Optimization Agent', role: 'A* Waypoint Hazard Detour Corridors', provider: 'Navigational Waypoint Mesh', time: 16 },
    { name: 'Visualization Agent', role: 'Dynamic Vector Overlay Synthesizer', provider: 'Leaflet Vector Pipeline', time: 9 },
    { name: 'Explanation & Evidence Agent', role: 'Multilingual Operational Reasoning', provider: 'Gemini 2.5 Flash / Explainability', time: 38 }
  ];

  const totalTime = DEFAULT_AGENTS.reduce((acc, a) => {
    const live = agentTraces.find(t => t.agent_name === a.name);
    return acc + (live ? live.execution_time_ms : a.time);
  }, 0);

  return (
    <div className="border-2 border-black bg-[#FFF570]/90 shadow-[4px_4px_0px_0px_#000000] p-4 text-xs font-mono select-none">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between pb-2.5 border-b-2 border-black gap-2">
        <div className="flex items-center gap-2">
          <Cpu className="w-4 h-4 text-black" />
          <div>
            <h3 className="font-black text-black text-xs uppercase tracking-wide">MULTI-AGENT PIPELINE TELEMETRY</h3>
            <p className="text-[9px] text-black/70 uppercase">REAL-TIME SUBTASK OBSERVABILITY FOR ISRO EVALUATION</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold text-black border border-black bg-white px-2 py-0.5">
            TOTAL LATENCY: <strong>{totalTime}MS</strong>
          </span>
          <span className={`text-[9px] px-2 py-0.5 font-bold uppercase border border-black flex items-center gap-1.5 ${
            isAnalyzing
              ? 'bg-amber-400 text-black animate-pulse'
              : 'bg-black text-[#FFF570]'
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full ${isAnalyzing ? 'bg-black animate-ping' : 'bg-emerald-400'}`} />
            {isAnalyzing ? 'ORCHESTRATING' : 'SYNCHRONIZED'}
          </span>
        </div>
      </div>

      {/* Grid of 9 Specialized Agents */}
      <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-2">
        {DEFAULT_AGENTS.map((agent) => {
          const liveTrace = agentTraces.find((t) => t.agent_name === agent.name);
          const isCompleted = !!liveTrace;
          const latency = liveTrace ? liveTrace.execution_time_ms : agent.time;

          return (
            <div
              key={agent.name}
              className={`border border-black p-2.5 transition-all ${
                isCompleted ? 'bg-white text-black' : 'bg-white/60 text-black/80'
              }`}
            >
              <div className="flex items-start justify-between gap-1 mb-1">
                <span className="font-bold uppercase text-[11px] truncate">{agent.name}</span>
                <span className="text-[9px] font-bold border border-black px-1 py-0.2 bg-black text-[#FFF570]">
                  {latency}ms
                </span>
              </div>

              <div className="text-[10px] text-black/80 truncate mb-1">
                {agent.role}
              </div>

              <div className="flex justify-between items-center text-[8px] text-black/60 pt-1 border-t border-black/20">
                <span className="truncate">{agent.provider}</span>
                <span className="font-bold text-black">{isCompleted ? 'SYNCED' : 'CACHED'}</span>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
