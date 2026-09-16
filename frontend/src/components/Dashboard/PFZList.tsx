import React, { useState } from 'react';
import { Fish, Navigation, ArrowUpRight, Compass, ShieldCheck, AlertTriangle, Waves, Loader2, Sparkles } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const PFZList: React.FC = () => {
  const { pfzs, openRouteForPFZ, isAnalyzing, selectedPFZForRoute } = useApp();
  const [sortBy, setSortBy] = useState<'distance' | 'suitability' | 'safety'>('distance');

  const sortedPfzs = [...pfzs].sort((a, b) => {
    if (sortBy === 'distance') return a.distance_km - b.distance_km;
    if (sortBy === 'suitability') return b.suitability_score - a.suitability_score;
    const rank: Record<string, number> = { SAFE: 1, CAUTION: 2, AVOID: 3 };
    return (rank[a.safety_rating] || 9) - (rank[b.safety_rating] || 9);
  });

  const safeCount = pfzs.filter((p) => p.safety_rating === 'SAFE').length;
  const cautionCount = pfzs.filter((p) => p.safety_rating === 'CAUTION').length;
  const avoidCount = pfzs.filter((p) => p.safety_rating === 'AVOID').length;

  return (
    <div className="bg-[#080d19] border border-white/[0.08] rounded-2xl p-3.5 flex flex-col h-full text-xs shadow-xl">
      
      {/* ── Header & Summary Banner (Inspired by Image 4 Orders Header) ── */}
      <div className="pb-3 border-b border-white/[0.07] space-y-2">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.2)]">
              <Fish className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-white tracking-tight flex items-center gap-1.5">
                <span>Identified Fishing Zones</span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  {pfzs.length} Active
                </span>
              </h3>
              <span className="text-[10px] text-slate-400 font-mono">
                Real-time thermal fronts in open ocean
              </span>
            </div>
          </div>

          {/* Sort selector */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-[#0b1222] border border-white/10 rounded-lg px-2.5 py-1 text-[11px] text-slate-200 outline-none cursor-pointer hover:border-cyan-500/40 transition-colors font-medium"
          >
            <option value="distance">Nearest Transit</option>
            <option value="suitability">Highest Feasibility</option>
            <option value="safety">Safest Conditions</option>
          </select>
        </div>

        {/* Status Distribution Pills (Inspired by Image 4 status overview) */}
        <div className="flex items-center gap-1.5 pt-1">
          <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded-md bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            {safeCount} Safe
          </span>
          <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded-md bg-amber-500/15 text-amber-300 border border-amber-500/30 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
            {cautionCount} Caution
          </span>
          <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded-md bg-rose-500/15 text-rose-300 border border-rose-500/30 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-400"></span>
            {avoidCount} Avoid
          </span>
        </div>
      </div>

      {/* ── PFZ Card List (Inspired by Image 3 & Image 4 Cards) ── */}
      <div className="mt-3 space-y-2.5 overflow-y-auto flex-1 pr-1 max-h-[520px]">
        {sortedPfzs.length === 0 ? (
          <div className="p-8 text-center text-slate-500 flex flex-col items-center gap-2">
            <Waves className="w-6 h-6 text-slate-600 animate-pulse" />
            <span className="text-xs text-slate-400">Scanning satellite thermal data...</span>
            <p className="text-[11px] text-slate-500 max-w-xs">
              Calculating thermal fronts and chlorophyll gradients off the active port.
            </p>
          </div>
        ) : (
          sortedPfzs.map((pfz, idx) => {
            const isSelected = selectedPFZForRoute?.id === pfz.id;
            const isSafe = pfz.safety_rating === 'SAFE';
            const isCaution = pfz.safety_rating === 'CAUTION';

            // Circular progress calculations for score ring
            const circumference = 2 * Math.PI * 14;
            const strokeDashoffset = circumference - (pfz.suitability_score / 100) * circumference;

            return (
              <div
                key={pfz.id}
                className={`border rounded-xl p-3 transition-all ${
                  isSelected
                    ? 'bg-cyan-950/40 border-cyan-500/60 shadow-[0_0_20px_rgba(6,182,212,0.15)] ring-1 ring-cyan-500/30'
                    : 'bg-[#0b1222]/80 hover:bg-[#0f172a] border-white/[0.07] hover:border-white/15 shadow-sm'
                }`}
              >
                {/* Top Row: Rank, Title, Bearing & Safety Status Badge */}
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-start gap-2.5">
                    {/* Rank Avatar */}
                    <span className="w-6 h-6 rounded-lg bg-white/10 text-cyan-300 font-mono font-bold text-[11px] flex items-center justify-center flex-shrink-0 mt-0.5 border border-white/10">
                      #{idx + 1}
                    </span>
                    <div>
                      <h4 className="font-semibold text-white text-xs tracking-tight">
                        {pfz.name}
                      </h4>
                      <div className="text-[10px] text-slate-400 font-mono mt-0.5 flex items-center gap-2">
                        <span className="text-cyan-300 font-semibold">{pfz.distance_km} km</span>
                        <span>·</span>
                        <span className="flex items-center gap-1">
                          <Compass className="w-2.5 h-2.5 text-cyan-400" />
                          {pfz.bearing_compass} ({pfz.bearing_deg}°)
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Safety Status Pill (Inspired by Image 4) */}
                  <span
                    className={`px-2 py-0.5 rounded-full text-[9px] font-mono font-bold uppercase tracking-wider flex items-center gap-1 ${
                      isSafe
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        : isCaution
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                        : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                    }`}
                  >
                    {isSafe ? (
                      <ShieldCheck className="w-2.5 h-2.5" />
                    ) : (
                      <AlertTriangle className="w-2.5 h-2.5" />
                    )}
                    {pfz.safety_rating}
                  </span>
                </div>

                {/* Middle Row: Circular Suitability Score (Inspired by Image 2) + Metric Tags */}
                <div className="flex items-center justify-between gap-3 bg-black/40 p-2 rounded-xl mb-2 border border-white/5">
                  
                  {/* Circular Score Gauge */}
                  <div className="flex items-center gap-2.5 pl-1">
                    <div className="relative w-9 h-9 flex items-center justify-center flex-shrink-0">
                      <svg className="w-9 h-9 -rotate-90" viewBox="0 0 36 36">
                        <circle cx="18" cy="18" r="14" fill="none" stroke="rgba(255,255,255,0.08)" stroke-width="3" />
                        <circle
                          cx="18"
                          cy="18"
                          r="14"
                          fill="none"
                          stroke={isSafe ? '#10b981' : isCaution ? '#f59e0b' : '#f43f5e'}
                          stroke-width="3"
                          stroke-dasharray={circumference}
                          stroke-dashoffset={strokeDashoffset}
                          stroke-linecap="round"
                        />
                      </svg>
                      <span className="absolute font-mono text-[9px] font-bold text-white">
                        {Math.round(pfz.suitability_score)}%
                      </span>
                    </div>
                    <div>
                      <span className="text-[9px] text-slate-400 font-mono block leading-tight">Feasibility</span>
                      <span className="text-[10px] font-bold text-emerald-400 font-mono">
                        {pfz.suitability_score >= 85 ? 'High Bloom' : pfz.suitability_score >= 75 ? 'Moderate' : 'Scattered'}
                      </span>
                    </div>
                  </div>

                  {/* SST & Chlorophyll Badges */}
                  <div className="flex items-center gap-2 pr-1 font-mono text-[10px]">
                    <div className="px-2 py-1 rounded-lg bg-white/[0.04] border border-white/5 text-right">
                      <span className="text-[8px] text-slate-400 block">SST FRONT</span>
                      <span className="text-amber-300 font-semibold">{pfz.sst_c}°C</span>
                    </div>
                    <div className="px-2 py-1 rounded-lg bg-white/[0.04] border border-white/5 text-right">
                      <span className="text-[8px] text-slate-400 block">CHLOROPHYLL</span>
                      <span className="text-emerald-300 font-semibold">{pfz.chlorophyll_mg_m3}</span>
                    </div>
                  </div>
                </div>

                {/* Recommendation Note */}
                <p className="text-[11px] text-slate-300 leading-relaxed mb-2.5 line-clamp-2">
                  {pfz.recommendation}
                </p>

                {/* Plot Safe Route Action Button */}
                <button
                  disabled={isAnalyzing}
                  onClick={() => openRouteForPFZ(pfz)}
                  className={`w-full flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer disabled:opacity-40 shadow-sm ${
                    isSelected
                      ? 'bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-950 font-bold shadow-cyan-500/20'
                      : 'bg-white/[0.05] hover:bg-cyan-500/20 text-cyan-300 hover:text-cyan-100 border border-white/[0.08] hover:border-cyan-500/40'
                  }`}
                >
                  {isAnalyzing && isSelected ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-cyan-400" />
                      <span>Computing Safe Detour...</span>
                    </>
                  ) : (
                    <>
                      <Navigation className="w-3.5 h-3.5" />
                      <span>{isSelected ? 'Route Active on Map' : 'Plot Safe Route on Map'}</span>
                      <ArrowUpRight className="w-3.5 h-3.5 opacity-60" />
                    </>
                  )}
                </button>
              </div>
            );
          })
        )}
      </div>

    </div>
  );
};
