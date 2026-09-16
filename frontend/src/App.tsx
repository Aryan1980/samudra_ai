import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header/Header';
import { SamudraHero } from './components/Hero/SamudraHero';
import { MarineMap } from './components/Map/MarineMap';
import { ChatPanel } from './components/Chat/ChatPanel';
import { MarineCards } from './components/Dashboard/MarineCards';
import { RiskBadge } from './components/Dashboard/RiskBadge';
import { PFZList } from './components/Dashboard/PFZList';
import { AlertCenter } from './components/Dashboard/AlertCenter';
import { AgentTracePanel } from './components/Observability/AgentTracePanel';
import { ArchitectureView } from './components/Pages/ArchitectureView';
import { DataSourcesView } from './components/Pages/DataSourcesView';
import { MarineTrendsModal } from './components/Charts/MarineTrendsModal';

const MainContent = () => {
  const { activeTab } = useApp();

  return (
    <div className="flex-1 flex flex-col min-h-screen">
      {/* Top Editorial Metadata Navigation Header */}
      <Header />

      <main className="flex-1 p-4 md:p-6 space-y-6 max-w-[1700px] mx-auto w-full">
        
        {/* Cover Hero Banner Replicating Image 1 (Always visible or in Command Deck) */}
        <SamudraHero />

        {/* Spread 00: Command Deck */}
        {activeTab === 'command' && (
          <div className="space-y-6">
            {/* Top Row: Key Marine Metrics Cards & Deterministic Risk Gauge */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
              <div className="lg:col-span-8 flex flex-col justify-between">
                <MarineCards />
              </div>
              <div className="lg:col-span-4">
                <RiskBadge />
              </div>
            </div>

            {/* Core Interactive Section: Marine Leaflet Map (Left) + Multi-Turn Agentic Chat (Right) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 min-h-[550px]">
              {/* Map: 7 cols on desktop */}
              <div className="lg:col-span-7 h-[550px]">
                <MarineMap />
              </div>

              {/* Conversational Assistant: 5 cols on desktop */}
              <div className="lg:col-span-5 h-[550px]">
                <ChatPanel />
              </div>
            </div>

            {/* Tactical Panels: Ranked PFZs (Left) + Active Alerts (Right) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-stretch">
              <div className="min-h-72">
                <PFZList />
              </div>
              <div className="min-h-72">
                <AlertCenter />
              </div>
            </div>

            {/* Live Observability / Multi-Agent Telemetry Bar */}
            <AgentTracePanel />
          </div>
        )}

        {/* Spread 01: 24h Trends */}
        {activeTab === 'trends' && <MarineTrendsModal />}

        {/* Spread 02: Data Sources Provenance */}
        {activeTab === 'data_sources' && <DataSourcesView />}

        {/* Spread 03: System Architecture Blueprint */}
        {activeTab === 'architecture' && <ArchitectureView />}

      </main>

      {/* Editorial Colophon Footer */}
      <footer className="bg-[#FFF570] border-t-2 border-black py-4 px-4 md:px-8 text-black font-mono text-xs select-none">
        <div className="max-w-[1700px] mx-auto flex flex-col sm:flex-row justify-between items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-black inline-block"></span>
            <span className="font-bold">SAMUDRA AI // VOL. 02</span>
            <span>— OPERATIONAL DECISION-SUPPORT FOR ISRO EVALUATION</span>
          </div>
          <div className="flex items-center gap-4 text-[11px] text-black/80 font-bold">
            <span>DETERMINISTIC SAFETY GROUNDING</span>
            <span>•</span>
            <span>LAT 18.9220° N, LON 72.8347° E</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <div className="min-h-screen bg-[#FFF570] text-black flex flex-col font-mono selection:bg-black selection:text-[#FFF570]">
        <MainContent />
      </div>
    </AppProvider>
  );
}
