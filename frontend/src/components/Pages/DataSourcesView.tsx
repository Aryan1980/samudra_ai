import { useEffect, useState } from 'react';
import { Database, CheckCircle, Radio, Key, RefreshCw } from 'lucide-react';
import { api } from '../../services/api';
import { DataSourceInfo } from '../../types/marine';
import { DEFAULT_DATA_SOURCES } from '../../data/coastalData';

export const DataSourcesView = () => {
  const [sources, setSources] = useState<DataSourceInfo[]>(DEFAULT_DATA_SOURCES);
  const [loading, setLoading] = useState(false);

  const fetchSources = () => {
    setLoading(true);
    api.getDataSources()
      .then((data) => {
        if (data && data.length > 0) {
          setSources(data);
        }
      })
      .catch((err) => {
        console.warn('Backend data sources API unavailable, showing default verified provenance:', err);
        setSources(DEFAULT_DATA_SOURCES);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchSources();
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-6 text-black font-mono">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b-2 border-black pb-4">
        <div>
          <h2 className="text-4xl sm:text-6xl font-black font-bebas text-black uppercase tracking-tight">
            DATA SOURCES & SATELLITE ADAPTERS
          </h2>
          <p className="text-xs text-black/80 mt-1 uppercase">
            PROVENANCE STATUS FOR ISRO, MOSDAC, INCOIS, STORMGLASS & IMD ADAPTERS
          </p>
        </div>
        <button
          onClick={fetchSources}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-black text-[#FFF570] border-2 border-black font-bold text-xs uppercase hover:bg-transparent hover:text-black transition-colors cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>REFRESH PROVIDERS</span>
        </button>
      </div>

      {/* Integration Notice Alert */}
      <div className="border-2 border-black bg-black text-[#FFF570] p-4 text-xs flex items-start gap-3 shadow-[4px_4px_0px_0px_#000]">
        <Radio className="w-4 h-4 text-[#FFF570] flex-shrink-0 mt-0.5 animate-pulse" />
        <div>
          <strong className="block font-bold text-white uppercase text-sm">TRANSPARENT PROVENANCE & REAL-DATA INTERFACES</strong>
          <p className="text-[11px] text-[#FFF570]/90 mt-1 font-sans leading-relaxed">
            Every layer in SamudraAI is auditable. Real-world satellite raster streams (Copernicus SST & Chlorophyll), oceanographic buoy telemetry (StormGlass), and INCOIS potential fishing zones are ingested with transparent failover guards and physics-constrained consensus.
          </p>
        </div>
      </div>

      {/* Data Source Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sources.map((src) => (
          <div
            key={src.id}
            className="border-2 border-black bg-white p-4 shadow-[3px_3px_0px_0px_#000] flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-2 pb-2 border-b border-black/20">
                <div>
                  <h4 className="font-bold text-black uppercase text-xs">{src.name}</h4>
                  <span className="text-[10px] text-black/60">{src.organization} // {src.dataset_name}</span>
                </div>
                <span className="border border-black px-1.5 py-0.2 text-[9px] font-bold uppercase bg-black text-[#FFF570]">
                  {src.status}
                </span>
              </div>

              <p className="text-[11px] font-sans text-black/90 mb-3">
                {src.description}
              </p>
            </div>

            <div className="space-y-1.5 pt-2 border-t border-black/20 text-[10px]">
              <div className="flex justify-between">
                <span className="text-black/60 uppercase">UPDATE CADENCE:</span>
                <span className="font-bold text-black">{src.update_frequency}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-black/60 uppercase">PARAMETERS:</span>
                <span className="font-bold text-black truncate max-w-[200px]">{src.parameters}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-black/60 uppercase">ENV CONFIG VAR:</span>
                <span className="font-bold text-black">{src.config_env_var || 'OPEN_TELEMETRY'}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
