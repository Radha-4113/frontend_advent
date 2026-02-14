import { AlertTriangle, CheckCircle, Settings, Download } from 'lucide-react';
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import type { ChamberData } from '../App';

interface OvenDetailPageProps {
  chamber: ChamberData;
  onStart: (id: number) => void;
  onStop: (id: number) => void;
  onResume: (id: number) => void;
  onSettings: (id: number) => void;
  onSwitchOven: (id: number) => void;
}

// Mock report data for the oven
interface ReportLog {
  id: number;
  timestamp: string;
  event: string;
  temperature: number;
  targetTemp: number;
  status: string;
}

const mockReportData: ReportLog[] = [
  {
    id: 1,
    timestamp: '2026-02-09 14:35:22',
    event: 'Cycle Started',
    temperature: 65,
    targetTemp: 80,
    status: 'Active',
  },
  {
    id: 2,
    timestamp: '2026-02-09 13:20:15',
    event: 'Temperature Reached',
    temperature: 80,
    targetTemp: 80,
    status: 'Completed',
  },
  {
    id: 3,
    timestamp: '2026-02-09 12:10:08',
    event: 'Cycle Stopped',
    temperature: 75,
    targetTemp: 80,
    status: 'Stopped',
  },
  {
    id: 4,
    timestamp: '2026-02-09 10:45:30',
    event: 'Power Restored',
    temperature: 70,
    targetTemp: 80,
    status: 'Resumed',
  },
  {
    id: 5,
    timestamp: '2026-02-09 10:30:12',
    event: 'Power Failure Detected',
    temperature: 70,
    targetTemp: 80,
    status: 'Fault',
  },
  {
    id: 6,
    timestamp: '2026-02-09 09:15:45',
    event: 'Cycle Started',
    temperature: 28,
    targetTemp: 80,
    status: 'Active',
  },
  {
    id: 7,
    timestamp: '2026-02-08 20:00:00',
    event: 'Cycle Completed',
    temperature: 90,
    targetTemp: 90,
    status: 'Completed',
  },
  {
    id: 8,
    timestamp: '2026-02-08 08:30:00',
    event: 'Cycle Started',
    temperature: 30,
    targetTemp: 90,
    status: 'Active',
  },
];

export function OvenDetailPage({
  chamber,
  onStart,
  onStop,
  onResume,
  onSettings,
  onSwitchOven,
}: OvenDetailPageProps) {
  const statusColors = {
    active: '#28A745',
    fault: '#DC3545',
    paused: '#FFC107',
    idle: '#4A5568',
  };

  const statusLabels = {
    active: 'Active',
    fault: 'Fault',
    paused: 'Paused',
    idle: 'Idle',
  };

  // Generate detailed temperature history for the chart (hourly data for last 10 hours)
  const detailedChartData = chamber.temperatureHistory.map((temp, index) => ({
    time: `${index}h`,
    temp,
  }));

  const handleDownloadReport = () => {
    // Create CSV content
    const headers = ['Timestamp', 'Event', 'Temperature (°C)', 'Target Temp (°C)', 'Status'];
    const csvContent = [
      headers.join(','),
      ...mockReportData.map(log =>
        [log.timestamp, log.event, log.temperature, log.targetTemp, log.status].join(',')
      ),
    ].join('\n');

    // Create blob and download
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${chamber.name}_Report_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-[1800px] mx-auto">
      {/* Horizontal Tab Navigation */}
      <div className="mb-6 bg-white rounded-lg shadow-md border border-gray-300 p-1 flex gap-1">
        {[1, 2, 3, 4].map((ovenNum) => (
          <button
            key={ovenNum}
            onClick={() => onSwitchOven(ovenNum)}
            className={`flex-1 py-2.5 px-4 rounded text-sm transition-all ${
              chamber.id === ovenNum
                ? 'bg-[#C1121F] text-white shadow-sm'
                : 'bg-transparent text-gray-700 hover:bg-gray-100'
            }`}
          >
            Oven {ovenNum}
          </button>
        ))}
      </div>

      {/* Status Section */}
      <div className="mb-6 bg-white rounded-lg shadow-md border border-gray-300 overflow-hidden">
        {/* Status Bar */}
        <div
          className="h-2 w-full"
          style={{ backgroundColor: statusColors[chamber.status] }}
        />

        <div className="p-6">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-gray-900 text-[28px] mb-2">{chamber.name}</h2>
              <div className="flex items-center gap-3">
                <span
                  className="px-3 py-1 rounded-full text-sm text-white"
                  style={{ backgroundColor: statusColors[chamber.status] }}
                >
                  {statusLabels[chamber.status]}
                </span>
                <span className="text-gray-600 text-sm">{chamber.cycleName}</span>
              </div>
            </div>
            <button
              onClick={() => onSettings(chamber.id)}
              className="w-10 h-10 rounded bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
            >
              <Settings className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          {/* Power Alerts */}
          {chamber.powerFailure && (
            <div className="mb-4 bg-[#DC3545] text-white px-4 py-3 rounded flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 flex-shrink-0" />
              <span className="text-sm">⚠ Power Failure Detected – Switching to Battery Mode</span>
            </div>
          )}

          {chamber.powerRestored && (
            <div className="mb-4 bg-[#FFC107] text-gray-900 px-4 py-3 rounded flex items-center gap-3">
              <CheckCircle className="w-5 h-5 flex-shrink-0" />
              <span className="text-sm">Power Restored – Cycle Resuming...</span>
            </div>
          )}

          {/* Temperature and Status Grid */}
          <div className="grid grid-cols-4 gap-6 mb-6">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-gray-600 text-xs mb-1">Current Temperature</div>
              <div className="text-gray-900 font-mono text-[32px] leading-none">
                {chamber.currentTemp}°C
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-gray-600 text-xs mb-1">Target Temperature</div>
              <div className="text-gray-900 font-mono text-[32px] leading-none">
                {chamber.targetTemp}°C
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-gray-600 text-xs mb-1">Time Remaining</div>
              <div className="text-gray-900 font-mono text-[32px] leading-none">
                {chamber.timeRemaining}
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-gray-600 text-xs mb-1">Cycle Type</div>
              <div className="text-gray-900 text-lg leading-none pt-2">
                {chamber.cycleName}
              </div>
            </div>
          </div>

          {/* Temperature Graph */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h3 className="text-gray-900 text-sm mb-3">Temperature History</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={detailedChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis
                    dataKey="time"
                    stroke="#6B7280"
                    style={{ fontSize: '12px' }}
                  />
                  <YAxis
                    stroke="#6B7280"
                    style={{ fontSize: '12px' }}
                    domain={[0, 'auto']}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1F2937',
                      border: 'none',
                      borderRadius: '6px',
                      color: '#fff',
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="temp"
                    stroke={statusColors[chamber.status]}
                    strokeWidth={2}
                    dot={{ fill: statusColors[chamber.status], r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Resume Info (when power restored) */}
          {chamber.powerRestored && (
            <div className="mb-6 bg-[#FFC107] border-2 border-[#E0A800] text-gray-900 px-6 py-5 rounded-lg text-center">
              <div className="text-lg font-medium">
                Cycle Resuming for 45 mins at 120°C
              </div>
              <div className="text-sm text-gray-700 mt-2">Post Power Failure</div>
            </div>
          )}

          {/* Control Buttons */}
          <div className="flex gap-3">
            {!chamber.powerRestored && (
              <>
                <button
                  onClick={() => onStart(chamber.id)}
                  disabled={chamber.status === 'active' || chamber.powerFailure}
                  className={`flex-1 py-3 px-4 rounded text-sm transition-colors ${
                    chamber.status === 'active' || chamber.powerFailure
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-[#28A745] hover:bg-[#218838] text-white'
                  }`}
                >
                  Start Cycle
                </button>
                <button
                  onClick={() => onStop(chamber.id)}
                  disabled={chamber.status === 'idle' || chamber.powerFailure}
                  className={`flex-1 py-3 px-4 rounded text-sm transition-colors ${
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

      {/* Reports Section */}
      <div className="bg-white rounded-lg shadow-md border border-gray-300 overflow-hidden">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h3 className="text-gray-900 text-[20px]">Process Logs & Reports</h3>
            <p className="text-gray-600 text-sm mt-1">
              View detailed logs of {chamber.name} operations
            </p>
          </div>
          <button
            onClick={handleDownloadReport}
            className="flex items-center gap-2 bg-[#C1121F] hover:bg-[#A00F1A] text-white py-2 px-4 rounded text-sm transition-colors"
          >
            <Download className="w-4 h-4" />
            Download Report
          </button>
        </div>

        {/* Report Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs text-gray-700 uppercase tracking-wider">
                  Timestamp
                </th>
                <th className="px-6 py-3 text-left text-xs text-gray-700 uppercase tracking-wider">
                  Event
                </th>
                <th className="px-6 py-3 text-left text-xs text-gray-700 uppercase tracking-wider">
                  Temperature
                </th>
                <th className="px-6 py-3 text-left text-xs text-gray-700 uppercase tracking-wider">
                  Target Temp
                </th>
                <th className="px-6 py-3 text-left text-xs text-gray-700 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {mockReportData.map((log) => (
                <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-mono">
                    {log.timestamp}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {log.event}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-mono">
                    {log.temperature}°C
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-mono">
                    {log.targetTemp}°C
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        log.status === 'Active'
                          ? 'bg-green-100 text-green-800'
                          : log.status === 'Completed'
                          ? 'bg-blue-100 text-blue-800'
                          : log.status === 'Fault'
                          ? 'bg-red-100 text-red-800'
                          : log.status === 'Stopped'
                          ? 'bg-gray-100 text-gray-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {log.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}