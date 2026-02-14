import { Wifi, Lock, User } from 'lucide-react';
import { useState, useEffect } from 'react';
import adventLogo from 'figma:asset/be0ccaab92bd3f8a21797fb9fde7da0653f5979e.png';

export function Header() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  return (
    <header className="bg-[#1B1B1B] text-white px-6 py-3 shadow-lg">
      <div className="flex items-center justify-between max-w-[1800px] mx-auto">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 pl-1">
            <img src={adventLogo} alt="Advent Engineers" className="h-9 w-auto" />
            <div className="text-sm">
              <div className="text-white">Advent Engineers</div>
            </div>
          </div>
        </div>

        {/* Center Title */}
        <div className="flex-1 text-center px-8">
          <h1 className="text-white tracking-wide text-[18px]">Industrial Oven Monitoring System</h1>
        </div>

        {/* Right Status Icons */}
        <div className="flex items-center gap-4">
          <div className="group relative">
            <Wifi className="w-4 h-4 text-[#28A745]" />
            <div className="absolute hidden group-hover:block bg-gray-800 text-white text-[10px] rounded px-2 py-1 -bottom-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap z-50">
              Wi-Fi Connected
            </div>
          </div>
          
          <div className="group relative">
            <Lock className="w-4 h-4 text-[#007BFF]" />
            <div className="absolute hidden group-hover:block bg-gray-800 text-white text-[10px] rounded px-2 py-1 -bottom-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap z-50">
              TLS Secure Connection Active
            </div>
          </div>

          <div className="flex flex-col items-end text-[11px]">
            <span className="text-gray-400">{formatDate(currentTime)}</span>
            <span className="font-mono">{formatTime(currentTime)}</span>
          </div>

          <div className="w-8 h-8 bg-[#C1121F] rounded-full flex items-center justify-center cursor-pointer hover:bg-[#A00F1A] transition-colors">
            <User className="w-4 h-4" />
          </div>
        </div>
      </div>
    </header>
  );
}