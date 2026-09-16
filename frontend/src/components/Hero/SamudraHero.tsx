import { useApp } from '../../context/AppContext';

export const SamudraHero = () => {
  const { activeLocation, activeLocationName, weather, ocean, activeTab, setActiveTab } = useApp();

  const sst = ocean?.sst !== undefined ? `${ocean.sst}°C` : '28.4°C';
  const wave = ocean?.wave_height !== undefined ? `${ocean.wave_height}M` : `${weather?.wave_height_m || 1.2}M`;
  const chl = ocean?.chlorophyll !== undefined ? `${ocean.chlorophyll} mg/m³` : '0.42 mg/m³';

  return (
    <div className="relative w-full border-b-2 border-black bg-transparent select-none overflow-hidden pb-4 pt-6">
      <div className="relative z-10 w-full flex flex-col justify-between">
        
        {/* Top Header Row: System Spec & Massive VOL. 02 */}
        <div className="flex items-start justify-between">
          <div className="flex flex-col font-mono text-[10px] md:text-xs uppercase tracking-widest text-black space-y-1">
            <div className="flex items-center gap-2 font-black">
              <span className="w-2 h-2 bg-black inline-block animate-pulse"></span>
              <span>ISRO OCEANSAT-3 // AUTONOMOUS MULTI-AGENT SWARM</span>
            </div>
            <div className="text-black/70">
              OPERATIONAL BASIN: {activeLocationName} // ARABIAN SEA & BAY OF BENGAL
            </div>
            <div className="text-black/50">
              REF_SPEC: ORCA-MARITIME-V02 // LAT: {activeLocation.latitude.toFixed(4)}° N, LON: {activeLocation.longitude.toFixed(4)}° E
            </div>
          </div>

          {/* Top-Right Massive VOL. 02 - Exactly matching Image 1 */}
          <div className="text-right">
            <div className="font-bebas text-6xl sm:text-7xl md:text-8xl lg:text-9xl leading-[0.82] font-black text-black tracking-tight">
              VOL. 02
            </div>
            <div className="font-mono text-[9px] md:text-[11px] uppercase tracking-[0.25em] text-black font-bold">
              ISRO 2.0 / MARITIME COGNITION / 2026
            </div>
          </div>
        </div>

        {/* Mid / Bottom Hero Grid: Giant SAMUDRA AI Headline + Eye Reticle & Coordinates */}
        <div className="mt-8 mb-4 grid grid-cols-1 lg:grid-cols-12 items-end gap-6">
          
          {/* Bottom-Left Stacked Typography - Image 1 Style */}
          <div className="lg:col-span-8 flex flex-col justify-end">
            <h1 className="font-bebas text-6xl sm:text-8xl md:text-9xl lg:text-[10rem] xl:text-[11.5rem] leading-[0.80] tracking-tighter font-black text-black uppercase">
              <span className="block hover:tracking-normal transition-all duration-300">
                SAMUDRA AI
              </span>
              <span className="block hover:tracking-normal transition-all duration-300">
                MARINE COGNITION
              </span>
            </h1>
          </div>

          {/* Bottom-Right: Perception Reticle Eye + Arrow + Live Telemetry */}
          <div className="lg:col-span-4 flex flex-col justify-end items-start lg:items-end space-y-3">
            <div className="flex items-center gap-4">
              {/* Geometric Reticle Eye Glyph from Image 1 */}
              <div className="relative w-16 h-16 md:w-20 md:h-20 flex items-center justify-center group cursor-pointer" title="Multi-Spectrum Perception Reticle">
                <svg 
                  viewBox="0 0 100 100" 
                  className="w-full h-full text-black stroke-current fill-none stroke-[2] transition-transform duration-500 group-hover:scale-110"
                >
                  <line x1="50" y1="5" x2="50" y2="95" strokeDasharray="3 3" />
                  <line x1="5" y1="50" x2="95" y2="50" strokeDasharray="3 3" />
                  <path 
                    d="M 12 50 Q 50 18 88 50 Q 50 82 12 50 Z" 
                    strokeWidth="2.5"
                  />
                  <circle cx="50" cy="50" r="16" strokeWidth="2.5" />
                  <circle cx="50" cy="50" r="6" className="fill-black" />
                  <circle cx="50" cy="50" r="32" strokeWidth="1" strokeDasharray="2 4" />
                </svg>
              </div>

              {/* Brutalist Diagonal Corner Arrow */}
              <div className="w-16 h-16 md:w-20 md:h-20 border-2 border-black flex items-center justify-center bg-black text-[#FFF570] hover:bg-transparent hover:text-black transition-all duration-200">
                <svg 
                  className="w-8 h-8" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="3"
                >
                  <line x1="5" y1="5" x2="19" y2="19"></line>
                  <polyline points="9 19 19 19 19 9"></polyline>
                </svg>
              </div>
            </div>

            {/* Live Sensor Readout in Brutalist Table */}
            <div className="border border-black p-2.5 bg-black text-[#FFF570] font-mono text-[10px] space-y-1 w-full max-w-[280px]">
              <div className="flex justify-between border-b border-[#FFF570]/30 pb-1 font-bold">
                <span>SENSOR STREAM</span>
                <span>REAL-TIME</span>
              </div>
              <div className="flex justify-between text-[#FFF570]/90">
                <span>SEA TEMP (SST):</span>
                <span className="font-bold text-white">{sst}</span>
              </div>
              <div className="flex justify-between text-[#FFF570]/90">
                <span>SIGNIFICANT SWELL:</span>
                <span className="font-bold text-white">{wave}</span>
              </div>
              <div className="flex justify-between text-[#FFF570]/90">
                <span>CHLOROPHYLL-A:</span>
                <span className="font-bold text-white">{chl}</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Editorial Spread Selector - Matching Image 1 bottom thumbnails */}
        <div className="w-full pt-3 border-t-2 border-black grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-xs">
          <button
            onClick={() => setActiveTab('command')}
            className={`border-2 border-black p-2.5 text-left transition-all cursor-pointer ${
              activeTab === 'command'
                ? 'bg-black text-[#FFF570] shadow-[2px_2px_0px_0px_#000]'
                : 'bg-transparent text-black hover:bg-black/10'
            }`}
          >
            <div className="text-[10px] font-bold border-b border-current pb-0.5 mb-1 flex justify-between">
              <span>SPREAD 00</span>
              <span>00</span>
            </div>
            <div className="font-bebas text-xl leading-none uppercase">COMMAND DECK</div>
            <div className="text-[9px] opacity-80 uppercase">MAP & REAL-TIME SENSORS</div>
          </button>

          <button
            onClick={() => setActiveTab('trends')}
            className={`border-2 border-black p-2.5 text-left transition-all cursor-pointer ${
              activeTab === 'trends'
                ? 'bg-black text-[#FFF570] shadow-[2px_2px_0px_0px_#000]'
                : 'bg-transparent text-black hover:bg-black/10'
            }`}
          >
            <div className="text-[10px] font-bold border-b border-current pb-0.5 mb-1 flex justify-between">
              <span>SPREAD 01</span>
              <span>01</span>
            </div>
            <div className="font-bebas text-xl leading-none uppercase">24H SATELLITE TRENDS</div>
            <div className="text-[9px] opacity-80 uppercase">SST & WAVE SPECTRA</div>
          </button>

          <button
            onClick={() => setActiveTab('data_sources')}
            className={`border-2 border-black p-2.5 text-left transition-all cursor-pointer ${
              activeTab === 'data_sources'
                ? 'bg-black text-[#FFF570] shadow-[2px_2px_0px_0px_#000]'
                : 'bg-transparent text-black hover:bg-black/10'
            }`}
          >
            <div className="text-[10px] font-bold border-b border-current pb-0.5 mb-1 flex justify-between">
              <span>SPREAD 02</span>
              <span>02</span>
            </div>
            <div className="font-bebas text-xl leading-none uppercase">DATA PROVENANCE</div>
            <div className="text-[9px] opacity-80 uppercase">COPERNICUS & INCOIS</div>
          </button>

          <button
            onClick={() => setActiveTab('architecture')}
            className={`border-2 border-black p-2.5 text-left transition-all cursor-pointer ${
              activeTab === 'architecture'
                ? 'bg-black text-[#FFF570] shadow-[2px_2px_0px_0px_#000]'
                : 'bg-transparent text-black hover:bg-black/10'
            }`}
          >
            <div className="text-[10px] font-bold border-b border-current pb-0.5 mb-1 flex justify-between">
              <span>SPREAD 03</span>
              <span>03</span>
            </div>
            <div className="font-bebas text-xl leading-none uppercase">SYSTEM BLUEPRINT</div>
            <div className="text-[9px] opacity-80 uppercase">6-TIER ORCA ARCHITECTURE</div>
          </button>
        </div>

      </div>
    </div>
  );
};
