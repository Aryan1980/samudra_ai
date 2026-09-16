import React, { useEffect, useState } from 'react';
import { Database, CheckCircle, Radio, ExternalLink, Key, RefreshCw } from 'lucide-react';
import { api } from '../../services/api';
import { DataSourceInfo } from '../../types/marine';

export const DataSourcesView: React.FC = () => {
  const [sources, setSources] = useState<DataSourceInfo[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSources = () => {
    setLoading(true);
    api.getDataSources()
      .then((data) => setSources(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchSources();
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6 text-slate-100">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-bold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-200">
            National Marine Data Sources & Provider Adapters
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Provenance status for ISRO, MOSDAC, INCOIS, and IMD integration adapters
          </p>
        </div>
        <button
          onClick={fetchSources}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded-lg text-xs text-slate-200 transition-colors cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Providers</span>
        </button>
      </div>

      {/* Integration Notice Alert */}
      <div className="bg-amber-950/40 border border-amber-800/80 rounded-xl p-4 text-xs text-amber-200 flex items-start gap-3 shadow-md">
        <Radio className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5 animate-pulse" />
        <div>
          <strong className="block font-bold text-amber-300">Demo Data Guarantee (Offline ISRO Hackathon Evaluation)</strong>
          <p className="text-[11px] text-amber-200/90 mt-0.5 leading-relaxed">
            In accordance with the hackathon specification, all data endpoints currently operate in high-fidelity <strong>ACTIVE_DEMO</strong> mode. No fabricated data is ever misrepresented as live feeds. Real satellite and meteorological APIs can be connected by simply providing API tokens in the environment configuration without modifying backend code.
          </p>
        </div>
      </div>

      {/* Data Source Cards Table */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sources.map((src) => (
          <div
            key={src.id}
            className="bg-slate-900/80 border border-slate-800 hover:border-cyan-800/70 rounded-xl p-4 transition-all shadow-md flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <h3 className="font-bold text-sm text-slate-100">{src.name}</h3>
                  <span className="text-[11px] text-cyan-400">{src.organization}</span>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-950 text-amber-300 border border-amber-700/60">
                  {src.status}
                </span>
              </div>

              <div className="space-y-1.5 text-xs text-slate-300 mt-3">
                <div>
                  <span className="text-slate-500 text-[10px] block">Dataset:</span>
                  <p className="font-medium text-[11px]">{src.dataset_name}</p>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] block">Measured Parameters:</span>
                  <p className="text-[11px] text-slate-400">{src.parameters}</p>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] block">Description:</span>
                  <p className="text-[11px] text-slate-400 leading-relaxed">{src.description}</p>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-[11px]">
              <div className="flex items-center gap-1 text-slate-400">
                <Key className="w-3 h-3 text-cyan-400" />
                <span className="font-mono text-[10px]">{src.config_env_var}</span>
              </div>
              <a
                href={src.official_portal}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300 font-medium"
              >
                <span>Official Portal</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* How to Connect Real APIs */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-3">
        <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
          <Key className="w-4 h-4 text-cyan-400" />
          How to Connect Live ISRO / INCOIS / IMD APIs
        </h3>
        <p className="text-xs text-slate-400 leading-relaxed">
          The provider abstraction layer (<code className="bg-slate-950 px-1 py-0.5 rounded text-cyan-300">backend/app/providers/base.py</code>) decouples data retrieval from the agentic reasoning engine. To activate live data:
        </p>
        <ol className="list-decimal list-inside text-xs text-slate-300 space-y-1 pl-1">
          <li>Copy <code className="bg-slate-950 px-1 py-0.5 rounded text-cyan-300">.env.example</code> to <code className="bg-slate-950 px-1 py-0.5 rounded text-cyan-300">.env</code> in the project root.</li>
          <li>Set <code className="bg-slate-950 px-1 py-0.5 rounded text-cyan-300">OCEAN_API_KEY</code> for INCOIS WFS services.</li>
          <li>Set <code className="bg-slate-950 px-1 py-0.5 rounded text-cyan-300">SATELLITE_API_KEY</code> for MOSDAC Oceansat-3 Earth Observation products.</li>
          <li>Set <code className="bg-slate-950 px-1 py-0.5 rounded text-cyan-300">WEATHER_API_KEY</code> for IMD coastal squall and radar feeds.</li>
          <li>Restart the backend service. The provider adapter will detect the credentials and upgrade from <code className="text-amber-400 font-mono">ACTIVE_DEMO</code> to <code className="text-emerald-400 font-mono">LIVE</code>.</li>
        </ol>
      </div>

    </div>
  );
};
