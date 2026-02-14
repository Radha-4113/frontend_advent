import { Download } from 'lucide-react';
import { useState } from 'react';

interface Report {
  id: number;
  ovenName: string;
  cycleName: string;
  startTime: string;
  endTime: string;
  targetTemp: number;
  actualTemp: number;
  powerOutages: number;
  compensationApplied: string;
  status: 'Completed' | 'Interrupted' | 'In Progress';
}

const mockReports: Report[] = [
  {
    id: 1,
    ovenName: 'Oven 1',
    cycleName: 'Heating',
    startTime: '2025-11-12 06:00:00',
    endTime: '2025-11-12 18:00:00',
    targetTemp: 80,
    actualTemp: 80,
    powerOutages: 0,
    compensationApplied: 'None',
    status: 'Completed',
  },
  {
    id: 2,
    ovenName: 'Oven 2',
    cycleName: 'Vacuum Heating',
    startTime: '2025-11-11 08:00:00',
    endTime: '2025-11-12 08:00:00',
    targetTemp: 90,
    actualTemp: 90,
    powerOutages: 1,
    compensationApplied: '+45 min',
    status: 'Completed',
  },
  {
    id: 3,
    ovenName: 'Oven 3',
    cycleName: 'Vacuum Cooling',
    startTime: '2025-11-11 14:00:00',
    endTime: '2025-11-11 20:00:00',
    targetTemp: 60,
    actualTemp: 60,
    powerOutages: 0,
    compensationApplied: 'None',
    status: 'Completed',
  },
  {
    id: 4,
    ovenName: 'Oven 4',
    cycleName: 'Heating',
    startTime: '2025-11-10 10:00:00',
    endTime: '2025-11-10 22:00:00',
    targetTemp: 80,
    actualTemp: 78,
    powerOutages: 2,
    compensationApplied: '+1 hr 20 min',
    status: 'Interrupted',
  },
  {
    id: 5,
    ovenName: 'Oven 1',
    cycleName: 'Vacuum Heating',
    startTime: '2025-11-09 06:00:00',
    endTime: '2025-11-10 06:00:00',
    targetTemp: 90,
    actualTemp: 90,
    powerOutages: 0,
    compensationApplied: 'None',
    status: 'Completed',
  },
  {
    id: 6,
    ovenName: 'Oven 2',
    cycleName: 'Heating',
    startTime: '2025-11-08 14:00:00',
    endTime: '2025-11-09 02:00:00',
    targetTemp: 80,
    actualTemp: 80,
    powerOutages: 0,
    compensationApplied: 'None',
    status: 'Completed',
  },
  {
    id: 7,
    ovenName: 'Oven 3',
    cycleName: 'Heating',
    startTime: '2025-11-07 09:00:00',
    endTime: '2025-11-07 21:00:00',
    targetTemp: 80,
    actualTemp: 80,
    powerOutages: 0,
    compensationApplied: 'None',
    status: 'Completed',
  },
  {
    id: 8,
    ovenName: 'Oven 4',
    cycleName: 'Vacuum Cooling',
    startTime: '2025-11-06 16:00:00',
    endTime: '2025-11-06 22:00:00',
    targetTemp: 60,
    actualTemp: 61,
    powerOutages: 1,
    compensationApplied: '+30 min',
    status: 'Completed',
  },
];

export function ReportsPage() {
  const [selectedOven, setSelectedOven] = useState<string>('All');

  const filteredReports =
    selectedOven === 'All'
      ? mockReports
      : mockReports.filter((report) => report.ovenName === selectedOven);

  const handleDownload = () => {
    // Mock download functionality
    const csvContent = [
      'Oven,Cycle,Start Time,End Time,Target Temp,Actual Temp,Power Outages,Compensation,Status',
      ...filteredReports.map((r) =>
        [
          r.ovenName,
          r.cycleName,
          r.startTime,
          r.endTime,
          r.targetTemp,
          r.actualTemp,
          r.powerOutages,
          r.compensationApplied,
          r.status,
        ].join(',')
      ),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `oven_reports_${selectedOven}_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'text-[#28A745] bg-green-50';
      case 'Interrupted':
        return 'text-[#DC3545] bg-red-50';
      case 'In Progress':
        return 'text-[#007BFF] bg-blue-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="max-w-[1800px] mx-auto">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-gray-900 text-[24px]">Cycle Reports</h2>
          <p className="text-gray-600 text-sm mt-1">
            View and download detailed reports for all oven cycles
          </p>
        </div>
        <div className="flex items-center gap-4">
          <select
            value={selectedOven}
            onChange={(e) => setSelectedOven(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#C1121F]"
          >
            <option value="All">All Ovens</option>
            <option value="Oven 1">Oven 1</option>
            <option value="Oven 2">Oven 2</option>
            <option value="Oven 3">Oven 3</option>
            <option value="Oven 4">Oven 4</option>
          </select>
          <button
            onClick={handleDownload}
            className="px-4 py-2 rounded bg-[#28A745] hover:bg-[#218838] text-white transition-colors text-sm flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Download Reports
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-300">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-100 border-b border-gray-300">
                <th className="px-4 py-3 text-left text-gray-700">Oven</th>
                <th className="px-4 py-3 text-left text-gray-700">Cycle</th>
                <th className="px-4 py-3 text-left text-gray-700">Start Time</th>
                <th className="px-4 py-3 text-left text-gray-700">End Time</th>
                <th className="px-4 py-3 text-left text-gray-700">Target °C</th>
                <th className="px-4 py-3 text-left text-gray-700">Actual °C</th>
                <th className="px-4 py-3 text-left text-gray-700">Outages</th>
                <th className="px-4 py-3 text-left text-gray-700">Compensation</th>
                <th className="px-4 py-3 text-left text-gray-700">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredReports.map((report) => (
                <tr key={report.id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-900">{report.ovenName}</td>
                  <td className="px-4 py-3 text-gray-700">{report.cycleName}</td>
                  <td className="px-4 py-3 text-gray-700 font-mono text-xs">
                    {report.startTime}
                  </td>
                  <td className="px-4 py-3 text-gray-700 font-mono text-xs">{report.endTime}</td>
                  <td className="px-4 py-3 text-gray-700">{report.targetTemp}°C</td>
                  <td className="px-4 py-3 text-gray-700">{report.actualTemp}°C</td>
                  <td className="px-4 py-3 text-center text-gray-700">{report.powerOutages}</td>
                  <td className="px-4 py-3 text-gray-700">{report.compensationApplied}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded text-xs ${getStatusColor(report.status)}`}>
                      {report.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-4 text-sm text-gray-600">
        Showing {filteredReports.length} report{filteredReports.length !== 1 ? 's' : ''}
      </div>
    </div>
  );
}
