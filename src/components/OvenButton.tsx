import { Settings, AlertTriangle, CheckCircle } from 'lucide-react';
import { LineChart, Line, ResponsiveContainer } from 'recharts';
import type { ChamberData } from '../App';

interface OvenButtonProps {
  chamber: ChamberData;
  onClick: () => void;
  onStart: (id: number) => void;
  onStop: (id: number) => void;
  onResume: (id: number) => void;
  onSettings: (id: number) => void;
}

export function OvenButton({ chamber, onClick, onStart, onStop, onResume, onSettings }: OvenButtonProps) {
  const statusColors = {
    active: '#28A745',
    fault: '#DC3545',
    paused: '#FFC107',
    idle: '#4A5568',
  };

  const chartData = chamber.temperatureHistory.map((temp, index) => ({
    index,
    temp,
  }));

  // Show graph only when not idle
  const showGraph = chamber.status !== 'idle';
  
  // Determine if card should be faded (when idle)
  const isIdle = chamber.status === 'idle';
  
  // Determine dot color and position based on status
  const getDotConfig = () => {
    if (chamber.status === 'active') {
      return { color: '#28A745', position: chartData.length - 1 };
    } else if (chamber.status === 'fault' || chamber.powerFailure) {
      return { color: '#DC3545', position: chartData.length - 1 };
    } else if (chamber.status === 'paused' || chamber.powerRestored) {
      return { color: '#FFC107', position: chartData.length - 1 };
    }
    return null;
  };

  const dotConfig = getDotConfig();

  return (
    <div 
      onClick={onClick}
      className={`rounded-lg shadow-md overflow-hidden border border-gray-300 hover:shadow-lg transition-shadow cursor-pointer ${
        isIdle ? 'bg-gray-200' : 'bg-white'
      }`}
    >
      {/* Status Bar at Top */}
      <div
        className="h-1.5 w-full"
        style={{ backgroundColor: statusColors[chamber.status] }}
      />
      
      <div className="p-5">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-gray-900 text-[15px]">{chamber.name}</h3>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSettings(chamber.id);
            }}
            className="w-7 h-7 rounded bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
          >
            <Settings className="w-3.5 h-3.5 text-gray-600" />
          </button>
        </div>

        {/* Power Failure Alert */}
        {chamber.powerFailure && (
          <div className="mb-3 bg-[#DC3545] text-white px-3 py-2 rounded flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 flex-shrink-0" />
            <span className="text-xs">⚠ Power Failure Detected – Switching to Battery Mode</span>
          </div>
        )}

        {/* Power Restored Alert */}
        {chamber.powerRestored && (
          <div className="mb-3 bg-[#FFC107] text-gray-900 px-3 py-2 rounded flex items-center gap-2">
            <CheckCircle className="w-4 h-4 flex-shrink-0" />
            <span className="text-xs">Power Restored – Cycle Resuming...</span>
          </div>
        )}

        {/* Cycle Information - Show OFF for idle ovens */}
        {chamber.status === 'idle' ? (
          <div className="mb-3">
            <div className="flex items-baseline gap-2 mb-0.5">
              <span className="text-gray-900 font-mono text-[36px] leading-none">
                OFF
              </span>
            </div>
            <div className="text-gray-500 text-xs">Target: {chamber.targetTemp}°C</div>
            <div className="text-gray-500 text-xs mt-0.5">Time left: {chamber.timeRemaining} hrs</div>
          </div>
        ) : (
          <div className="mb-3">
            <div className="text-gray-600 text-xs mb-1.5">{chamber.cycleName}</div>
            <div className="flex items-baseline gap-2 mb-0.5">
              <span className="text-gray-900 font-mono text-[36px] leading-none">
                {chamber.currentTemp}°C
              </span>
            </div>
            <div className="text-gray-500 text-xs">Target: {chamber.targetTemp}°C</div>
            <div className="text-gray-500 text-xs mt-0.5">Time left: {chamber.timeRemaining} hrs</div>
          </div>
        )}

        {/* Temperature Graph - only show when not idle */}
        {showGraph ? (
          <div className="mb-3 h-16 bg-gray-50 rounded p-1.5">
            <ResponsiveContainer width="100%" height={52}>
              <LineChart data={chartData}>
                <Line
                  type="monotone"
                  dataKey="temp"
                  stroke="#000000"
                  strokeWidth={1.5}
                  dot={(props) => {
                    const { cx, cy, index } = props;
                    if (dotConfig && index === dotConfig.position) {
                      return (
                        <circle
                          cx={cx}
                          cy={cy}
                          r={4}
                          fill={dotConfig.color}
                          stroke={dotConfig.color}
                          strokeWidth={2}
                        />
                      );
                    }
                    return null;
                  }}
                  animationDuration={300}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="mb-3 h-16" />
        )}

        {/* Resume Info (when power restored) */}
        {chamber.powerRestored && (
          <div className="mb-3 bg-[#FFC107] border-2 border-[#E0A800] text-gray-900 px-4 py-3 rounded-lg text-center">
            <div className="text-base font-medium">
              Cycle Resuming for 45 mins at 120°C
            </div>
            <div className="text-xs text-gray-700 mt-1">Post Power Failure</div>
          </div>
        )}

        {/* Control Buttons */}
        <div className="flex gap-2">
          {!chamber.powerRestored && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onStart(chamber.id);
                }}
                disabled={chamber.status === 'active' || chamber.powerFailure}
                className={`flex-1 py-1.5 px-3 rounded text-sm transition-colors ${
                  chamber.status === 'active' || chamber.powerFailure
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-[#28A745] hover:bg-[#218838] text-white'
                }`}
              >
                Start Cycle
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onStop(chamber.id);
                }}
                disabled={chamber.status === 'idle' || chamber.powerFailure}
                className={`flex-1 py-1.5 px-3 rounded text-sm transition-colors ${
                  chamber.status === 'idle' || chamber.powerFailure
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-[#2A2A2A] hover:bg-[#3A3A3A] text-white'
                }`}
              >
                Stop Cycle
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}