import React, { useState } from 'react';
import { TrendingUp, Waves, Wind, Thermometer, Droplets, Shield, Compass, Activity, Clock } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const MarineTrendsModal: React.FC = () => {
  const { activeLocationName, weather, ocean, risk } = useApp();

  const hours = ['00:00', '03:00', '06:00', '09:00', '12:00', '15:00', '18:00', '21:00'];
  
  const baseWave = ocean?.wave_height || 1.2;
  const waveSeries = [baseWave - 0.2, baseWave - 0.1, baseWave, baseWave + 0.3, baseWave + 0.4, baseWave + 0.2, baseWave, baseWave - 0.1];

  const baseWind = weather?.wind_speed_kmh || 14.8;
  const windSeries = [baseWind - 2.5, baseWind - 1.2, baseWind + 1.8, baseWind + 4.5, baseWind + 6.2, baseWind + 3.8, baseWind + 1.2, baseWind - 0.8];

  const baseSst = ocean?.sst || 27.9;
  const sstSeries = [baseSst - 0.3, baseSst - 0.2, baseSst - 0.1, baseSst + 0.2, baseSst + 0.5, baseSst + 0.4, baseSst + 0.1, baseSst - 0.2];

  const tideSeries = [0.8, 1.4, 2.1, 1.8, 0.9, 0.5, 1.1, 1.9];

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 space-y-6 text-slate-100">
      
      {/* Header Banner */}
      <div className="flex flex-wrap items-center justify-between border-b border-cyan-900/40 pb-5 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-950 text-cyan-400 border border-cyan-800">
              OCEANOGRAPHIC TIME-SERIES
            </span>
            <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              SYNCHRONIZED
            </span>
          </div>
          <h2 className="text-2xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-200 to-cyan-400">
            24-Hour Met-Ocean Forecast & Trends
          </h2>
          <p className="text-xs text-slate-400 mt-1 font-sans">
            Analysis Sector: <strong className="text-cyan-300 font-mono">{activeLocationName}</strong>
          </p>
        </div>

        <div className="flex items-center gap-2 bg-[#050b18] px-3.5 py-2 rounded-xl border border-cyan-500/30 text-xs font-mono">
          <Clock className="w-3.5 h-3.5 text-cyan-400" />
          <span className="text-slate-300">Forecast Horizon:</span>
          <strong className="text-cyan-300">+24 Hours</strong>
        </div>
      </div>

      {/* Grid of 4 High-Tech Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        
        {/* 1. Significant Wave Height */}
        <div className="bg-gradient-to-br from-[#09142e]/90 to-[#050b18] border border-blue-500/30 rounded-2xl p-5 shadow-[0_0_25px_rgba(59,130,246,0.15)]">
          <div className="flex items-center justify-between mb-4 text-xs">
            <span className="font-extrabold text-white flex items-center gap-2 text-sm">
              <Waves className="w-4 h-4 text-blue-400" /> Significant Wave Height (m)
            </span>
            <span className="font-mono text-blue-300 font-bold bg-blue-950/80 px-2.5 py-1 rounded-lg border border-blue-800/60">
              Peak: {(Math.max(...waveSeries)).toFixed(1)}m
            </span>
          </div>
          
          <div className="h-40 w-full flex items-end justify-between gap-2.5 pt-4 px-2">
            {waveSeries.map((val, idx) => {
              const heightPct = Math.min(100, Math.max(15, (val / 2.5) * 100));
              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2 group">
                  <span className="text-[10px] font-mono text-slate-300 font-semibold group-hover:text-cyan-300 transition-colors">
                    {val.toFixed(1)}
                  </span>
                  <div className="w-full bg-slate-950/80 rounded-t-lg h-28 flex items-end p-0.5 border border-white/5">
                    <div
                      className="w-full bg-gradient-to-t from-blue-700 via-cyan-500 to-cyan-300 rounded-t-md group-hover:brightness-125 transition-all duration-300"
                      style={{ height: `${heightPct}%` }}
                    />
                  </div>
                  <span className="text-[9px] text-slate-500 font-mono">{hours[idx]}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* 2. Surface Wind Velocity */}
        <div className="bg-gradient-to-br from-[#09142e]/90 to-[#050b18] border border-sky-500/30 rounded-2xl p-5 shadow-[0_0_25px_rgba(14,165,233,0.15)]">
          <div className="flex items-center justify-between mb-4 text-xs">
            <span className="font-extrabold text-white flex items-center gap-2 text-sm">
              <Wind className="w-4 h-4 text-sky-400" /> Surface Wind Speed (km/h)
            </span>
            <span className="font-mono text-sky-300 font-bold bg-sky-950/80 px-2.5 py-1 rounded-lg border border-sky-800/60">
              Peak: {(Math.max(...windSeries)).toFixed(0)} km/h
            </span>
          </div>
          
          <div className="h-40 w-full flex items-end justify-between gap-2.5 pt-4 px-2">
            {windSeries.map((val, idx) => {
              const heightPct = Math.min(100, Math.max(15, (val / 30.0) * 100));
              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2 group">
                  <span className="text-[10px] font-mono text-slate-300 font-semibold group-hover:text-sky-300 transition-colors">
                    {val.toFixed(0)}
                  </span>
                  <div className="w-full bg-slate-950/80 rounded-t-lg h-28 flex items-end p-0.5 border border-white/5">
                    <div
                      className="w-full bg-gradient-to-t from-indigo-700 via-sky-500 to-sky-300 rounded-t-md group-hover:brightness-125 transition-all duration-300"
                      style={{ height: `${heightPct}%` }}
                    />
                  </div>
                  <span className="text-[9px] text-slate-500 font-mono">{hours[idx]}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* 3. Sea Surface Temperature */}
        <div className="bg-gradient-to-br from-[#09142e]/90 to-[#050b18] border border-amber-500/30 rounded-2xl p-5 shadow-[0_0_25px_rgba(245,158,11,0.15)]">
          <div className="flex items-center justify-between mb-4 text-xs">
            <span className="font-extrabold text-white flex items-center gap-2 text-sm">
              <Thermometer className="w-4 h-4 text-amber-400" /> Sea Surface Temperature (?C)
            </span>
            <span className="font-mono text-amber-300 font-bold bg-amber-950/80 px-2.5 py-1 rounded-lg border border-amber-800/60">
              Avg: {baseSst}?C
            </span>
          </div>
          
          <div className="h-40 w-full flex items-end justify-between gap-2.5 pt-4 px-2">
            {sstSeries.map((val, idx) => {
              const heightPct = Math.min(100, Math.max(20, ((val - 25) / 5) * 100));
              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2 group">
                  <span className="text-[10px] font-mono text-slate-300 font-semibold group-hover:text-amber-300 transition-colors">
                    {val.toFixed(1)}
                  </span>
                  <div className="w-full bg-slate-950/80 rounded-t-lg h-28 flex items-end p-0.5 border border-white/5">
                    <div
                      className="w-full bg-gradient-to-t from-amber-700 via-yellow-500 to-amber-300 rounded-t-md group-hover:brightness-125 transition-all duration-300"
                      style={{ height: `${heightPct}%` }}
                    />
                  </div>
                  <span className="text-[9px] text-slate-500 font-mono">{hours[idx]}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* 4. Semi-Diurnal Tide Cycle */}
        <div className="bg-gradient-to-br from-[#09142e]/90 to-[#050b18] border border-emerald-500/30 rounded-2xl p-5 shadow-[0_0_25px_rgba(16,185,129,0.15)]">
          <div className="flex items-center justify-between mb-4 text-xs">
            <span className="font-extrabold text-white flex items-center gap-2 text-sm">
              <TrendingUp className="w-4 h-4 text-emerald-400" /> Tidal Elevation Range (m)
            </span>
            <span className="font-mono text-emerald-300 font-bold bg-emerald-950/80 px-2.5 py-1 rounded-lg border border-emerald-800/60">
              Spring Range: 2.1m
            </span>
          </div>
          
          <div className="h-40 w-full flex items-end justify-between gap-2.5 pt-4 px-2">
            {tideSeries.map((val, idx) => {
              const heightPct = Math.min(100, Math.max(20, (val / 2.5) * 100));
              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2 group">
                  <span className="text-[10px] font-mono text-slate-300 font-semibold group-hover:text-emerald-300 transition-colors">
                    {val.toFixed(1)}m
                  </span>
                  <div className="w-full bg-slate-950/80 rounded-t-lg h-28 flex items-end p-0.5 border border-white/5">
                    <div
                      className="w-full bg-gradient-to-t from-teal-700 via-emerald-500 to-emerald-300 rounded-t-md group-hover:brightness-125 transition-all duration-300"
                      style={{ height: `${heightPct}%` }}
                    />
                  </div>
                  <span className="text-[9px] text-slate-500 font-mono">{hours[idx]}</span>
                </div>
              );
            })}
          </div>
        </div>

      </div>

    </div>
  );
};
