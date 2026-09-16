import React, { useState } from 'react';
import {
  Compass,
  Navigation,
  Anchor,
  Crosshair,
  MapPin,
  ArrowRight,
  AlertCircle,
  Loader2,
  Waves,
  ShieldCheck,
  Fish,
  Terminal,
  LayoutGrid,
  Check
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Coordinates } from '../../types/marine';

interface HarborOption {
  id: string;
  name: string;
  state: string;
  sea: string;
  latitude: number;
  longitude: number;
  species: string[];
}

const MAJOR_HARBORS: HarborOption[] = [
  {
    id: 'kochi',
    name: 'Kochi (Cochin)',
    state: 'Kerala',
    sea: 'Arabian Sea',
    latitude: 9.9312,
    longitude: 76.2673,
    species: ['Oil Sardine', 'Indian Mackerel', 'Yellowfin Tuna']
  },
  {
    id: 'mumbai',
    name: 'Sassoon Dock, Mumbai',
    state: 'Maharashtra',
    sea: 'Arabian Sea',
    latitude: 18.9168,
    longitude: 72.8258,
    species: ['Bombay Duck', 'Silver Pomfret', 'Penaeid Prawn']
  },
  {
    id: 'chennai',
    name: 'Royapuram, Chennai',
    state: 'Tamil Nadu',
    sea: 'Bay of Bengal',
    latitude: 13.1147,
    longitude: 80.2974,
    species: ['Skipjack Tuna', 'Seer Fish', 'Ribbon Fish']
  },
  {
    id: 'visakhapatnam',
    name: 'Visakhapatnam Harbor',
    state: 'Andhra Pradesh',
    sea: 'Bay of Bengal',
    latitude: 17.6974,
    longitude: 83.2986,
    species: ['Yellowfin Tuna', 'Mackerel', 'Tiger Prawn']
  },
  {
    id: 'porbandar',
    name: 'Porbandar Fishing Port',
    state: 'Gujarat',
    sea: 'Arabian Sea',
    latitude: 21.6417,
    longitude: 69.6093,
    species: ['Ribbon Fish', 'Croaker', 'Cuttlefish']
  },
  {
    id: 'mangalore',
    name: 'Old Mangalore Port',
    state: 'Karnataka',
    sea: 'Arabian Sea',
    latitude: 12.8654,
    longitude: 74.8426,
    species: ['Indian Mackerel', 'Anchovy', 'Squid']
  },
  {
    id: 'panaji',
    name: 'Malim Jetty, Panaji',
    state: 'Goa',
    sea: 'Arabian Sea',
    latitude: 15.5085,
    longitude: 73.8322,
    species: ['Mackerel', 'Sardines', 'Kingfish']
  },
  {
    id: 'paradip',
    name: 'Paradip Fishing Harbor',
    state: 'Odisha',
    sea: 'Bay of Bengal',
    latitude: 20.3165,
    longitude: 86.6114,
    species: ['Hilsa', 'Pomfret', 'Sea Catfish']
  },
  {
    id: 'kanyakumari',
    name: 'Chinnamuttom, Kanyakumari',
    state: 'Tamil Nadu',
    sea: 'Indian Ocean Confluence',
    latitude: 8.0934,
    longitude: 77.5614,
    species: ['Tuna', 'Reef Fish', 'Anchovies']
  },
  {
    id: 'port_blair',
    name: 'Junglighat, Port Blair',
    state: 'Andaman & Nicobar',
    sea: 'Andaman Sea',
    latitude: 11.6643,
    longitude: 92.7302,
    species: ['Bigeye Tuna', 'Snapper', 'Mahi-Mahi']
  }
];

export const LocationSetupView: React.FC = () => {
  const { confirmLocation } = useApp();

  const [activeTab, setActiveTab] = useState<'harbor' | 'gps' | 'manual'>('harbor');
  const [selectedHarbor, setSelectedHarbor] = useState<HarborOption>(MAJOR_HARBORS[0]);
  const [gpsStatus, setGpsStatus] = useState<'idle' | 'locating' | 'success' | 'error'>('idle');
  const [gpsCoords, setGpsCoords] = useState<Coordinates | null>(null);
  const [gpsErrorMsg, setGpsErrorMsg] = useState<string>('');

  const [manualLat, setManualLat] = useState<string>('9.9312');
  const [manualLon, setManualLon] = useState<string>('76.2673');
  const [manualError, setManualError] = useState<string>('');

  const scrollToSelection = () => {
    document.getElementById('departure-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleDetectGPS = () => {
    if (!navigator.geolocation) {
      setGpsStatus('error');
      setGpsErrorMsg('Browser geolocation is not supported on this device.');
      return;
    }

    setGpsStatus('locating');
    setGpsErrorMsg('');

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords: Coordinates = {
          latitude: parseFloat(position.coords.latitude.toFixed(4)),
          longitude: parseFloat(position.coords.longitude.toFixed(4))
        };
        setGpsCoords(coords);
        setGpsStatus('success');
      },
      (error) => {
        setGpsStatus('error');
        if (error.code === error.PERMISSION_DENIED) {
          setGpsErrorMsg('Location permission was denied. You can select a coastal harbor or enter coordinates manually.');
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          setGpsErrorMsg('Satellite GPS signal unavailable. Please select a harbor or enter coordinates.');
        } else {
          setGpsErrorMsg(`GPS acquisition timed out (${error.message}).`);
        }
      },
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 30000 }
    );
  };

  const handleConfirmGPS = () => {
    if (gpsCoords) {
      confirmLocation(gpsCoords, `GPS Fix (${gpsCoords.latitude}°N, ${gpsCoords.longitude}°E)`);
    }
  };

  const handleConfirmHarbor = (harbor: HarborOption) => {
    confirmLocation(
      { latitude: harbor.latitude, longitude: harbor.longitude },
      `${harbor.name}, ${harbor.state}`
    );
  };

  const handleConfirmManual = (e: React.FormEvent) => {
    e.preventDefault();
    const lat = parseFloat(manualLat);
    const lon = parseFloat(manualLon);

    if (isNaN(lat) || isNaN(lon)) {
      setManualError('Please enter valid numerical coordinates.');
      return;
    }

    if (lat < -90 || lat > 90 || lon < -180 || lon > 180) {
      setManualError('Latitude must be between -90 and 90, Longitude between -180 and 180.');
      return;
    }

    setManualError('');
    confirmLocation({ latitude: lat, longitude: lon }, `Custom: ${lat.toFixed(4)}°N, ${lon.toFixed(4)}°E`);
  };

  return (
    <div className="min-h-screen text-[#f1f5fb] flex flex-col justify-between selection:bg-[#0474C4]/30 selection:text-[#A8C4EC] bg-[#151926]">
      
      {/* ── Ambient Sapphire Nightfall Whisper Backdrop ── */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-gradient-to-b from-[#06457F]/20 via-[#0474C4]/10 to-transparent rounded-full blur-[140px]" />
        <div className="absolute top-1/3 left-10 w-[450px] h-[450px] bg-[#2C444C]/20 rounded-full blur-[130px]" />
        <div className="absolute top-1/2 right-10 w-[500px] h-[500px] bg-[#06457F]/15 rounded-full blur-[140px]" />
      </div>

      {/* ── Top Navigation Bar ── */}
      <header className="relative z-20 border-b border-[#5379AE]/20 bg-[#191F30]/90 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#0474C4] to-[#06457F] flex items-center justify-center text-white shadow-[0_0_15px_rgba(4,116,196,0.35)] border border-[#5379AE]/30">
              <Compass className="w-4 h-4 text-white stroke-[2.5]" />
            </div>
            <div>
              <div className="font-heading font-bold text-base tracking-tight text-white flex items-center gap-1">
                Samudra<span className="text-[#A8C4EC] font-semibold">AI</span>
              </div>
              <p className="text-[10px] text-[#5379AE] font-mono tracking-wider">SAPPHIRE NIGHTFALL WHISPER</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#0474C4] animate-pulse" />
            <span className="text-xs font-mono text-[#A8C4EC]">Maritime Reconnaissance</span>
          </div>
        </div>
      </header>

      {/* ── Main Content Container ── */}
      <main className="relative z-10 max-w-6xl mx-auto w-full px-6 py-12 space-y-20">

        {/* ── Section 1: Hero Editorial Branding ── */}
        <section className="text-center pt-12 pb-4 space-y-6">

          {/* Editorial Serif Headline with warm soft coral accent */}
          <h1 className="font-editorial text-5xl sm:text-7xl font-normal text-white leading-[1.1] tracking-tight max-w-3xl mx-auto">
            Oceans are <span className="italic text-[#e59883] font-editorial">wild</span>.<br />
            Intelligence is sovereign.
          </h1>

          <p className="text-base sm:text-lg text-[#A8C4EC]/85 max-w-2xl mx-auto font-light leading-relaxed">
            Harnessing real-time satellite oceanography, physical wave dynamics, and biological potential fishing zones for safe and high-yield Indian Ocean voyages.
          </p>

          {/* Professional Signature Button (Matching Reference Image) */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-3">
            <button
              onClick={scrollToSelection}
              className="btn-signature group"
            >
              <span>Set Departure Port & Launch</span>
              <span className="text-[#A8C4EC] transition-transform duration-200 group-hover:translate-x-1 font-sans">→</span>
            </button>
          </div>

        </section>

        {/* ── Section 2: Marine Satellite Hero Banner ── */}
        <section className="relative rounded-2xl overflow-hidden border border-[#5379AE]/30 shadow-[0_0_50px_rgba(4,116,196,0.15)] bg-[#191F30]">
          <div className="relative h-64 sm:h-80 w-full overflow-hidden">
            <img
              src="/marine_ocean_satellite.jpg"
              alt="Deep Sapphire Ocean Currents"
              className="w-full h-full object-cover object-center opacity-85 brightness-95"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#151926] via-transparent to-[#151926]/40" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#151926]/80 via-transparent to-[#151926]/80" />

            {/* Floating Telemetry Chips on Image */}
            <div className="absolute top-4 left-4 sm:top-6 sm:left-6 flex flex-wrap gap-2.5">
              <div className="px-3 py-1.5 rounded-lg bg-[#151926]/80 backdrop-blur-md border border-[#5379AE]/30 text-[11px] font-mono text-[#A8C4EC] flex items-center gap-1.5">
                <Waves className="w-3.5 h-3.5 text-[#0474C4]" />
                <span>Oceansat-3 Multi-spectral Swath</span>
              </div>
              <div className="px-3 py-1.5 rounded-lg bg-[#151926]/80 backdrop-blur-md border border-[#5379AE]/30 text-[11px] font-mono text-emerald-300 flex items-center gap-1.5">
                <Fish className="w-3.5 h-3.5 text-emerald-400" />
                <span>8 Ranked Seaward PFZ Zones</span>
              </div>
            </div>

            <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 max-w-lg">
              <span className="text-[10px] font-mono text-[#A8C4EC] tracking-wider uppercase block">Real-time telemetry</span>
              <p className="text-sm font-heading font-medium text-white mt-0.5">
                Sub-kilometer SST thermal fronts & coastal upwelling convergence zones calibrated every 6 hours.
              </p>
            </div>

            <div className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 hidden sm:flex items-center gap-3">
              <div className="text-right font-mono">
                <div className="text-xs text-[#5379AE]">Mean Wave Height</div>
                <div className="text-base font-bold text-[#A8C4EC]">1.2 m <span className="text-emerald-400 text-xs font-normal">Safe</span></div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Section 3: Feature Capabilities (Two Modalities in Sapphire Scheme) ── */}
        <section id="capabilities" className="space-y-6 pt-4">
          <div className="text-center space-y-2">
            <h2 className="font-editorial text-3xl sm:text-4xl text-white font-normal">
              Two Operating Modalities
            </h2>
            <p className="text-xs sm:text-sm text-[#A8C4EC]/75 max-w-xl mx-auto font-light">
              Choose between fully autonomous satellite oceanography synthesis or hand-steered captain's navigation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Card 1: Autonomous Satellite AI */}
            <div className="p-7 rounded-2xl bg-[#1d2334] border border-[#5379AE]/25 hover:border-[#0474C4]/50 transition-all space-y-5 flex flex-col justify-between shadow-xl">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-9 h-9 rounded-xl bg-[#262B40] border border-[#5379AE]/30 flex items-center justify-center text-[#A8C4EC] font-mono text-sm font-bold">
                    &gt;_
                  </div>
                  <span className="px-2.5 py-0.5 rounded text-[10px] font-mono tracking-wider bg-[#261c1b] text-[#e59883] border border-[#e59883]/30 font-semibold">
                    DEFAULT
                  </span>
                </div>

                <div>
                  <h3 className="font-editorial text-2xl text-white font-normal tracking-tight">
                    Satellite AI drives
                  </h3>
                  <div className="font-mono text-[10px] text-[#A8C4EC]/70 tracking-wider mt-1 uppercase">
                    ISRO MOSDAC & INCOIS — THE DEFAULT
                  </div>
                </div>

                <ul className="space-y-2.5 pt-2 text-xs text-[#f1f5fb]/80 font-light">
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-[#0474C4] flex-shrink-0 mt-0.5" />
                    <span>Autonomous SST & Chlorophyll-a PFZ detection</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-[#0474C4] flex-shrink-0 mt-0.5" />
                    <span>Offshore barrier & coastline safety buffers</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-[#0474C4] flex-shrink-0 mt-0.5" />
                    <span>Deterministic physical risk score (0 to 100) based on waves & wind</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-[#0474C4] flex-shrink-0 mt-0.5" />
                    <span>No manual math needed — zero latency situational telemetry</span>
                  </li>
                </ul>
              </div>

              <div className="pt-4 border-t border-[#5379AE]/20">
                <button
                  onClick={scrollToSelection}
                  className="text-xs font-mono text-[#A8C4EC] hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer group"
                >
                  <span>Calibrate departure port</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>

            {/* Card 2: Captain Navigates */}
            <div className="p-7 rounded-2xl bg-[#1d2334] border border-[#5379AE]/25 hover:border-[#0474C4]/50 transition-all space-y-5 flex flex-col justify-between shadow-xl">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-9 h-9 rounded-xl bg-[#262B40] border border-[#5379AE]/30 flex items-center justify-center text-[#A8C4EC]">
                    <LayoutGrid className="w-4 h-4" />
                  </div>
                  <span className="px-2.5 py-0.5 rounded text-[10px] font-mono tracking-wider bg-[#06457F]/40 text-[#A8C4EC] border border-[#5379AE]/40 font-semibold">
                    TACTICAL
                  </span>
                </div>

                <div>
                  <h3 className="font-editorial text-2xl text-white font-normal tracking-tight">
                    You drive
                  </h3>
                  <div className="font-mono text-[10px] text-[#A8C4EC]/70 tracking-wider mt-1 uppercase">
                    THE HELM — WHEN YOU WANT CONTROL
                  </div>
                </div>

                <ul className="space-y-2.5 pt-2 text-xs text-[#f1f5fb]/80 font-light">
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-[#5379AE] flex-shrink-0 mt-0.5" />
                    <span>Inspect seaward waypoints on interactive satellite imagery</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-[#5379AE] flex-shrink-0 mt-0.5" />
                    <span>Adjust craft risk limits for trawlers, gillnetters, and country craft</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-[#5379AE] flex-shrink-0 mt-0.5" />
                    <span>Consult the conversational AI Assistant in voice or text</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-[#5379AE] flex-shrink-0 mt-0.5" />
                    <span>Explore custom GPS coordinates across Indian Ocean basins</span>
                  </li>
                </ul>
              </div>

              <div className="pt-4 border-t border-[#5379AE]/20">
                <button
                  onClick={scrollToSelection}
                  className="text-xs font-mono text-[#A8C4EC] hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer group"
                >
                  <span>Take the helm</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>

          </div>
        </section>

        {/* ── Section 4: Departure Port Calibration ── */}
        <section id="departure-section" className="space-y-6 pt-6">
          
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#06457F]/30 border border-[#5379AE]/30 text-[#A8C4EC] text-xs font-mono">
              <Crosshair className="w-3.5 h-3.5 text-[#0474C4]" />
              <span>Step 1 • Calibrate Departure Port</span>
            </div>
            <h2 className="font-editorial text-3xl sm:text-4xl text-white font-normal">
              Where is your vessel departing from?
            </h2>
            <p className="text-xs sm:text-sm text-[#A8C4EC]/75 max-w-lg mx-auto font-light">
              Select your coastal harbor, acquire your live GPS fix, or provide coordinates to initialize ocean telemetry.
            </p>
          </div>

          {/* Calibration Card */}
          <div className="rounded-2xl shadow-2xl overflow-hidden bg-[#1d2334] border border-[#5379AE]/25">
            
            {/* Tabs */}
            <div className="flex border-b border-[#5379AE]/20 bg-[#151926]/70 p-1.5 gap-1.5 text-xs font-medium">
              <button
                onClick={() => setActiveTab('harbor')}
                className={`flex-1 py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  activeTab === 'harbor'
                    ? 'bg-[#06457F]/50 text-white font-semibold border border-[#0474C4]/50 shadow-sm'
                    : 'text-[#A8C4EC]/70 hover:text-white hover:bg-white/[0.02]'
                }`}
              >
                <Anchor className="w-3.5 h-3.5" />
                <span>Coastal Harbors</span>
              </button>

              <button
                onClick={() => {
                  setActiveTab('gps');
                  if (gpsStatus === 'idle') handleDetectGPS();
                }}
                className={`flex-1 py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  activeTab === 'gps'
                    ? 'bg-[#06457F]/50 text-white font-semibold border border-[#0474C4]/50 shadow-sm'
                    : 'text-[#A8C4EC]/70 hover:text-white hover:bg-white/[0.02]'
                }`}
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>Live Vessel GPS</span>
              </button>

              <button
                onClick={() => setActiveTab('manual')}
                className={`flex-1 py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  activeTab === 'manual'
                    ? 'bg-[#06457F]/50 text-white font-semibold border border-[#0474C4]/50 shadow-sm'
                    : 'text-[#A8C4EC]/70 hover:text-white hover:bg-white/[0.02]'
                }`}
              >
                <MapPin className="w-3.5 h-3.5" />
                <span>Manual Coordinates</span>
              </button>
            </div>

            {/* Mode 1: Major Coastal Harbors */}
            {activeTab === 'harbor' && (
              <div className="p-6">
                <div className="text-xs text-[#A8C4EC] mb-4 flex items-center justify-between font-mono">
                  <span>Select departure port along the Indian coastline:</span>
                  <span className="text-[#0474C4] font-semibold">{MAJOR_HARBORS.length} Major Harbors</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[360px] overflow-y-auto pr-1">
                  {MAJOR_HARBORS.map((h) => {
                    const isSelected = selectedHarbor.id === h.id;
                    return (
                      <div
                        key={h.id}
                        onClick={() => setSelectedHarbor(h)}
                        onDoubleClick={() => handleConfirmHarbor(h)}
                        className={`p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                          isSelected
                            ? 'bg-[#06457F]/30 border-[#0474C4] shadow-[0_0_16px_rgba(4,116,196,0.2)]'
                            : 'bg-[#151926]/50 border-[#5379AE]/20 hover:bg-[#151926]/90 hover:border-[#5379AE]/40'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <div className="font-semibold text-xs text-white flex items-center gap-1.5">
                              <Anchor className={`w-3.5 h-3.5 ${isSelected ? 'text-[#0474C4]' : 'text-[#5379AE]'}`} />
                              <span>{h.name}</span>
                            </div>
                            <div className="text-[11px] text-[#A8C4EC]/75 mt-0.5">
                              {h.state} • <span className="text-[#5379AE]">{h.sea}</span>
                            </div>
                          </div>

                          <span className="font-mono text-[10px] text-[#A8C4EC] px-2 py-0.5 rounded bg-[#262B40] border border-[#5379AE]/25">
                            {h.latitude.toFixed(2)}°N, {h.longitude.toFixed(2)}°E
                          </span>
                        </div>

                        <div className="mt-2.5 pt-2 border-t border-[#5379AE]/15 flex items-center justify-between text-[10px]">
                          <span className="text-[#A8C4EC]/80 flex items-center gap-1">
                            <Fish className="w-3 h-3 text-emerald-400" />
                            <span className="truncate max-w-[160px] text-slate-300">{h.species.slice(0, 2).join(', ')}</span>
                          </span>
                          
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleConfirmHarbor(h);
                            }}
                            className="btn-signature btn-signature-sm !py-1 !px-3 !text-[10px] group"
                          >
                            <span>Select</span>
                            <span className="transition-transform group-hover:translate-x-0.5">→</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Bottom Confirm Bar (Image 3 Redesigned with Signature Style) */}
                <div className="mt-6 pt-4 border-t border-[#5379AE]/20 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="text-xs text-[#A8C4EC] font-mono">
                    Selected: <span className="font-semibold text-white">{selectedHarbor.name}</span> ({selectedHarbor.state})
                  </div>
                  <button
                    onClick={() => handleConfirmHarbor(selectedHarbor)}
                    className="btn-signature btn-signature-sm w-full sm:w-auto group"
                  >
                    <span>Launch Operations at {selectedHarbor.name.split('(')[0].trim()}</span>
                    <span className="text-[#A8C4EC] transition-transform duration-200 group-hover:translate-x-1 font-sans">→</span>
                  </button>
                </div>
              </div>
            )}

            {/* Mode 2: Live GPS */}
            {activeTab === 'gps' && (
              <div className="p-8 text-center flex flex-col items-center justify-center min-h-[320px]">
                {gpsStatus === 'locating' && (
                  <div className="space-y-4">
                    <div className="w-16 h-16 rounded-2xl bg-[#06457F]/30 border border-[#0474C4]/40 flex items-center justify-center mx-auto text-[#0474C4]">
                      <Loader2 className="w-8 h-8 animate-spin" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-white">Acquiring High-Precision GPS Fix...</h4>
                      <p className="text-xs text-[#A8C4EC]/75 mt-1 max-w-sm mx-auto">
                        Connecting to device GNSS receiver to resolve vessel latitude and longitude.
                      </p>
                    </div>
                  </div>
                )}

                {gpsStatus === 'success' && gpsCoords && (
                  <div className="space-y-5 max-w-md w-full">
                    <div className="w-14 h-14 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400">
                      <ShieldCheck className="w-7 h-7" />
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-white">Satellite Position Acquired</h4>
                      <p className="text-xs text-[#A8C4EC]/75 mt-1">Live coordinates verified with high accuracy.</p>
                    </div>

                    <div className="p-4 rounded-xl bg-[#151926] border border-[#5379AE]/30 font-mono text-center">
                      <div className="text-xs text-[#5379AE] mb-1">Vessel Position:</div>
                      <div className="text-xl font-bold text-[#A8C4EC]">
                        {gpsCoords.latitude.toFixed(4)}°N, {gpsCoords.longitude.toFixed(4)}°E
                      </div>
                    </div>

                    <div className="flex gap-3 justify-center">
                      <button
                        onClick={handleDetectGPS}
                        className="px-4 py-2 rounded-xl bg-[#262B40] hover:bg-[#2C444C] text-xs text-[#A8C4EC] hover:text-white border border-[#5379AE]/30 cursor-pointer transition-colors"
                      >
                        Re-scan GPS
                      </button>
                      <button
                        onClick={handleConfirmGPS}
                        className="btn-signature btn-signature-sm group"
                      >
                        <span>Proceed with this Position</span>
                        <span className="text-[#A8C4EC] transition-transform duration-200 group-hover:translate-x-1 font-sans">→</span>
                      </button>
                    </div>
                  </div>
                )}

                {gpsStatus === 'error' && (
                  <div className="space-y-4 max-w-md">
                    <div className="w-14 h-14 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center mx-auto text-amber-400">
                      <AlertCircle className="w-7 h-7" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-white">GPS Unavailable</h4>
                      <p className="text-xs text-amber-200/90 mt-1 leading-relaxed bg-amber-950/30 border border-amber-500/20 p-3 rounded-xl">
                        {gpsErrorMsg}
                      </p>
                    </div>
                    <div className="flex gap-3 justify-center pt-2">
                      <button
                        onClick={handleDetectGPS}
                        className="px-4 py-2 rounded-xl bg-[#262B40] hover:bg-[#2C444C] text-xs text-[#A8C4EC] cursor-pointer"
                      >
                        Try Again
                      </button>
                      <button
                        onClick={() => setActiveTab('harbor')}
                        className="btn-signature btn-signature-sm group"
                      >
                        <span>Choose Coastal Harbor</span>
                        <span className="text-[#A8C4EC] transition-transform duration-200 group-hover:translate-x-1 font-sans">→</span>
                      </button>
                    </div>
                  </div>
                )}

                {gpsStatus === 'idle' && (
                  <div className="space-y-4 max-w-sm">
                    <div className="w-14 h-14 rounded-2xl bg-[#06457F]/30 border border-[#0474C4]/40 flex items-center justify-center mx-auto text-[#0474C4]">
                      <Crosshair className="w-7 h-7" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-white">Browser Geolocation</h4>
                      <p className="text-xs text-[#A8C4EC]/75 mt-1 font-light">
                        Click below to allow the browser to detect your live GPS fix.
                      </p>
                    </div>
                    <button
                      onClick={handleDetectGPS}
                      className="btn-signature btn-signature-sm mx-auto group"
                    >
                      <Crosshair className="w-3.5 h-3.5 text-[#A8C4EC]" />
                      <span>Detect Vessel Coordinates</span>
                      <span className="text-[#A8C4EC] transition-transform duration-200 group-hover:translate-x-1 font-sans">→</span>
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Mode 3: Manual Coordinates */}
            {activeTab === 'manual' && (
              <div className="p-6">
                <form onSubmit={handleConfirmManual} className="max-w-md mx-auto space-y-4">
                  <div className="text-xs text-[#A8C4EC]/75 text-center mb-4 font-light">
                    Enter decimal coordinates for coastal jetties, anchorages, or high seas:
                  </div>

                  {manualError && (
                    <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-400" />
                      <span>{manualError}</span>
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-mono text-[#A8C4EC] mb-1.5">
                      Latitude (°N decimal):
                    </label>
                    <input
                      type="number"
                      step="0.0001"
                      value={manualLat}
                      onChange={(e) => setManualLat(e.target.value)}
                      placeholder="e.g. 9.9312"
                      className="w-full bg-[#151926] border border-[#5379AE]/30 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono outline-none focus:border-[#0474C4] transition-colors"
                      required
                    />
                    <span className="text-[10px] text-[#5379AE] mt-1 block">Valid range: -90.0000 to +90.0000</span>
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-[#A8C4EC] mb-1.5">
                      Longitude (°E decimal):
                    </label>
                    <input
                      type="number"
                      step="0.0001"
                      value={manualLon}
                      onChange={(e) => setManualLon(e.target.value)}
                      placeholder="e.g. 76.2673"
                      className="w-full bg-[#151926] border border-[#5379AE]/30 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono outline-none focus:border-[#0474C4] transition-colors"
                      required
                    />
                    <span className="text-[10px] text-[#5379AE] mt-1 block">Valid range: -180.0000 to +180.0000</span>
                  </div>

                  {/* Quick Indian Ocean presets */}
                  <div className="pt-2">
                    <div className="text-[11px] text-[#5379AE] mb-1.5 font-mono">Quick Ocean Reference Points:</div>
                    <div className="flex flex-wrap gap-1.5">
                      {[
                        { name: 'Kochi Offshore', lat: 9.95, lon: 76.10 },
                        { name: 'Mumbai High', lat: 19.42, lon: 71.33 },
                        { name: 'Palk Bay', lat: 9.50, lon: 79.20 },
                        { name: 'Wadge Bank', lat: 7.50, lon: 77.20 }
                      ].map((p) => (
                        <button
                          key={p.name}
                          type="button"
                          onClick={() => {
                            setManualLat(p.lat.toString());
                            setManualLon(p.lon.toString());
                          }}
                          className="px-2.5 py-1 rounded-lg bg-[#262B40] hover:bg-[#2C444C] text-[11px] text-[#A8C4EC] hover:text-white border border-[#5379AE]/25 cursor-pointer transition-colors"
                        >
                          {p.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-[#5379AE]/20 flex justify-end">
                    <button
                      type="submit"
                      className="btn-signature btn-signature-sm w-full group"
                    >
                      <span>Calibrate Operations at Coordinates</span>
                      <span className="text-[#A8C4EC] transition-transform duration-200 group-hover:translate-x-1 font-sans">→</span>
                    </button>
                  </div>
                </form>
              </div>
            )}

          </div>

        </section>

      </main>

      {/* ── Footer ── */}
      <footer className="relative z-10 py-6 text-center text-xs border-t border-[#5379AE]/15 text-[#5379AE]">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-2 font-mono text-[11px]">
          <span>SamudraAI — Sapphire Nightfall Whisper Ocean Intelligence</span>
          <span className="text-[#A8C4EC]/60">ISRO Oceansat-3 • INCOIS Synced</span>
        </div>
      </footer>

    </div>
  );
};
