import { Shield, AlertTriangle, CheckCircle2, Activity } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const RiskBadge = () => {
  const { risk } = useApp();

  if (!risk) {
    return (
      <div className="border-2 border-black bg-[#FFF570]/90 p-4 text-xs text-black flex items-center justify-center h-full min-h-[140px] font-mono">
        <Activity className="w-4 h-4 text-black animate-spin mr-2" />
        <span>EVALUATING DETERMINISTIC SAFETY MATRIX...</span>
      </div>
    );
  }

  const score = risk.overall_score;

  const getTheme = (level: string) => {
    switch (level) {
      case 'LOW':
        return {
          status: 'SAFE TO SAIL',
          badgeClass: 'bg-black text-[#FFF570]',
          icon: CheckCircle2,
          recommendation: 'All oceanographic and meteorological parameters within safe navigational limits.'
        };
      case 'MODERATE':
        return {
          status: 'PROCEED WITH CAUTION',
          badgeClass: 'bg-black text-[#FFF570]',
          icon: AlertTriangle,
          recommendation: 'Marginal swell or wind conditions detected. Recommend small craft remain within coastal bounds.'
        };
      case 'HIGH':
        return {
          status: 'HIGH RISK // AVOID OFFSHORE',
          badgeClass: 'bg-black text-rose-300',
          icon: AlertTriangle,
          recommendation: 'Adverse sea conditions. Wave or wind speed exceeds safe operating thresholds.'
        };
      default:
        return {
          status: 'EXTREME DANGER // NO SAIL',
          badgeClass: 'bg-black text-rose-400 animate-pulse',
          icon: Shield,
          recommendation: 'Gale or cyclone warning active. Immediate harbor return advised.'
        };
    }
  };

  const theme = getTheme(risk.risk_level);
  const IconComponent = theme.icon;

  return (
    <div className="border-2 border-black bg-[#FFF570]/90 p-4 flex flex-col justify-between h-full font-mono shadow-[3px_3px_0px_0px_#000]">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-black pb-2 mb-2">
        <div className="flex items-center gap-1.5 font-bold text-xs uppercase text-black">
          <IconComponent className="w-4 h-4 text-black" />
          <span>DETERMINISTIC SAFETY MATRIX</span>
        </div>
        <span className="text-[9px] border border-black px-1.5 py-0.5 font-bold bg-white/70">
          PHYS_ENGINE
        </span>
      </div>

      {/* Main Score Display */}
      <div className="flex items-baseline justify-between my-2">
        <div>
          <div className="text-[10px] text-black/70 uppercase font-semibold">OVERALL RISK INDEX</div>
          <div className="flex items-baseline gap-1">
            <span className="font-bebas text-5xl font-black text-black leading-none">
              {score}
            </span>
            <span className="text-black/60 text-sm font-bold">/ 100</span>
          </div>
        </div>

        <div className={`px-3 py-1.5 text-xs font-bold font-mono uppercase border-2 border-black ${theme.badgeClass}`}>
          {theme.status}
        </div>
      </div>

      {/* Multi-Factor Breakdown */}
      <div className="space-y-1.5 my-2 border-t border-b border-black/30 py-2 text-[10px]">
        {risk.factors && risk.factors.length > 0 ? (
          <div className="grid grid-cols-2 gap-x-4 gap-y-1">
            {risk.factors.slice(0, 4).map((f, i) => (
              <div key={i} className="flex justify-between">
                <span className="truncate uppercase">{f.factor_name}:</span>
                <span className="font-bold">{f.score}/100</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-[10px] text-black/70">ALL METEOROLOGICAL FACTORS EVALUATED</div>
        )}
      </div>

      {/* Recommendation Note */}
      <div className="text-[10px] text-black/85 leading-tight italic">
        "{risk.recommendation || theme.recommendation}"
      </div>
    </div>
  );
};
