import React, { useState } from 'react';
import { AlertTriangle, ShieldAlert, Waves, Wind, Zap, Radio, CheckCircle2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const AlertCenter: React.FC = () => {
  const { alerts } = useApp();
  const [filter, setFilter] = useState<'ALL' | 'EXTREME' | 'HIGH' | 'MODERATE'>('ALL');

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
    <div className="bg-[#090d16] border border-white/[0.07] rounded-2xl p-4 flex flex-col h-full text-xs">
      
      {/* Header & Filter Pills */}
      <div className="flex items-center justify-between pb-3 border-b border-white/[0.06] gap-2">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-amber-400" />
          <div>
            <h3 className="text-xs font-semibold text-white">Active Marine Advisories</h3>
          </div>
        </div>

        <div className="flex items-center gap-1 text-[10px]">
          {(['ALL', 'EXTREME', 'HIGH'] as const).map((sev) => (
            <button
              key={sev}
              onClick={() => setFilter(sev)}
              className={`px-2 py-0.5 rounded-md cursor-pointer transition-colors font-medium ${
                filter === sev
                  ? 'bg-white/15 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {sev}
            </button>
          ))}
        </div>
      </div>

      {/* Alert List */}
      <div className="mt-3 space-y-2 overflow-y-auto flex-1 pr-1 max-h-72">
        {filteredAlerts.length === 0 ? (
          <div className="p-8 text-center text-slate-500 flex flex-col items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400/80" />
            <span className="font-medium text-slate-300 text-xs">No active hazard warnings.</span>
            <p className="text-[11px] text-slate-500">All marine parameters within safe operating thresholds.</p>
          </div>
        ) : (
          filteredAlerts.map((alert) => {
            const Icon = getAlertIcon(alert.category);
            const isExtreme = alert.severity === 'EXTREME';
            const isHigh = alert.severity === 'HIGH';

            return (
              <div
                key={alert.id}
                className={`p-3 rounded-xl border transition-colors ${
                  isExtreme
                    ? 'bg-rose-950/20 border-rose-500/30 text-rose-100'
                    : isHigh
                    ? 'bg-amber-950/20 border-amber-500/30 text-amber-100'
                    : 'bg-white/[0.02] border-white/[0.06] text-slate-200'
                }`}
              >
                <div className="flex items-start gap-2.5">
                  <div className={`p-1.5 rounded-lg flex-shrink-0 mt-0.5 ${
                    isExtreme ? 'text-rose-400 bg-rose-500/10' : isHigh ? 'text-amber-400 bg-amber-500/10' : 'text-cyan-400 bg-cyan-500/10'
                  }`}>
                    <Icon className="w-3.5 h-3.5" />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-semibold text-xs text-white">{alert.title}</span>
                      <span className={`text-[9px] px-1.5 py-0.2 rounded font-mono font-bold ${
                        isExtreme ? 'bg-rose-500/20 text-rose-300' : isHigh ? 'bg-amber-500/20 text-amber-300' : 'bg-white/10 text-slate-300'
                      }`}>
                        {alert.severity}
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">
                      {alert.message}
                    </p>

                    <div className="mt-2 pt-1 border-t border-white/[0.04] flex items-center justify-between text-[10px] text-slate-500 font-mono">
                      <span>Source: {alert.source}</span>
                      <span>Radius: {alert.affected_radius_km} km</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

    </div>
  );
};
