import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/Navigation/Sidebar';
import { MarineMap } from './components/Map/MarineMap';
import { LocationAnalyticsView } from './components/Dashboard/LocationAnalyticsView';
import { FishingSpotsView } from './components/Dashboard/FishingSpotsView';
import { AIAssistantView } from './components/Chat/AIAssistantView';
import { SettingsModal } from './components/Dashboard/SettingsModal';
import { LocationSetupView } from './components/Onboarding/LocationSetupView';
import { Sun, MapPin, Layers } from 'lucide-react';

const DashboardView: React.FC = () => {
  const { activeLocationName, weather, resetLocation } = useApp();
  const [activeNav, setActiveNav] = useState<string>('map');
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  const tempVal = weather?.temperature_c ?? 28.4;

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#151926] text-[#f1f5fb] selection:bg-[#0474C4]/30 selection:text-[#A8C4EC] font-roboto">
      
      {/* ── 1. Left Vertical Navigation Rail (Modern Image 2 Style) ── */}
      <Sidebar
        activeNav={activeNav}
        setActiveNav={setActiveNav}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      {/* ── 2. Settings & Overlays Modal ── */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />

      {/* ── 3. Main Viewport Area (Dedicated Views for each Navigation Item) ── */}
      <div className="flex-1 h-screen flex flex-col overflow-hidden relative">

        {/* ── Top Shared Minimalist Header Bar ── */}
        <header className="h-14 px-6 bg-[#181e2e]/95 backdrop-blur-md border-b border-[#5379AE]/25 flex items-center justify-between z-20 flex-shrink-0 shadow-sm">
          
          {/* Breadcrumb Path */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-[#A8C4EC]/75 font-medium">SamudraAI</span>
            <span className="text-[#5379AE]">/</span>
            <span className="text-white font-semibold tracking-tight">
              {activeNav === 'map' && 'Satellite Recon & Navigation'}
              {activeNav === 'analytics' && 'Port & Ocean Telemetry'}
              {activeNav === 'spots' && 'Potential Fishing Grounds & Seaward Routes'}
              {activeNav === 'assistant' && 'Conversational AI Helmsman'}
            </span>
          </div>

          {/* Right Header Controls */}
          <div className="flex items-center gap-4 text-xs">
            
            {/* Active Port Chip */}
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#151926] border border-[#5379AE]/30 text-[#A8C4EC] font-mono">
              <MapPin className="w-3.5 h-3.5 text-[#0474C4]" />
              <span className="truncate max-w-[180px] sm:max-w-[240px] font-medium text-white">{activeLocationName}</span>
            </div>

            {/* Date & Weather Indicator */}
            <div className="flex items-center gap-1.5 text-[#A8C4EC] font-mono hidden sm:flex">
              <Sun className="w-4 h-4 text-amber-400" />
              <span className="font-semibold text-white">{tempVal}°C</span>
              <span className="text-[#5379AE]">· Today</span>
            </div>
          </div>
        </header>

        {/* ── Viewport Contents by Active Tab ── */}
        <div className="flex-1 relative overflow-hidden">
          
          {/* Option A: Dedicated Satellite Map View (Persisted in DOM for instant cache & route persistence) */}
          <div className={activeNav === 'map' ? 'absolute inset-0 w-full h-full' : 'hidden'}>
            <MarineMap />
          </div>

          {/* Option B: Dedicated Location Analytics View */}
          {activeNav === 'analytics' && (
            <div className="h-full w-full overflow-y-auto">
              <LocationAnalyticsView />
            </div>
          )}

          {/* Option C: Dedicated Fishing Spots & Routes View */}
          {activeNav === 'spots' && (
            <div className="h-full w-full overflow-y-auto">
              <FishingSpotsView onViewOnMap={() => setActiveNav('map')} />
            </div>
          )}

          {/* Option D: Dedicated AI Assistant View */}
          {activeNav === 'assistant' && (
            <div className="h-full w-full overflow-hidden">
              <AIAssistantView />
            </div>
          )}

        </div>

      </div>

    </div>
  );
};

const MainContent: React.FC = () => {
  const { isLocationSelected } = useApp();
  return isLocationSelected ? <DashboardView /> : <LocationSetupView />;
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
