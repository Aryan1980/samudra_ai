import { Waves, Wind, Thermometer, Droplets, Clock } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const MarineTrendsModal = () => {
  const { activeLocationName, weather, ocean } = useApp();

  const hours = ['00:00', '03:00', '06:00', '09:00', '12:00', '15:00', '18:00', '21:00'];
  
  const baseWave = ocean?.wave_height || 1.2;
  const waveSeries = [baseWave - 0.2, baseWave - 0.1, baseWave, baseWave + 0.3, baseWave + 0.4, baseWave + 0.2, baseWave, baseWave - 0.1];

  const baseWind = weather?.wind_speed_kmh || 14.8;
  const windSeries = [baseWind - 2.5, baseWind - 1.2, baseWind + 1.8, baseWind + 4.5, baseWind + 6.2, baseWind + 3.8, baseWind + 1.2, baseWind - 0.8];

  const baseSst = ocean?.sst || 27.9;
  const sstSeries = [baseSst - 0.3, baseSst - 0.2, baseSst - 0.1, baseSst + 0.2, baseSst + 0.5, baseSst + 0.4, baseSst + 0.1, baseSst - 0.2];

  const tideSeries = [0.8, 1.4, 2.1, 1.8, 0.9, 0.5, 1.1, 1.9];

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 space-y-6 text-black font-mono">
      
      {/* Header Banner */}
      <div className="flex flex-wrap items-center justify-between border-b-2 border-black pb-4 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 text-[10px] font-bold bg-black text-[#FFF570] uppercase">
              OCEANOGRAPHIC TIME-SERIES // SPECTRAL PREDICTION
            </span>
            <span className="text-[10px] text-black font-bold flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              SYNCHRONIZED
            </span>
          </div>
          <h2 className="text-4xl sm:text-6xl font-black font-bebas text-black uppercase tracking-tight">
            24-HOUR MET-OCEAN FORECAST & TRENDS
          </h2>
          <p className="text-xs text-black/80 mt-1 uppercase">
            ANALYSIS SECTOR: <strong className="text-black font-bold">{activeLocationName}</strong>
          </p>
        </div>

        <div className="flex items-center gap-2 border-2 border-black bg-black text-[#FFF570] px-3.5 py-1.5 text-xs font-bold uppercase">
          <Clock className="w-3.5 h-3.5" />
          <span>HORIZON: +24 HOURS</span>
        </div>
      </div>

      {/* Grid of 4 High-Tech Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        
        {/* 1. Significant Wave Height */}
        <div className="border-2 border-black bg-white p-5 shadow-[4px_4px_0px_0px_#000]">
          <div className="flex items-center justify-between mb-4 text-xs border-b border-black pb-2">
            <span className="font-extrabold text-black uppercase flex items-center gap-2 text-sm">
              <Waves className="w-4 h-4 text-black" /> SIGNIFICANT WAVE HEIGHT (M)
            </span>
            <span className="font-bold bg-black text-[#FFF570] px-2 py-0.5 text-[10px]">
              PEAK: {Math.max(...waveSeries).toFixed(1)}M
            </span>
          </div>
          <div className="h-36 flex items-end justify-between gap-2 pt-4">
            {waveSeries.map((val, idx) => {
              const max = Math.max(...waveSeries);
              const heightPct = Math.min(100, Math.max(15, (val / max) * 100));
              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                  <span className="text-[9px] font-bold text-black">{val.toFixed(1)}</span>
                  <div 
                    style={{ height: `${heightPct}%` }}
                    className="w-full bg-black hover:bg-black/70 transition-all border border-black"
                  />
                  <span className="text-[8px] text-black/70">{hours[idx]}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* 2. Surface Wind Velocity */}
        <div className="border-2 border-black bg-white p-5 shadow-[4px_4px_0px_0px_#000]">
          <div className="flex items-center justify-between mb-4 text-xs border-b border-black pb-2">
            <span className="font-extrabold text-black uppercase flex items-center gap-2 text-sm">
              <Wind className="w-4 h-4 text-black" /> WIND VELOCITY (KM/H)
            </span>
            <span className="font-bold bg-black text-[#FFF570] px-2 py-0.5 text-[10px]">
              GALE ALERT: &gt; 30 KM/H
            </span>
          </div>
          <div className="h-36 flex items-end justify-between gap-2 pt-4">
            {windSeries.map((val, idx) => {
              const max = Math.max(...windSeries);
              const heightPct = Math.min(100, Math.max(15, (val / max) * 100));
              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                  <span className="text-[9px] font-bold text-black">{val.toFixed(0)}</span>
                  <div 
                    style={{ height: `${heightPct}%` }}
                    className="w-full bg-black hover:bg-black/70 transition-all border border-black"
                  />
                  <span className="text-[8px] text-black/70">{hours[idx]}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* 3. Sea Surface Temp Gradient */}
        <div className="border-2 border-black bg-white p-5 shadow-[4px_4px_0px_0px_#000]">
          <div className="flex items-center justify-between mb-4 text-xs border-b border-black pb-2">
            <span className="font-extrabold text-black uppercase flex items-center gap-2 text-sm">
              <Thermometer className="w-4 h-4 text-black" /> SEA SURFACE TEMP (°C)
            </span>
            <span className="font-bold bg-black text-[#FFF570] px-2 py-0.5 text-[10px]">
              FRONTAL ΔT: 0.8°C
            </span>
          </div>
          <div className="h-36 flex items-end justify-between gap-2 pt-4">
            {sstSeries.map((val, idx) => {
              const min = Math.min(...sstSeries) - 0.5;
              const max = Math.max(...sstSeries) + 0.5;
              const heightPct = Math.min(100, Math.max(15, ((val - min) / (max - min)) * 100));
              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                  <span className="text-[9px] font-bold text-black">{val.toFixed(1)}°</span>
                  <div 
                    style={{ height: `${heightPct}%` }}
                    className="w-full bg-black hover:bg-black/70 transition-all border border-black"
                  />
                  <span className="text-[8px] text-black/70">{hours[idx]}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* 4. Astronomical Tidal Level */}
        <div className="border-2 border-black bg-white p-5 shadow-[4px_4px_0px_0px_#000]">
          <div className="flex items-center justify-between mb-4 text-xs border-b border-black pb-2">
            <span className="font-extrabold text-black uppercase flex items-center gap-2 text-sm">
              <Droplets className="w-4 h-4 text-black" /> TIDAL ELEVATION (M CD)
            </span>
            <span className="font-bold bg-black text-[#FFF570] px-2 py-0.5 text-[10px]">
              SEMIDIURNAL CYCLE
            </span>
          </div>
          <div className="h-36 flex items-end justify-between gap-2 pt-4">
            {tideSeries.map((val, idx) => {
              const max = Math.max(...tideSeries);
              const heightPct = Math.min(100, Math.max(15, (val / max) * 100));
              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                  <span className="text-[9px] font-bold text-black">{val.toFixed(1)}m</span>
                  <div 
                    style={{ height: `${heightPct}%` }}
                    className="w-full bg-black hover:bg-black/70 transition-all border border-black"
                  />
                  <span className="text-[8px] text-black/70">{hours[idx]}</span>
                </div>
              );
            })}
          </div>
        </div>

      </div>

    </div>
  );
};
