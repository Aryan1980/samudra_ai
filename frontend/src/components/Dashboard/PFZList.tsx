import { useState } from 'react';
import { Fish, Compass, ArrowUpRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const PFZList = () => {
  const { pfzs, routeToPFZ, isAnalyzing } = useApp();
  const [sortBy, setSortBy] = useState<'distance' | 'suitability' | 'safety'>('distance');

  const sortedPfzs = [...pfzs].sort((a, b) => {
    if (sortBy === 'distance') return a.distance_km - b.distance_km;
    if (sortBy === 'suitability') return b.suitability_score - a.suitability_score;
    const rank: Record<string, number> = { SAFE: 1, CAUTION: 2, AVOID: 3 };
    return (rank[a.safety_rating] || 9) - (rank[b.safety_rating] || 9);
  });

  return (
    <div className="border-2 border-black bg-[#FFF570]/90 shadow-[4px_4px_0px_0px_#000000] p-4 flex flex-col h-full font-mono text-xs select-none">
      
      {/* Header & Sort Selector */}
      <div className="flex items-center justify-between gap-2 pb-2.5 border-b-2 border-black">
        <div className="flex items-center gap-2">
          <Fish className="w-4 h-4 text-black" />
          <div>
            <h3 className="text-xs font-black uppercase text-black tracking-wide">POTENTIAL FISHING ZONES (PFZ)</h3>
            <span className="text-[9px] text-black/70">OCEANSAT-3 FRONTAL CONVERGENCE</span>
          </div>
        </div>

        {/* Sort selector */}
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as any)}
          className="border-2 border-black px-2 py-0.5 text-[10px] font-bold bg-white text-black outline-none cursor-pointer"
        >
          <option value="distance">SORT: NEAREST DISTANCE</option>
          <option value="suitability">SORT: SUITABILITY INDEX</option>
          <option value="safety">SORT: SAFETY RATING</option>
        </select>
      </div>

      {/* PFZ Card List */}
      <div className="mt-3 space-y-2.5 overflow-y-auto flex-1 pr-1 max-h-72">
        {sortedPfzs.map((pfz, idx) => (
          <div
            key={pfz.id}
            className="border-2 border-black bg-white p-3 shadow-[2px_2px_0px_0px_#000] hover:bg-[#FFF570]/30 transition-colors"
          >
            <div className="flex items-start justify-between gap-2 mb-2">
              <div>
                <div className="font-bold text-black text-xs flex items-center gap-2">
                  <span className="border border-black bg-black text-[#FFF570] px-1 py-0.2 text-[9px] font-black">
                    #{idx + 1}
                  </span>
                  <span className="uppercase font-extrabold">{pfz.name}</span>
                </div>
                <div className="text-[10px] text-black/80 font-mono mt-1 flex items-center gap-1">
                  <Compass className="w-3 h-3 text-black" />
                  <span>{pfz.distance_km} KM ({pfz.bearing_compass}, {pfz.bearing_deg}°)</span>
                </div>
              </div>

              {/* Safety Badge */}
              <span
                className={`px-2 py-0.5 font-black text-[9px] uppercase border border-black ${
                  pfz.safety_rating === 'SAFE'
                    ? 'bg-black text-[#FFF570]'
                    : pfz.safety_rating === 'CAUTION'
                    ? 'bg-white text-black'
                    : 'bg-rose-500 text-white'
                }`}
              >
                {pfz.safety_rating}
              </span>
            </div>

            {/* Scientific Metrics Grid */}
            <div className="grid grid-cols-3 gap-2 border border-black/30 p-1.5 text-[10px] mb-2 bg-black/5">
              <div>
                <span className="text-black/60 block text-[8px] uppercase">SST</span>
                <span className="font-bold text-black">{pfz.sst_c}°C</span>
              </div>
              <div>
                <span className="text-black/60 block text-[8px] uppercase">CHLOROPHYLL</span>
                <span className="font-bold text-black">{pfz.chlorophyll_mg_m3} mg/m³</span>
              </div>
              <div>
                <span className="text-black/60 block text-[8px] uppercase">SUITABILITY</span>
                <span className="font-bold text-black">{pfz.suitability_score}%</span>
              </div>
            </div>

            {/* Navigation Dispatch Button */}
            <button
              disabled={isAnalyzing}
              onClick={() => routeToPFZ(pfz)}
              className="w-full border border-black py-1 px-2 font-bold text-[10px] uppercase bg-black text-[#FFF570] hover:bg-transparent hover:text-black transition-colors flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-40"
            >
              <span>DISPATCH WAYPOINT VECTOR</span>
              <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>
        ))}
      </div>

    </div>
  );
};
