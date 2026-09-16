import { useState, useEffect, type FormEvent } from 'react';
import {
  MapPin,
  Volume2,
  VolumeX,
  Sliders,
  Satellite
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

const LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'hi', name: 'हिन्दी (Hindi)' },
  { code: 'ta', name: 'தமிழ் (Tamil)' },
  { code: 'te', name: 'తెలుగు (Telugu)' },
  { code: 'ml', name: 'മലയാളം (Malayalam)' },
  { code: 'kn', name: 'ಕನ್ನಡ (Kannada)' },
  { code: 'bn', name: 'বাংলা (Bengali)' },
  { code: 'mr', name: 'मराठी (Marathi)' },
  { code: 'gu', name: 'ગુજરાતી (Gujarati)' },
  { code: 'or', name: 'ଓଡ଼ିଆ (Odia)' },
];

export const Header = () => {
  const {
    activeLocation,
    activeLocationName,
    language,
    activeTab,
    soundEnabled,
    coastalPresets,
    backendStatus,
    checkBackendStatus,
    setActiveLocation,
    setLanguage,
    setActiveTab,
    setSoundEnabled
  } = useApp();

  const [showCoordModal, setShowCoordModal] = useState(false);
  const [inputLat, setInputLat] = useState(activeLocation.latitude.toString());
  const [inputLon, setInputLon] = useState(activeLocation.longitude.toString());
  const [tickerTime, setTickerTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTickerTime(now.toLocaleTimeString('en-IN', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ' IST');
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleApplyCoords = (e: FormEvent) => {
    e.preventDefault();
    const lat = parseFloat(inputLat);
    const lon = parseFloat(inputLon);
    if (!isNaN(lat) && !isNaN(lon) && lat >= -90 && lat <= 90 && lon >= -180 && lon <= 180) {
      setActiveLocation({ latitude: lat, longitude: lon }, `Custom: ${lat.toFixed(4)}°N, ${lon.toFixed(4)}°E`);
      setShowCoordModal(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-[#FFF570]/95 backdrop-blur-xs border-b-2 border-black select-none">
      
      {/* Top Editorial Metadata Bar - Matching Image 1 */}
      <div className="w-full px-4 md:px-8 py-2 border-b border-black grid grid-cols-2 md:grid-cols-4 items-center gap-2 font-mono text-[10px] md:text-[12px] tracking-[0.16em] uppercase font-bold text-black">
        {/* Col 1 */}
        <div className="flex items-center gap-2">
          <Satellite className="w-3.5 h-3.5 text-black animate-pulse" />
          <span>ISRO OCEANSAT-3 // EOS-06</span>
        </div>

        {/* Col 2 */}
        <div className="text-right md:text-center">
          <span>INDIAN OCEAN EEZ // ARABIAN SEA</span>
        </div>

        {/* Col 3 */}
        <div className="hidden md:block text-center">
          <span className="border border-black px-2 py-0.5 text-[10px]">2026 EDITION // VOL. 02</span>
        </div>

        {/* Col 4 - Live Backend Status */}
        <div 
          onClick={() => checkBackendStatus()}
          title="Backend Service Status - Click to refresh connection"
          className="text-right flex items-center justify-end gap-2 font-extrabold cursor-pointer group"
        >
          <span className={`w-2 h-2 rounded-full ${
            backendStatus === 'online'
              ? 'bg-emerald-600 animate-ping'
              : backendStatus === 'connecting'
                ? 'bg-amber-500 animate-pulse'
                : 'bg-rose-600'
          }`}></span>
          <span className="group-hover:underline text-[10px] md:text-[11px]">
            {backendStatus === 'online'
              ? 'BACKEND: ACTIVE'
              : backendStatus === 'connecting'
                ? 'BACKEND: CONNECTING...'
                : 'EDGE READY (OFFLINE MODE)'}
          </span>
        </div>
      </div>

      {/* Main Operational Controls Bar */}
      <div className="px-4 md:px-8 py-2.5 flex flex-wrap items-center justify-between gap-3 font-mono text-xs">
        
        {/* Branding & Logo */}
        <div 
          className="flex items-center gap-3 cursor-pointer group"
          onClick={() => setActiveTab('command')}
        >
          <div className="w-9 h-9 border-2 border-black bg-black text-[#FFF570] flex items-center justify-center font-bebas text-xl font-bold tracking-tight">
            SA
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bebas text-2xl tracking-wide text-black leading-none">
                SAMUDRA AI
              </span>
              <span className="bg-black text-[#FFF570] px-1.5 py-0.5 text-[9px] font-bold">
                ISRO 2.0
              </span>
            </div>
            <div className="text-[10px] text-black/75 tracking-wider uppercase font-semibold">
              AGENTIC MARINE INTELLIGENCE & SAFETY
            </div>
          </div>
        </div>

        {/* Spread Navigation Tabs */}
        <div className="flex items-center border-2 border-black divide-x-2 divide-black bg-[#FFF570]">
          <button
            onClick={() => setActiveTab('command')}
            className={`px-3 py-1.5 font-bold uppercase transition-colors cursor-pointer ${
              activeTab === 'command'
                ? 'bg-black text-[#FFF570]'
                : 'text-black hover:bg-black/10'
            }`}
          >
            [00] COMMAND DECK
          </button>
          
          <button
            onClick={() => setActiveTab('trends')}
            className={`px-3 py-1.5 font-bold uppercase transition-colors cursor-pointer ${
              activeTab === 'trends'
                ? 'bg-black text-[#FFF570]'
                : 'text-black hover:bg-black/10'
            }`}
          >
            [01] 24H TRENDS
          </button>

          <button
            onClick={() => setActiveTab('data_sources')}
            className={`px-3 py-1.5 font-bold uppercase transition-colors cursor-pointer ${
              activeTab === 'data_sources'
                ? 'bg-black text-[#FFF570]'
                : 'text-black hover:bg-black/10'
            }`}
          >
            [02] DATA PROVENANCE
          </button>

          <button
            onClick={() => setActiveTab('architecture')}
            className={`px-3 py-1.5 font-bold uppercase transition-colors cursor-pointer ${
              activeTab === 'architecture'
                ? 'bg-black text-[#FFF570]'
                : 'text-black hover:bg-black/10'
            }`}
          >
            [03] ARCHITECTURE
          </button>
        </div>

        {/* Tactical Controls: Coastal Presets, Coordinates, Language, Audio */}
        <div className="flex items-center gap-2">
          
          {/* Coastal Harbor Selector */}
          <div className="flex items-center border-2 border-black px-2 py-1 bg-white/70">
            <MapPin className="w-3.5 h-3.5 text-black mr-1 flex-shrink-0" />
            <select
              value={coastalPresets.find(p => p.name.includes(activeLocationName.split(',')[0]))?.id || ''}
              onChange={(e) => {
                const selected = coastalPresets.find(p => p.id === e.target.value);
                if (selected) {
                  setActiveLocation({ latitude: selected.latitude, longitude: selected.longitude }, `${selected.name}, ${selected.state}`);
                }
              }}
              className="bg-transparent text-black outline-none cursor-pointer max-w-[130px] font-bold text-[11px]"
            >
              <option value="" disabled>Select Harbor</option>
              {coastalPresets.map((p) => (
                <option key={p.id} value={p.id} className="bg-[#FFF570] text-black">
                  {p.name}
                </option>
              ))}
            </select>

            <button
              title="Enter custom latitude/longitude"
              onClick={() => setShowCoordModal(true)}
              className="ml-1.5 text-black hover:bg-black hover:text-[#FFF570] px-1 py-0.5 border border-black cursor-pointer font-bold text-[10px]"
            >
              +POS
            </button>
          </div>

          {/* Language Selector */}
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="border-2 border-black px-2 py-1 text-[11px] font-bold bg-white/70 text-black outline-none cursor-pointer"
          >
            {LANGUAGES.map((l) => (
              <option key={l.code} value={l.code} className="bg-[#FFF570] text-black">
                {l.name}
              </option>
            ))}
          </select>

          {/* Voice Toggle */}
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            title={soundEnabled ? "Mute voice synthesis" : "Enable voice synthesis"}
            className={`border-2 border-black px-2.5 py-1 font-bold text-[10px] uppercase flex items-center gap-1 cursor-pointer transition-colors ${
              soundEnabled
                ? 'bg-black text-[#FFF570]'
                : 'bg-white/70 text-black hover:bg-black/10'
            }`}
          >
            {soundEnabled ? <Volume2 className="w-3.5 h-3.5 text-[#FFF570]" /> : <VolumeX className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{soundEnabled ? 'VOICE ON' : 'VOICE OFF'}</span>
          </button>

          {/* Time Display */}
          <div className="hidden lg:block border border-black px-2 py-1 text-[10px] font-bold bg-black text-[#FFF570]">
            {tickerTime || '18:30:00 IST'}
          </div>

        </div>

      </div>

      {/* Coordinate Modal */}
      {showCoordModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="border-2 border-black bg-[#FFF570] p-6 max-w-sm w-full shadow-[6px_6px_0px_0px_#000000] relative">
            <div className="flex justify-between items-center border-b-2 border-black pb-2 mb-4">
              <h3 className="text-sm font-bold text-black uppercase flex items-center gap-2">
                <Sliders className="w-4 h-4 text-black" /> CUSTOM MARINE COORDINATE
              </h3>
              <button 
                onClick={() => setShowCoordModal(false)}
                className="font-bold text-black hover:bg-black hover:text-[#FFF570] px-1 border border-black cursor-pointer"
              >
                X
              </button>
            </div>
            
            <p className="text-xs text-black/80 mb-4 font-mono">
              SPECIFY DECIMAL LATITUDE & LONGITUDE FOR INDIAN OCEAN SATELLITE INTERSECTION:
            </p>

            <form onSubmit={handleApplyCoords} className="space-y-4 font-mono text-xs">
              <div>
                <label className="block text-black font-bold uppercase mb-1">LATITUDE (°N):</label>
                <input
                  type="number"
                  step="0.0001"
                  value={inputLat}
                  onChange={(e) => setInputLat(e.target.value)}
                  className="w-full border-2 border-black p-2 bg-white text-black font-bold outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-black font-bold uppercase mb-1">LONGITUDE (°E):</label>
                <input
                  type="number"
                  step="0.0001"
                  value={inputLon}
                  onChange={(e) => setInputLon(e.target.value)}
                  className="w-full border-2 border-black p-2 bg-white text-black font-bold outline-none"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCoordModal(false)}
                  className="border-2 border-black px-4 py-1.5 font-bold uppercase hover:bg-black/10 cursor-pointer"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  className="border-2 border-black px-4 py-1.5 bg-black text-[#FFF570] font-bold uppercase hover:bg-transparent hover:text-black cursor-pointer"
                >
                  APPLY VECTOR
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </header>
  );
};
