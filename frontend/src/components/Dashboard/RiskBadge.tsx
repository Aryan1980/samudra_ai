import React from 'react';
import { ShieldCheck, AlertTriangle, Flame, MapPin } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const RiskBadge: React.FC = () => {
  const { risk, activeLocationName } = useApp();

  if (!risk) {
    return (
      <div className="rounded-xl border border-white/[0.07] bg-[#0a0f1c] h-full flex items-center px-4 py-2.5 gap-3 animate-pulse min-h-[56px]">
        <div className="skeleton w-8 h-8 rounded-lg flex-shrink-0" />
        <div className="flex-1 space-y-1">
          <div className="skeleton h-2 rounded w-28" />
          <div className="skeleton h-3 rounded w-20" />
        </div>
      </div>
    );
  }

  const score = risk.overall_score;

  const theme = (() => {
    switch (risk.risk_level) {
      case 'LOW':
        return { stroke: '#34d399', text: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/25', label: 'Safe to Venture', Icon: ShieldCheck };
      case 'MODERATE':
        return { stroke: '#fbbf24', text: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/25', label: 'Proceed with Caution', Icon: AlertTriangle };
      case 'HIGH':
        return { stroke: '#f87171', text: 'text-rose-400', bg: 'bg-rose-500/10', border: 'border-rose-500/25', label: 'High Risk: Stay Ashore', Icon: AlertTriangle };
      default:
        return { stroke: '#f43f5e', text: 'text-rose-300', bg: 'bg-rose-950/60', border: 'border-rose-500/30', label: 'Severe Hazard', Icon: Flame };
    }
  })();

  const { Icon } = theme;
  const radius = 18;
  const circ = 2 * Math.PI * radius;
  const offset = circ - (score / 100) * (circ * 0.75);

  return (
    <div className="rounded-xl border border-white/[0.07] bg-[#0a0f1c] flex items-center gap-3 px-4 py-2.5 overflow-hidden h-full">

      {/* Mini Arc Gauge */}
      <div className="relative w-12 h-12 flex-shrink-0 flex items-center justify-center">
        <svg className="w-full h-full -rotate-[135deg]" viewBox="0 0 44 44">
          <circle cx="22" cy="22" r={radius}
            stroke="rgba(255,255,255,0.05)" strokeWidth="4" fill="none"
            strokeDasharray={`${circ * 0.75} ${circ * 0.25}`}
          />
          <circle cx="22" cy="22" r={radius}
            stroke={theme.stroke} strokeWidth="4" strokeLinecap="round" fill="none"
            strokeDasharray={`${circ * 0.75} ${circ * 0.25}`}
            style={{ strokeDashoffset: offset, transition: 'stroke-dashoffset 0.8s ease' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-mono text-[11px] font-bold text-white leading-none">{score}</span>
        </div>
      </div>

      {/* Status */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 mb-0.5">
          <span className={`flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-md border ${theme.text} ${theme.bg} ${theme.border}`}>
            <Icon className="w-3 h-3" />
            {theme.label}
          </span>
        </div>
        <div className="flex items-center gap-1 text-[10px] text-slate-500">
          <MapPin className="w-3 h-3 text-cyan-500/60" />
          <span className="truncate max-w-[160px]">{activeLocationName.split(',')[0]}</span>
          <span className="text-slate-600">· Risk score {score}/100</span>
        </div>
      </div>

      {/* Top 2 factor mini bars */}
      <div className="hidden lg:flex flex-col gap-1 flex-shrink-0 w-28">
        {risk.factors.slice(0, 2).map((f) => (
          <div key={f.factor_name} className="flex items-center gap-1.5 text-[10px]">
            <span className="text-slate-500 truncate w-14">{f.factor_name.split(' ')[0]}</span>
            <div className="flex-1 bg-white/[0.04] rounded-full h-[3px]">
              <div
                className={`h-full rounded-full ${
                  f.severity === 'LOW' ? 'bg-emerald-400' :
                  f.severity === 'MODERATE' ? 'bg-amber-400' : 'bg-rose-500'
                }`}
                style={{ width: `${Math.min(100, Math.max(4, f.score))}%` }}
              />
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
