import { Cpu, Activity, ArrowDown } from 'lucide-react';

export const ArchitectureView = () => {
  return (
    <div className="max-w-5xl mx-auto p-4 space-y-6 text-black font-mono">
      
      {/* Title */}
      <div className="border-b-2 border-black pb-4 text-center space-y-2">
        <span className="px-2 py-0.5 text-[10px] font-bold bg-black text-[#FFF570] uppercase">
          ISRO ARCHITECTURE SPECIFICATION // ORCA MULTI-AGENT BLUEPRINT
        </span>
        <h2 className="text-4xl sm:text-6xl font-black font-bebas text-black uppercase tracking-tight">
          END-TO-END AGENTIC AI ARCHITECTURE
        </h2>
        <p className="text-xs text-black/80 max-w-2xl mx-auto font-sans">
          SamudraAI employs an autonomous multi-agent planner, concurrent dataset fusion, spatial reasoning, and a strictly deterministic physical risk engine ensuring zero hallucination.
        </p>
      </div>

      {/* Architecture Flow Diagram */}
      <div className="border-2 border-black bg-[#FFF570]/90 p-6 shadow-[6px_6px_0px_0px_#000] space-y-6">
        <div className="flex items-center justify-between border-b-2 border-black pb-2">
          <h3 className="text-xs font-black uppercase text-black flex items-center gap-2">
            <Activity className="w-4 h-4 text-black" />
            <span>EXECUTION PIPELINE SPECIFICATION</span>
          </h3>
          <span className="text-[9px] bg-black text-[#FFF570] px-2 py-0.5 font-bold">
            TIER 01 - 05
          </span>
        </div>

        {/* Step 1: Ingestion */}
        <div className="p-4 border-2 border-black bg-white flex items-start gap-4">
          <div className="w-10 h-10 border-2 border-black bg-black text-[#FFF570] flex items-center justify-center font-bebas text-2xl font-bold flex-shrink-0">
            01
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h4 className="font-bold text-xs text-black uppercase">MULTIMODAL INTENT INGESTION</h4>
              <span className="text-[9px] px-1.5 py-0.2 bg-black text-[#FFF570] font-bold">10 INDIAN LANGUAGES</span>
            </div>
            <p className="text-[11px] font-sans text-black/90">
              User speaks or types in Hindi, Tamil, Telugu, Malayalam, Bengali, etc. The browser Web Speech API converts speech to text, while the Planner Agent automatically identifies the script and preserves physical SI units (km/h, m, °C).
            </p>
          </div>
        </div>

        <div className="flex justify-center text-black"><ArrowDown className="w-6 h-6 stroke-[3]" /></div>

        {/* Step 2: Planner Agent */}
        <div className="p-4 border-2 border-black bg-white flex items-start gap-4">
          <div className="w-10 h-10 border-2 border-black bg-black text-[#FFF570] flex items-center justify-center font-bebas text-2xl font-bold flex-shrink-0">
            02
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h4 className="font-bold text-xs text-black uppercase">AUTONOMOUS PLANNER AGENT</h4>
              <span className="text-[9px] px-1.5 py-0.2 bg-black text-[#FFF570] font-bold">SUBTASK GRAPH DISPATCH</span>
            </div>
            <p className="text-[11px] font-sans text-black/90">
              Classifies queries (e.g. PFZ discovery, safety forecast, safe routing, boundary proximity) and decomposes them into concurrent subtasks. Only relevant specialized agents are dispatched.
            </p>
          </div>
        </div>

        <div className="flex justify-center text-black"><ArrowDown className="w-6 h-6 stroke-[3]" /></div>

        {/* Step 3: Concurrent Multi-Agent Execution */}
        <div className="p-4 border-2 border-black bg-white">
          <div className="flex items-center gap-4 mb-3">
            <div className="w-10 h-10 border-2 border-black bg-black text-[#FFF570] flex items-center justify-center font-bebas text-2xl font-bold flex-shrink-0">
              03
            </div>
            <div>
              <h4 className="font-bold text-xs text-black uppercase">SPECIALIZED MULTI-AGENT EXECUTION LAYER</h4>
              <p className="text-[10px] text-black/70">EXECUTED CONCURRENTLY VIA ASYNCIO PROVIDER ABSTRACTION</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 font-mono text-[10px]">
            <div className="border border-black p-2 bg-[#FFF570]/30">
              <strong className="text-black uppercase block font-bold mb-0.5">Weather Agent</strong>
              <span className="text-black/80">Wind speed, swell period, squalls, IMD cyclone tracking</span>
            </div>
            <div className="border border-black p-2 bg-[#FFF570]/30">
              <strong className="text-black uppercase block font-bold mb-0.5">Ocean Analytics</strong>
              <span className="text-black/80">SST thermal fronts, Chlorophyll-a plumes, tidal curves</span>
            </div>
            <div className="border border-black p-2 bg-[#FFF570]/30">
              <strong className="text-black uppercase block font-bold mb-0.5">GIS Reasoning</strong>
              <span className="text-black/80">IMBL cross-track distance, Ray-casting for MPAs</span>
            </div>
            <div className="border border-black p-2 bg-[#FFF570]/30">
              <strong className="text-black uppercase block font-bold mb-0.5">PFZ Intelligence</strong>
              <span className="text-black/80">Multi-criteria ranking (distance, suitability, safety)</span>
            </div>
            <div className="border border-black p-2 bg-[#FFF570]/30">
              <strong className="text-black uppercase block font-bold mb-0.5">Route Optimizer</strong>
              <span className="text-black/80">Shortest path vs hazard-avoiding nautical corridors</span>
            </div>
            <div className="border border-black p-2 bg-[#FFF570]/30">
              <strong className="text-black uppercase block font-bold mb-0.5">Marine Alert</strong>
              <span className="text-black/80">Multi-tier threshold warnings (Extreme, High, Moderate)</span>
            </div>
          </div>
        </div>

        <div className="flex justify-center text-black"><ArrowDown className="w-6 h-6 stroke-[3]" /></div>

        {/* Step 4: Deterministic Risk Engine */}
        <div className="p-4 border-2 border-black bg-white flex items-start gap-4">
          <div className="w-10 h-10 border-2 border-black bg-black text-[#FFF570] flex items-center justify-center font-bebas text-2xl font-bold flex-shrink-0">
            04
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h4 className="font-bold text-xs text-black uppercase">DETERMINISTIC PHYSICAL RISK ENGINE</h4>
              <span className="text-[9px] px-1.5 py-0.2 bg-black text-[#FFF570] font-bold">ZERO HALLUCINATION GUARANTEE</span>
            </div>
            <p className="text-[11px] font-sans text-black/90">
              Critical Requirement: LLMs do <strong>not</strong> invent safety scores. The safety verdict is calculated using a transparent weighted physical formula:
            </p>
            <div className="mt-2 p-2 border border-black bg-black text-[#FFF570] font-mono text-[11px]">
              Risk = 0.20·Wind + 0.25·Wave + 0.15·Lightning + 0.25·Cyclone + 0.10·Geofence + 0.05·Tide
            </div>
          </div>
        </div>

        <div className="flex justify-center text-black"><ArrowDown className="w-6 h-6 stroke-[3]" /></div>

        {/* Step 5: Explainable Synthesis */}
        <div className="p-4 border-2 border-black bg-white flex items-start gap-4">
          <div className="w-10 h-10 border-2 border-black bg-black text-[#FFF570] flex items-center justify-center font-bebas text-2xl font-bold flex-shrink-0">
            05
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h4 className="font-bold text-xs text-black uppercase">EXPLAINABLE EVIDENCE & VISUAL ORCHESTRATION</h4>
              <span className="text-[9px] px-1.5 py-0.2 bg-black text-[#FFF570] font-bold">AUDIT TRAIL</span>
            </div>
            <p className="text-[11px] font-sans text-black/90">
              The Explanation Agent synthesizes localized recommendations in the user's native tongue, triggers map layer overlays, and generates an audit drawer with satellite timestamps, observed vs forecast distinction, and source attribution.
            </p>
          </div>
        </div>

      </div>

    </div>
  );
};
