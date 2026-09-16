import { useState } from 'react';
import { AlertTriangle, ShieldAlert, Waves, Wind, Zap, Radio, CheckCircle2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const AlertCenter = () => {
  const { alerts } = useApp();
  const [filter, setFilter] = useState<'ALL' | 'EXTREME' | 'HIGH' | 'MODERATE' | 'INFORMATIONAL'>('ALL');

  const filteredAlerts = alerts.filter((a) => (filter === 'ALL' ? true : a.severity === filter));

  const getAlertIcon = (category: string) => {
    switch (category) {
      case 'WAVE': return Waves;
      case 'WIND': return Wind;
      case 'LIGHTNING': return Zap;
      case 'CYCLONE': return Radio;
      case 'IMBL': return ShieldAlert;
      default: return AlertTriangle;
    }
  };

  return (
    <div className="border-2 border-black bg-[#FFF570]/90 shadow-[4px_4px_0px_0px_#000000] p-4 flex flex-col h-full text-xs font-mono select-none">
      
      {/* Header & Filter Pills */}
      <div className="flex items-center justify-between pb-2.5 border-b-2 border-black gap-2">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-black" />
          <div>
            <h3 className="text-xs font-black uppercase text-black tracking-wide">ACTIVE MARINE HAZARD ALERTS</h3>
            <span className="text-[9px] text-black/70">STATUTORY NAVIGATIONAL ADVISORIES</span>
          </div>
        </div>

        <div className="flex items-center gap-1 text-[9px]">
          {(['ALL', 'EXTREME', 'HIGH'] as const).map((sev) => (
            <button
              key={sev}
              onClick={() => setFilter(sev)}
              className={`px-2 py-0.5 border border-black cursor-pointer font-bold uppercase transition-colors ${
                filter === sev
                  ? 'bg-black text-[#FFF570]'
                  : 'bg-white text-black hover:bg-black/10'
              }`}
            >
              {sev}
            </button>
          ))}
        </div>
      </div>

      {/* Alert List */}
      <div className="mt-3 space-y-2.5 overflow-y-auto flex-1 pr-1 max-h-72">
        {filteredAlerts.length === 0 ? (
          <div className="p-8 text-center text-black flex flex-col items-center gap-2 border border-dashed border-black/40">
            <CheckCircle2 className="w-6 h-6 text-black" />
            <span className="font-bold text-xs uppercase">NO ACTIVE HAZARD WARNINGS MATCHING FILTER</span>
            <p className="text-[10px] text-black/70">All meteorological and spatial parameters within safe maritime thresholds.</p>
          </div>
        ) : (
          filteredAlerts.map((alert) => {
            const Icon = getAlertIcon(alert.category);
            const isExtreme = alert.severity === 'EXTREME' || alert.severity === 'HIGH';

            return (
              <div
                key={alert.id}
                className={`border-2 border-black p-3 shadow-[2px_2px_0px_0px_#000] transition-all ${
                  isExtreme ? 'bg-white text-black' : 'bg-black/5 text-black'
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className={`p-1 border border-black ${isExtreme ? 'bg-black text-[#FFF570]' : 'bg-white text-black'}`}>
                      <Icon className="w-3.5 h-3.5" />
                    </span>
                    <span className="font-bold uppercase text-xs">{alert.title}</span>
                  </div>

                  <span className={`px-1.5 py-0.2 border border-black text-[9px] font-black uppercase ${
                    alert.severity === 'EXTREME' ? 'bg-rose-600 text-white' : 'bg-black text-[#FFF570]'
                  }`}>
                    {alert.severity}
                  </span>
                </div>

                <p className="text-[11px] font-sans text-black/90 mb-2 leading-tight">
                  {alert.message}
                </p>

                <div className="flex items-center justify-between text-[9px] text-black/70 border-t border-black/20 pt-1.5">
                  <span>SOURCE: {alert.source || 'INCOIS / IMD'}</span>
                  <span>ISSUED: {alert.issued_at || 'LIVE'}</span>
                </div>
              </div>
            );
          })
        )}
      </div>

    </div>
  );
};
