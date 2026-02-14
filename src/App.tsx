import { useState } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { OvenButton } from './components/OvenButton';
import { OvenDetailPage } from './components/OvenDetailPage';
import { Footer } from './components/Footer';
import { CycleSettingsModal } from './components/CycleSettingsModal';
import { AlertsPage } from './components/AlertsPage';
import { ReportsPage } from './components/ReportsPage';
import { SettingsPage } from './components/SettingsPage';
import { SplashScreen } from './components/SplashScreen';

export interface ChamberData {
  id: number;
  name: string;
  status: 'active' | 'fault' | 'paused' | 'idle';
  cycleName: string;
  currentTemp: number;
  targetTemp: number;
  timeRemaining: string;
  temperatureHistory: number[];
  powerFailure: boolean;
  powerRestored: boolean;
}

export interface CycleOption {
  id: number;
  name: string;
  temperature: number;
  duration: number;
}

export const cycleOptions: CycleOption[] = [
  { id: 1, name: 'Heating', temperature: 80, duration: 12 },
  { id: 2, name: 'Vacuum Heating', temperature: 90, duration: 24 },
  { id: 3, name: 'Vacuum Cooling', temperature: 60, duration: 6 },
];

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [chambers, setChambers] = useState<ChamberData[]>([
    {
      id: 1,
      name: 'Oven 1',
      status: 'active',
      cycleName: 'Heating',
      currentTemp: 75,
      targetTemp: 80,
      timeRemaining: '08:23',
      temperatureHistory: [65, 68, 70, 71, 72, 73, 74, 74, 75, 75],
      powerFailure: false,
      powerRestored: false,
    },
    {
      id: 2,
      name: 'Oven 2',
      status: 'paused',
      cycleName: 'Vacuum Heating',
      currentTemp: 85,
      targetTemp: 90,
      timeRemaining: '18:45',
      temperatureHistory: [75, 78, 80, 82, 83, 84, 84, 85, 85, 85],
      powerFailure: false,
      powerRestored: true,
    },
    {
      id: 3,
      name: 'Oven 3',
      status: 'idle',
      cycleName: 'Off',
      currentTemp: 28,
      targetTemp: 0,
      timeRemaining: '--:--',
      temperatureHistory: [28, 28, 28, 28, 28, 28, 28, 28, 28, 28],
      powerFailure: false,
      powerRestored: false,
    },
    {
      id: 4,
      name: 'Oven 4',
      status: 'fault',
      cycleName: 'Vacuum Cooling',
      currentTemp: 68,
      targetTemp: 60,
      timeRemaining: '02:15',
      temperatureHistory: [85, 82, 80, 77, 75, 73, 71, 70, 69, 68],
      powerFailure: true,
      powerRestored: false,
    },
  ]);

  const [settingsOpen, setSettingsOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState<'dashboard' | 'alerts' | 'reports' | 'settings' | 'oven'>('dashboard');
  const [selectedChamber, setSelectedChamber] = useState<number | null>(null);
  const [selectedOvenId, setSelectedOvenId] = useState<number>(1);

  const handleSplashComplete = () => {
    setShowSplash(false);
  };

  const handleStartCycle = (chamberId: number) => {
    setChambers((prev) =>
      prev.map((chamber) =>
        chamber.id === chamberId
          ? { ...chamber, status: 'active', powerFailure: false, powerRestored: false }
          : chamber
      )
    );
  };

  const handleStopCycle = (chamberId: number) => {
    setChambers((prev) =>
      prev.map((chamber) =>
        chamber.id === chamberId ? { ...chamber, status: 'idle', cycleName: 'Off' } : chamber
      )
    );
  };

  const handleResumeCycle = (chamberId: number) => {
    setChambers((prev) =>
      prev.map((chamber) =>
        chamber.id === chamberId
          ? { ...chamber, status: 'active', powerRestored: false, powerFailure: false }
          : chamber
      )
    );
  };

  const handleOpenSettings = (chamberId: number) => {
    setSelectedChamber(chamberId);
    setSettingsOpen(true);
  };

  const handleApplyCycle = (cycleId: number) => {
    if (selectedChamber) {
      const cycle = cycleOptions.find((c) => c.id === cycleId);
      if (cycle) {
        setChambers((prev) =>
          prev.map((chamber) =>
            chamber.id === selectedChamber
              ? {
                  ...chamber,
                  cycleName: cycle.name,
                  targetTemp: cycle.temperature,
                  timeRemaining: `${Math.floor(cycle.duration)}:${Math.round((cycle.duration % 1) * 60).toString().padStart(2, '0')}`,
                }
              : chamber
          )
        );
      }
    }
    setSettingsOpen(false);
  };

  const systemStatus = chambers.some((c) => c.powerFailure)
    ? 'Power Failure Detected'
    : chambers.every((c) => c.status === 'active' || c.status === 'idle')
    ? 'All Chambers Operational'
    : 'System Alert';

  if (showSplash) {
    return <SplashScreen onComplete={handleSplashComplete} />;
  }

  return (
    <div className="min-h-screen bg-[#D1D5DB] flex">
      <Sidebar 
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        onOvenSelect={(ovenId) => {
          setSelectedOvenId(ovenId);
          setCurrentPage('oven');
        }}
      />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 p-6">
          {currentPage === 'dashboard' && (
            <div className="grid grid-cols-2 gap-5 max-w-[1800px] mx-auto">
              {chambers.map((chamber) => (
                <OvenButton
                  key={chamber.id}
                  chamber={chamber}
                  onClick={() => {
                    setSelectedOvenId(chamber.id);
                    setCurrentPage('oven');
                  }}
                  onStart={handleStartCycle}
                  onStop={handleStopCycle}
                  onResume={handleResumeCycle}
                  onSettings={handleOpenSettings}
                />
              ))}
            </div>
          )}
          {currentPage === 'alerts' && <AlertsPage />}
          {currentPage === 'reports' && <ReportsPage />}
          {currentPage === 'settings' && <SettingsPage />}
          {currentPage === 'oven' && <OvenDetailPage
            key={selectedOvenId}
            chamber={chambers.find((c) => c.id === selectedOvenId) || chambers[0]}
            onStart={handleStartCycle}
            onStop={handleStopCycle}
            onResume={handleResumeCycle}
            onSettings={handleOpenSettings}
            onSwitchOven={(ovenId) => setSelectedOvenId(ovenId)}
          />}
        </main>
        <Footer systemStatus={systemStatus} />
      </div>
      <CycleSettingsModal
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        onApply={handleApplyCycle}
        cycles={cycleOptions}
      />
    </div>
  );
}