import { AlertTriangle, LogOut } from 'lucide-react';

interface FooterProps {
  systemStatus: string;
}

export function Footer({ systemStatus }: FooterProps) {
  const isAlert = systemStatus !== 'All Chambers Operational';

  return (
    <footer className="bg-[#2A2A2A] text-white px-6 py-3 shadow-2xl">
      <div className="flex items-center justify-between max-w-[1800px] mx-auto">
        {/* System Status */}
        <div className="flex items-center gap-3">
          <div
            className={`px-3 py-1.5 rounded flex items-center gap-2 text-sm ${
              isAlert ? 'bg-[#DC3545]' : 'bg-[#28A745]'
            }`}
          >
            {isAlert ? (
              <AlertTriangle className="w-4 h-4" />
            ) : (
              <div className="w-1.5 h-1.5 bg-white rounded-full" />
            )}
            <span>{systemStatus}</span>
          </div>
        </div>

        {/* Empty space for balance */}
        <div />

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 rounded flex items-center gap-2 transition-colors text-sm">
            <LogOut className="w-3.5 h-3.5" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </footer>
  );
}