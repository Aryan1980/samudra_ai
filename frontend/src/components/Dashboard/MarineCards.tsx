import { Thermometer, Droplets, Waves, Wind } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const MarineCards = () => {
  const { weather, ocean } = useApp();

  if (!weather || !ocean) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 animate-pulse h-full">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-28 border-2 border-black bg-black/10 p-3" />
        ))}
      </div>
    );
  }

  const sst = ocean.sst !== undefined ? `${ocean.sst}°C` : '28.4°C';
  const chl = ocean.chlorophyll !== undefined ? `${ocean.chlorophyll} mg/m³` : '2.4 mg/m³';
  const wave = ocean.wave_height !== undefined ? `${ocean.wave_height}m` : `${weather.wave_height_m}m`;
  const windKmh = weather.wind_speed_kmh;
  const windKnots = Math.round(windKmh * 0.539957);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 h-full font-mono">
      
      {/* 1. Sea Surface Temp (SST) */}
      <div className="border-2 border-black bg-[#FFF570]/90 p-3.5 flex flex-col justify-between shadow-[3px_3px_0px_0px_#000] hover:translate-x-[-1px] hover:translate-y-[-1px] transition-all">
        <div className="flex items-center justify-between text-black text-[11px] font-bold border-b border-black pb-1.5 mb-2">
          <span className="flex items-center gap-1.5 uppercase">
            <Thermometer className="w-3.5 h-3.5 text-black" />
            SEA SURFACE TEMP
          </span>
          <span className="text-[9px] bg-black text-[#FFF570] px-1 py-0.2 font-bold">
            OCM-3
          </span>
        </div>

        <div className="my-1">
          <div className="text-3xl font-black font-bebas tracking-tight text-black flex items-baseline gap-1">
            {sst}
          </div>
        </div>

        <div className="flex items-center justify-between text-[10px] text-black/80 pt-1.5 border-t border-black/30">
          <span>FRONTAL GRADIENT</span>
          <span className="font-bold">ΔT 0.8°C</span>
        </div>
      </div>

      {/* 2. Chlorophyll-a Plume */}
      <div className="border-2 border-black bg-[#FFF570]/90 p-3.5 flex flex-col justify-between shadow-[3px_3px_0px_0px_#000] hover:translate-x-[-1px] hover:translate-y-[-1px] transition-all">
        <div className="flex items-center justify-between text-black text-[11px] font-bold border-b border-black pb-1.5 mb-2">
          <span className="flex items-center gap-1.5 uppercase">
            <Droplets className="w-3.5 h-3.5 text-black" />
            CHLOROPHYLL-A
          </span>
          <span className="text-[9px] bg-black text-[#FFF570] px-1 py-0.2 font-bold">
            PFZ_FEED
          </span>
        </div>

        <div className="my-1">
          <div className="text-3xl font-black font-bebas tracking-tight text-black flex items-baseline gap-1">
            {chl}
          </div>
        </div>

        <div className="flex items-center justify-between text-[10px] text-black/80 pt-1.5 border-t border-black/30">
          <span>PLANKTON BLOOM</span>
          <span className="font-bold">CONVERGENT</span>
        </div>
      </div>

      {/* 3. Swell Wave Height */}
      <div className="border-2 border-black bg-[#FFF570]/90 p-3.5 flex flex-col justify-between shadow-[3px_3px_0px_0px_#000] hover:translate-x-[-1px] hover:translate-y-[-1px] transition-all">
        <div className="flex items-center justify-between text-black text-[11px] font-bold border-b border-black pb-1.5 mb-2">
          <span className="flex items-center gap-1.5 uppercase">
            <Waves className="w-3.5 h-3.5 text-black" />
            SIGNIFICANT SWELL
          </span>
          <span className="text-[9px] bg-black text-[#FFF570] px-1 py-0.2 font-bold">
            RADAR_ALT
          </span>
        </div>

        <div className="my-1">
          <div className="text-3xl font-black font-bebas tracking-tight text-black flex items-baseline gap-1">
            {wave}
          </div>
        </div>

        <div className="flex items-center justify-between text-[10px] text-black/80 pt-1.5 border-t border-black/30">
          <span>PERIOD / SEA STATE</span>
          <span className="font-bold">7.2S // SLIGHT</span>
        </div>
      </div>

      {/* 4. Wind Velocity & Bearing */}
      <div className="border-2 border-black bg-[#FFF570]/90 p-3.5 flex flex-col justify-between shadow-[3px_3px_0px_0px_#000] hover:translate-x-[-1px] hover:translate-y-[-1px] transition-all">
        <div className="flex items-center justify-between text-black text-[11px] font-bold border-b border-black pb-1.5 mb-2">
          <span className="flex items-center gap-1.5 uppercase">
            <Wind className="w-3.5 h-3.5 text-black" />
            SURFACE WIND
          </span>
          <span className="text-[9px] bg-black text-[#FFF570] px-1 py-0.2 font-bold">
            ANEMO
          </span>
        </div>

        <div className="my-1">
          <div className="text-3xl font-black font-bebas tracking-tight text-black flex items-baseline gap-1">
            {windKnots} <span className="text-sm font-mono font-normal">KTS</span>
          </div>
        </div>

        <div className="flex items-center justify-between text-[10px] text-black/80 pt-1.5 border-t border-black/30">
          <span>BEARING VECTOR</span>
          <span className="font-bold">{weather.wind_direction_deg}° TRUE</span>
        </div>
      </div>

    </div>
  );
};
