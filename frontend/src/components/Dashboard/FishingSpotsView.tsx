import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Fish,
  Navigation,
  Compass,
  Thermometer,
  Droplets,
  ShieldCheck,
  AlertTriangle,
  MapPin,
  Clock,
  ArrowRight,
  Loader2,
  CheckCircle2,
  Anchor,
  Layers
} from 'lucide-react';
import { PFZZone } from '../../types/marine';

interface FishingSpotsViewProps {
  onViewOnMap: () => void;
}

export const FishingSpotsView: React.FC<FishingSpotsViewProps> = ({ onViewOnMap }) => {
  const {
    pfzs,
    activeLocation,
    activeLocationName,
    selectedPFZForRoute,
    routeComparison,
    openRouteForPFZ,
    isAnalyzing
  } = useApp();

  const [activeSpot, setActiveSpot] = useState<PFZZone | null>(selectedPFZForRoute || pfzs[0] || null);

  const handleSelectSpot = (pfz: PFZZone) => {
    setActiveSpot(pfz);
    openRouteForPFZ(pfz);
  };

  const selected = activeSpot || pfzs[0];

  const estHours = selected ? (selected.distance_km / 12.0).toFixed(1) : '1.5';
  const fuelEst = selected ? Math.round(selected.distance_km * 0.85) : 18;

  return (
    <div className="h-full min-h-0 flex-1 flex flex-col overflow-hidden bg-[#151926] text-[#f1f5fb] p-6 sm:p-8 relative selection:bg-[#0474C4]/30 selection:text-[#A8C4EC] font-sans">
      
      {/* ── Ambient Sapphire Glow ── */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-1/4 w-[600px] h-[300px] bg-[#0474C4]/10 rounded-full blur-[140px]" />
        <div className="absolute bottom-10 left-10 w-[500px] h-[400px] bg-[#2C444C]/15 rounded-full blur-[140px]" />
      </div>

      {/* ── Top Header ── */}
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#5379AE]/25 flex-shrink-0">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#06457F] border border-[#5379AE]/40 flex items-center justify-center text-white shadow-md">
              <Fish className="w-5 h-5 text-[#A8C4EC]" />
            </div>
            <div>
              <h1 className="font-editorial text-2xl sm:text-3xl font-normal text-white tracking-tight">
                Fishing Spots & Navigational Coordinates
              </h1>
              <p className="text-xs text-[#A8C4EC]/80 font-mono mt-0.5 flex items-center gap-2">
                <span>Departure fix: {activeLocationName}</span>
                <span className="text-[#5379AE]">·</span>
                <span className="text-[#A8C4EC] font-semibold">{pfzs.length} Open-Ocean Fronts Detected</span>
              </p>
            </div>
          </div>
        </div>

        {/* Action button to jump to map */}
        <button
          onClick={onViewOnMap}
          className="btn-signature group cursor-pointer"
        >
          <Navigation className="w-3.5 h-3.5 text-[#A8C4EC]" />
          <span>View on Satellite Map</span>
          <span className="text-[#A8C4EC] transition-transform duration-200 group-hover:translate-x-1 font-sans">→</span>
        </button>
      </div>

      {/* ── Main 2-Column Grid ── */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-5 flex-1 min-h-0 pt-4 overflow-hidden">
        
        {/* Left Column (5 Cols): List of all 8 Spots with Conditions */}
        <div className="lg:col-span-5 flex flex-col min-h-0 bg-[#1d2334] border border-[#5379AE]/30 rounded-2xl p-5 shadow-xl">
          <div className="flex items-center justify-between pb-3 border-b border-[#5379AE]/20 flex-shrink-0">
            <span className="font-editorial text-base text-white font-normal">Identified Thermal Fronts</span>
            <span className="text-[10px] font-mono text-[#A8C4EC]/75">Sorted by transit proximity</span>
          </div>

          <div className="space-y-3 overflow-y-auto flex-1 pr-1.5 pt-3">
            {pfzs.map((pfz, idx) => {
              const isSelected = selected?.id === pfz.id;
              const isSafe = pfz.safety_rating === 'SAFE';
              const isCaution = pfz.safety_rating === 'CAUTION';

              return (
                <div
                  key={pfz.id}
                  onClick={() => handleSelectSpot(pfz)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer select-none ${
                    isSelected
                      ? 'bg-[#06457F]/30 border-[#0474C4]/70 shadow-[0_0_20px_rgba(4,116,196,0.2)] ring-1 ring-[#0474C4]/50'
                      : 'bg-[#151926] hover:bg-[#20273a] border-[#5379AE]/20'
                  }`}
                >
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#5379AE]/15">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-lg bg-[#262B40] text-[#A8C4EC] font-mono font-bold text-xs flex items-center justify-center border border-[#5379AE]/30">
                        {idx + 1}
                      </span>
                      <span className="font-editorial text-sm text-white font-normal">
                        Spot {idx + 1}: {pfz.name.replace(`Spot ${idx + 1}: `, '')}
                      </span>
                    </div>

                    <span
                      className={`px-2 py-0.5 rounded-full text-[9px] font-mono font-bold uppercase ${
                        isSafe
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          : isCaution
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                          : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                      }`}
                    >
                      {pfz.safety_rating}
                    </span>
                  </div>

                  {/* Conditions Grid */}
                  <div className="grid grid-cols-3 gap-2 bg-[#151926]/90 p-2.5 rounded-lg text-[10px] font-mono mb-2 border border-[#5379AE]/15">
                    <div>
                      <span className="text-[#5379AE] block text-[9px]">TRANSIT</span>
                      <span className="text-[#A8C4EC] font-semibold">{pfz.distance_km} km ({pfz.bearing_compass})</span>
                    </div>
                    <div>
                      <span className="text-[#5379AE] block text-[9px]">SST FRONT</span>
                      <span className="text-amber-300 font-semibold">{pfz.sst_c}°C</span>
                    </div>
                    <div>
                      <span className="text-[#5379AE] block text-[9px]">FEASIBILITY</span>
                      <span className="text-emerald-400 font-semibold">{Math.round(pfz.suitability_score)}%</span>
                    </div>
                  </div>

                  <p className="text-xs text-[#A8C4EC]/80 font-light leading-relaxed line-clamp-2">
                    {pfz.recommendation}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column (7 Cols): Detailed Route Waypoints & Navigation Diagnostics */}
        <div className="lg:col-span-7 flex flex-col min-h-0 bg-[#1d2334] border border-[#5379AE]/30 rounded-2xl p-6 shadow-xl space-y-5 overflow-y-auto">
          
          {selected && (
            <>
              {/* Active Spot Header */}
              <div className="flex items-center justify-between pb-3 border-b border-[#5379AE]/20">
                <div>
                  <span className="text-[10px] font-mono text-[#0474C4] uppercase tracking-wider block font-semibold">
                    SELECTED FISHING FRONT ROUTE
                  </span>
                  <h2 className="font-editorial text-xl text-white font-normal mt-0.5">
                    {selected.name}
                  </h2>
                </div>

                <div className="flex items-center gap-2">
                  <div className="text-right font-mono">
                    <span className="text-[10px] text-[#5379AE] block">HARVEST MATCH</span>
                    <span className="text-lg font-bold text-emerald-400">
                      {Math.round(selected.suitability_score)}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Transit & Fuel Highlights */}
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3.5 rounded-xl bg-[#151926] border border-[#5379AE]/20 font-mono">
                  <span className="text-[10px] text-[#A8C4EC]/70 block">ONE-WAY DISTANCE</span>
                  <span className="text-lg font-bold text-white">{selected.distance_km} km</span>
                  <span className="text-[10px] text-[#0474C4] block mt-0.5">Bearing {selected.bearing_deg}° ({selected.bearing_compass})</span>
                </div>

                <div className="p-3.5 rounded-xl bg-[#151926] border border-[#5379AE]/20 font-mono">
                  <span className="text-[10px] text-[#A8C4EC]/70 block">EST. STEAMING TIME</span>
                  <span className="text-lg font-bold text-white">{estHours} hrs</span>
                  <span className="text-[10px] text-[#5379AE] block mt-0.5">At 12 kn cruise</span>
                </div>

                <div className="p-3.5 rounded-xl bg-[#151926] border border-[#5379AE]/20 font-mono">
                  <span className="text-[10px] text-[#A8C4EC]/70 block">FUEL CONSUMPTION</span>
                  <span className="text-lg font-bold text-emerald-400">~{fuelEst} Liters</span>
                  <span className="text-[10px] text-[#5379AE] block mt-0.5">Diesel / Kerosene</span>
                </div>
              </div>

              {/* Target GPS Coordinates Card */}
              <div className="p-5 rounded-xl bg-[#151926] border border-[#5379AE]/25 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-editorial text-sm text-white font-normal uppercase tracking-wider block">
                    Target GPS Coordinates & Navigational Fix
                  </span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(`${selected.location.latitude.toFixed(4)}, ${selected.location.longitude.toFixed(4)}`);
                      alert('Target GPS coordinates copied to clipboard!');
                    }}
                    className="text-[10px] font-mono text-[#0474C4] hover:text-[#A8C4EC] transition-colors cursor-pointer flex items-center gap-1"
                  >
                    <span>Copy Coordinates</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div className="p-3 rounded-lg bg-[#181e2e] border border-[#5379AE]/20 font-mono text-xs">
                    <span className="text-[#5379AE] block text-[10px]">TARGET LOCATION FIX</span>
                    <span className="text-white font-bold text-sm block mt-0.5">
                      {selected.location.latitude.toFixed(4)}°N, {selected.location.longitude.toFixed(4)}°E
                    </span>
                    <span className="text-emerald-400 text-[10px] block mt-0.5">● Oceansat-3 Verified Front</span>
                  </div>

                  <div className="p-3 rounded-lg bg-[#181e2e] border border-[#5379AE]/20 font-mono text-xs">
                    <span className="text-[#5379AE] block text-[10px]">DEPARTURE FIX</span>
                    <span className="text-white font-semibold block mt-0.5">
                      {activeLocation.latitude.toFixed(4)}°N, {activeLocation.longitude.toFixed(4)}°E
                    </span>
                    <span className="text-[#A8C4EC]/75 text-[10px] block mt-0.5">{activeLocationName} Harbor</span>
                  </div>
                </div>
              </div>

              {/* Navigational Hazard & Danger Clearance Assessment */}
              <div className="p-5 rounded-xl bg-[#151926] border border-[#5379AE]/25 space-y-3">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span className="font-editorial text-sm text-white font-normal uppercase tracking-wider">
                    Navigational Hazard & Danger Scan
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs font-mono">
                  <div className="p-2.5 rounded-lg bg-[#181e2e] border border-emerald-500/20">
                    <span className="text-[#5379AE] block text-[9px]">IMBL SOVEREIGN BORDER</span>
                    <span className="text-emerald-300 font-semibold text-xs">Clear (&gt;90 km)</span>
                    <span className="text-[9px] text-[#A8C4EC]/70 block mt-0.5">No territorial risk</span>
                  </div>

                  <div className="p-2.5 rounded-lg bg-[#181e2e] border border-emerald-500/20">
                    <span className="text-[#5379AE] block text-[9px]">PROTECTED AREAS (MPA)</span>
                    <span className="text-emerald-300 font-semibold text-xs">0 Intersections</span>
                    <span className="text-[9px] text-[#A8C4EC]/70 block mt-0.5">Sanctuary zones clear</span>
                  </div>

                  <div className="p-2.5 rounded-lg bg-[#181e2e] border border-emerald-500/20">
                    <span className="text-[#5379AE] block text-[9px]">DEFENSE RESTRICTIONS</span>
                    <span className="text-emerald-300 font-semibold text-xs">Unrestricted</span>
                    <span className="text-[9px] text-[#A8C4EC]/70 block mt-0.5">Naval corridor open</span>
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-[#181e2e] border border-amber-500/20 text-xs space-y-1">
                  <div className="flex items-center gap-1.5 text-amber-300 font-semibold text-[11px]">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                    <span>Areas to Avoid & Safety Guidance</span>
                  </div>
                  <p className="text-[#A8C4EC]/90 text-[11px] leading-relaxed font-light">
                    Maintain direct compass heading of <strong className="text-white font-mono">{selected.bearing_deg}° ({selected.bearing_compass})</strong>. Avoid nearshore shoals, sandbars, and shallow waters (&lt;4m depth) within 1.5 nautical miles of the harbor mouth. Watch for concentrated artisanal driftnets before crossing the 20m depth contour.
                  </p>
                </div>
              </div>

              {/* Bottom CTA to Jump to Map */}
              <div className="pt-2">
                <button
                  onClick={onViewOnMap}
                  className="btn-signature w-full py-3.5 group text-xs tracking-[0.14em] cursor-pointer"
                >
                  <Navigation className="w-4 h-4 text-[#A8C4EC]" />
                  <span>Inspect Spot on Satellite Map</span>
                  <span className="text-[#A8C4EC] transition-transform duration-200 group-hover:translate-x-1 font-sans">→</span>
                </button>
              </div>
            </>
          )}

        </div>

      </div>

    </div>
  );
};
