import React from 'react';
import { useApp } from '../../context/AppContext';

const DEMO_QUERIES = [
  'Where is the nearest PFZ?',
  'Is it safe to go fishing tomorrow morning?',
  'What are the wave and wind conditions?',
  'Show areas with high chlorophyll and favourable SST',
  'Which PFZ is safest?',
  'Find a safe route to the nearest PFZ',
  'Are there any cyclone or lightning alerts?',
  'Am I approaching a restricted area?'
];

export const DemoQueries: React.FC = () => {
  const { sendQuery, isAnalyzing } = useApp();

  return (
    <div className="border-b border-white/[0.06] bg-[#070a12]/60 px-3 py-2">
      <div className="flex gap-2 overflow-x-auto pb-0.5 no-scrollbar">
        {DEMO_QUERIES.map((q) => (
          <button
            key={q}
            disabled={isAnalyzing}
            onClick={() => sendQuery(q)}
            className="flex-shrink-0 text-left text-[11px] px-3 py-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] hover:border-white/[0.15] text-slate-300 hover:text-white transition-all duration-150 whitespace-nowrap disabled:opacity-40 cursor-pointer font-medium"
          >
            {q}
          </button>
        ))}
      </div>
    </div>
  );
};
