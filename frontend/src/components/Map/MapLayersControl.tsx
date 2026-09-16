import { useState } from 'react';
import { Layers, Fish, Thermometer, Droplets, Waves, Wind, ShieldAlert, Navigation, AlertTriangle, Check, CloudRain, Cloud } from 'lucide-react';
import { useApp } from '../../context/AppContext';

const AVAILABLE_LAYERS = [
  { id: 'pfz', label: 'Potential Fishing Zones', icon: Fish },
  { id: 'sst', label: 'Sea Surface Temp (SST)', icon: Thermometer },
  { id: 'chlorophyll', label: 'Chlorophyll-a Plume', icon: Droplets },
  { id: 'waves', label: 'Wave Height & Swell', icon: Waves },
  { id: 'wind', label: 'Wind Field Vectors', icon: Wind },
  { id: 'owm_precip', label: 'Live Weather Radar (OWM)', icon: CloudRain },
  { id: 'owm_clouds', label: 'Satellite Cloud Cover (OWM)', icon: Cloud },
  { id: 'imbl', label: 'IMBL Maritime Border', icon: ShieldAlert },
  { id: 'mpas', label: 'Marine Protected Areas', icon: AlertTriangle },
  { id: 'restricted', label: 'Naval / Oil Geofences', icon: AlertTriangle },
  { id: 'route', label: 'Navigational Routes', icon: Navigation },
];

export const MapLayersControl = () => {
  const { activeMapLayers, toggleMapLayer } = useApp();
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="absolute top-4 right-4 z-[400] border-2 border-black bg-[#FFF570] shadow-[3px_3px_0px_0px_#000] text-xs font-mono select-none">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between gap-3 px-3 py-2 bg-black text-[#FFF570] font-bold uppercase cursor-pointer"
      >
        <div className="flex items-center gap-2">
          <Layers className="w-3.5 h-3.5 text-[#FFF570]" />
          <span>MAP OVERLAYS ({activeMapLayers.length})</span>
        </div>
        <span className="border border-[#FFF570] px-1 py-0.2 text-[9px]">
          {isExpanded ? '[-] HIDE' : '[+] SHOW'}
        </span>
      </button>

      {isExpanded && (
        <div className="p-2 space-y-1 max-h-80 overflow-y-auto min-w-[220px] bg-[#FFF570] border-t-2 border-black divide-y divide-black/20">
          {AVAILABLE_LAYERS.map((layer) => {
            const Icon = layer.icon;
            const isChecked = activeMapLayers.includes(layer.id);
            return (
              <div
                key={layer.id}
                onClick={() => toggleMapLayer(layer.id)}
                className={`flex items-center justify-between p-1.5 transition-colors cursor-pointer ${
                  isChecked
                    ? 'bg-black text-[#FFF570] font-bold'
                    : 'text-black hover:bg-black/10'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Icon className="w-3.5 h-3.5" />
                  <span className="text-[11px] uppercase tracking-wider">{layer.label}</span>
                </div>
                <div className={`w-3.5 h-3.5 border border-current flex items-center justify-center ${
                  isChecked ? 'bg-[#FFF570] text-black' : 'bg-transparent'
                }`}>
                  {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
