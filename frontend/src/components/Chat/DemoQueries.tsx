import { Sparkles } from 'lucide-react';
import { useApp } from '../../context/AppContext';

const DEMO_QUERIES = [
  { id: '1', text: 'Where is the nearest PFZ?', tag: 'PFZ' },
  { id: '2', text: 'Is it safe to go fishing tomorrow morning?', tag: 'SAFETY' },
  { id: '3', text: 'What are the wave and wind conditions?', tag: 'WEATHER' },
  { id: '4', text: 'Show areas with high chlorophyll and favourable SST.', tag: 'OCEAN' },
  { id: '5', text: 'Which PFZ is safest?', tag: 'RANKING' },
  { id: '6', text: 'Find a safe route to the nearest PFZ.', tag: 'ROUTE' },
  { id: '7', text: 'Are there any cyclone or lightning alerts?', tag: 'ALERTS' },
  { id: '8', text: 'Am I approaching a restricted area?', tag: 'GEOFENCE' },
];

export const DemoQueries = () => {
  const { sendQuery, isAnalyzing } = useApp();

  return (
    <div className="border-b-2 border-black bg-[#FFF570] p-2 select-none">
      <div className="flex items-center justify-between gap-2 mb-1.5 px-1 font-mono">
        <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-black font-bold">
          <Sparkles className="w-3 h-3 text-black" />
          <span>ISRO DEMO TELEMETRY QUERIES</span>
        </div>
        <span className="text-[9px] text-black/60 hidden sm:inline">1-CLICK EXECUTION</span>
      </div>

      <div className="flex gap-1.5 overflow-x-auto pb-1 font-mono text-[10px]">
        {DEMO_QUERIES.map((q) => (
          <button
            key={q.id}
            disabled={isAnalyzing}
            onClick={() => sendQuery(q.text)}
            className="flex-shrink-0 text-left px-2.5 py-1 border border-black bg-white hover:bg-black hover:text-[#FFF570] transition-colors flex items-center gap-1.5 disabled:opacity-40 cursor-pointer"
          >
            <span className="font-bold border border-current px-1 py-0.2 text-[8px] bg-black text-[#FFF570]">
              {q.tag}
            </span>
            <span className="truncate max-w-[150px] font-semibold">{q.text}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
