import React from 'react';
import {
  Navigation,
  ShieldCheck,
  AlertTriangle,
  Clock,
  Gauge,
  Fuel,
  Compass,
  XCircle,
  MapPin,
  CheckCircle2,
  Fish,
  ChevronRight,
  ShieldAlert
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const RoutePlannerPanel: React.FC = () => {
  const {
    routeComparison,
    selectedPFZForRoute,
    clearRoute,
    setActiveCommandTab,
    isAnalyzing
  } = useApp();

  if (!routeComparison) {
    return (
      <div className="bg-[#090d16] border border-white/[0.07] rounded-2xl p-6 flex flex-col items-center justify-center h-full text-center">
        <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 mb-3">
          <Navigation className="w-6 h-6" />
        </div>
        <h3 className="text-sm font-semibold text-white">No Active Navigation Route</h3>
        <p className="text-xs text-slate-400 mt-1.5 max-w-sm leading-relaxed">
          Select any Potential Fishing Zone (PFZ) from the Feasible Spots list to plot an evidence-based voyage route with dynamic hazard avoidance.
        </p>

        <button
          onClick={() => setActiveCommandTab('pfz')}
          className="mt-4 px-4 py-2 bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-300 border border-cyan-500/30 rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-all"
        >
          <Fish className="w-3.5 h-3.5" />
          <span>Browse Feasible Fishing Spots</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    );
  }

  const { shortest_route, safe_route, recommendation, reasoning } = routeComparison;
  const targetName = selectedPFZForRoute ? selectedPFZForRoute.name : 'Target Fishing Ground';

  // Fuel calculation (approx 0.45 liters/km for artisanal mechanized boat at 8 knots)
  const safeFuelLiters = (safe_route.distance_km * 0.45).toFixed(1);
  const directFuelLiters = (shortest_route.distance_km * 0.45).toFixed(1);

  return (
    <div className="bg-[#090d16] border border-white/[0.07] rounded-2xl p-4 flex flex-col h-full overflow-hidden text-xs">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <Navigation className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xs font-bold text-white tracking-tight">Voyage Route Analysis</h3>
              <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono text-[9px] font-semibold">
                SAFE DETOUR PLOTTED
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-mono truncate max-w-[240px]">
              Target: <span className="text-cyan-300 font-medium">{targetName}</span>
            </p>
          </div>
        </div>

        <button
          onClick={clearRoute}
          className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-rose-400 bg-white/[0.03] hover:bg-rose-500/10 border border-white/[0.06] hover:border-rose-500/20 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
          title="Clear route and return to spots"
        >
          <XCircle className="w-3.5 h-3.5" />
          <span>Clear Route</span>
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto mt-3 space-y-3 pr-1">
        
        {/* Comparison Cards: Safe Route vs Direct Track */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          
          {/* Card 1: Safe Detour Route (Recommended) */}
          <div className="p-3.5 rounded-xl border border-emerald-500/30 bg-emerald-950/10 flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-xl pointer-events-none"></div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="flex items-center gap-1 font-bold text-xs text-emerald-300">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  Recommended Safe Route
                </span>
                <span className="px-1.5 py-0.5 rounded bg-emerald-400/15 text-emerald-300 text-[9px] font-mono font-bold">
                  BEST PATH
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 font-mono my-2.5">
                <div className="bg-black/40 p-2 rounded-lg border border-white/5">
                  <span className="text-slate-500 block text-[9px]">Distance</span>
                  <span className="text-white font-bold text-sm">{safe_route.distance_km} km</span>
                </div>
                <div className="bg-black/40 p-2 rounded-lg border border-white/5">
                  <span className="text-slate-500 block text-[9px]">Est. Duration</span>
                  <span className="text-emerald-300 font-bold text-sm">{safe_route.estimated_duration_hours} hrs</span>
                </div>
              </div>

              <div className="space-y-1 text-[10px] text-slate-300 pt-1">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 flex items-center gap-1">
                    <Fuel className="w-3 h-3 text-cyan-400" /> Est. Fuel:
                  </span>
                  <span className="font-mono text-slate-200">{safeFuelLiters} L diesel</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Hazards:
                  </span>
                  <span className="text-emerald-300 font-medium">Bypasses all rough swells</span>
                </div>
              </div>
            </div>

            <div className="mt-2.5 pt-2 border-t border-emerald-500/20 text-[10px] text-emerald-200/80 leading-relaxed font-sans">
              {safe_route.description}
            </div>
          </div>

          {/* Card 2: Direct Track (Unsafe Baseline) */}
          <div className="p-3.5 rounded-xl border border-rose-500/20 bg-rose-950/10 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="flex items-center gap-1 font-bold text-xs text-rose-300">
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                  Direct Track (Hazardous)
                </span>
                <span className="px-1.5 py-0.5 rounded bg-rose-400/15 text-rose-300 text-[9px] font-mono font-bold">
                  HIGH RISK
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 font-mono my-2.5">
                <div className="bg-black/40 p-2 rounded-lg border border-white/5">
                  <span className="text-slate-500 block text-[9px]">Distance</span>
                  <span className="text-white font-bold text-sm">{shortest_route.distance_km} km</span>
                </div>
                <div className="bg-black/40 p-2 rounded-lg border border-white/5">
                  <span className="text-slate-500 block text-[9px]">Est. Duration</span>
                  <span className="text-rose-300 font-bold text-sm">{shortest_route.estimated_duration_hours} hrs</span>
                </div>
              </div>

              <div className="space-y-1 text-[10px] text-slate-300 pt-1">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 flex items-center gap-1">
                    <Fuel className="w-3 h-3 text-slate-400" /> Est. Fuel:
                  </span>
                  <span className="font-mono text-slate-200">{directFuelLiters} L diesel</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-400 flex items-center gap-1">
                    <ShieldAlert className="w-3 h-3 text-rose-400" /> Intersections:
                  </span>
                  <span className="text-rose-300 font-medium truncate max-w-[120px]">
                    {shortest_route.hazards_intersected && shortest_route.hazards_intersected.length > 0
                      ? shortest_route.hazards_intersected.join(', ')
                      : 'Severe Sea Swell'}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-2.5 pt-2 border-t border-rose-500/20 text-[10px] text-rose-200/80 leading-relaxed font-sans">
              Straight line passes directly through high wave swell zones or restricted boundaries.
            </div>
          </div>

        </div>

        {/* Tactical Recommendation & Agent Rationale */}
        <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06]">
          <div className="flex items-center gap-2 mb-1.5">
            <Gauge className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-xs font-semibold text-white">Navigation Officer Rationale</span>
          </div>
          <p className="text-[11px] text-slate-300 leading-relaxed">
            {recommendation}
          </p>
          {reasoning && (
            <div className="mt-2 text-[10px] text-slate-400 font-mono bg-black/40 p-2 rounded-lg border border-white/5 leading-relaxed">
              {reasoning}
            </div>
          )}
        </div>

        {/* Waypoints Sequence List */}
        <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-white flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-cyan-400" />
              Waypoint Navigation Sequence
            </span>
            <span className="font-mono text-[10px] text-slate-400">
              {safe_route.waypoints.length} Fix Points
            </span>
          </div>

          <div className="space-y-1.5 font-mono text-[11px]">
            {safe_route.waypoints.map((wp, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-2 rounded-lg bg-black/30 border border-white/5"
              >
                <div className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-[10px] flex items-center justify-center font-bold">
                    {idx + 1}
                  </span>
                  <span className="text-slate-200 font-sans text-xs">{wp.name}</span>
                </div>

                <div className="flex items-center gap-3 text-slate-400 text-[10px]">
                  <span>{wp.latitude.toFixed(3)}°N, {wp.longitude.toFixed(3)}°E</span>
                  <span className={`px-1.5 py-0.2 rounded text-[9px] font-semibold ${
                    wp.segment_risk === 'LOW'
                      ? 'bg-emerald-500/10 text-emerald-400'
                      : 'bg-amber-500/10 text-amber-400'
                  }`}>
                    {wp.segment_risk || 'SAFE'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
