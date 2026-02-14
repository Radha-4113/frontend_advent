import { AlertTriangle, CheckCircle, Info } from 'lucide-react';

interface Alert {
  id: number;
  type: 'error' | 'warning' | 'info' | 'success';
  message: string;
  timestamp: string;
  ovenName: string;
}

const mockAlerts: Alert[] = [
  {
    id: 1,
    type: 'error',
    message: 'Power failure detected - Switching to battery mode',
    timestamp: '2025-11-12 14:23:15',
    ovenName: 'Oven 4',
  },
  {
    id: 2,
    type: 'warning',
    message: 'Temperature approaching target - Cycle will complete soon',
    timestamp: '2025-11-12 13:45:32',
    ovenName: 'Oven 1',
  },
  {
    id: 3,
    type: 'success',
    message: 'Heating cycle completed successfully',
    timestamp: '2025-11-12 12:30:08',
    ovenName: 'Oven 2',
  },
  {
    id: 4,
    type: 'info',
    message: 'Vacuum Heating cycle started',
    timestamp: '2025-11-12 11:15:42',
    ovenName: 'Oven 2',
  },
  {
    id: 5,
    type: 'warning',
    message: 'Power restored - Resume cycle available',
    timestamp: '2025-11-12 10:50:20',
    ovenName: 'Oven 2',
  },
  {
    id: 6,
    type: 'info',
    message: 'System initialization complete',
    timestamp: '2025-11-12 09:00:00',
    ovenName: 'System',
  },
  {
    id: 7,
    type: 'success',
    message: 'Vacuum Cooling cycle completed successfully',
    timestamp: '2025-11-11 20:00:00',
    ovenName: 'Oven 3',
  },
  {
    id: 8,
    type: 'error',
    message: 'Temperature sensor malfunction detected',
    timestamp: '2025-11-11 15:30:45',
    ovenName: 'Oven 4',
  },
  {
    id: 9,
    type: 'info',
    message: 'Heating cycle started',
    timestamp: '2025-11-11 06:00:00',
    ovenName: 'Oven 1',
  },
  {
    id: 10,
    type: 'warning',
    message: 'High ambient temperature detected',
    timestamp: '2025-11-10 16:20:30',
    ovenName: 'System',
  },
];

export function AlertsPage() {
  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'error':
        return <AlertTriangle className="w-5 h-5 text-[#DC3545]" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-[#FFC107]" />;
      case 'success':
        return <CheckCircle className="w-5 h-5 text-[#28A745]" />;
      case 'info':
        return <Info className="w-5 h-5 text-[#007BFF]" />;
      default:
        return <Info className="w-5 h-5 text-gray-500" />;
    }
  };

  const getAlertBgColor = (type: string) => {
    switch (type) {
      case 'error':
        return 'bg-red-50 border-red-200';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200';
      case 'success':
        return 'bg-green-50 border-green-200';
      case 'info':
        return 'bg-blue-50 border-blue-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="max-w-[1800px] mx-auto">
      <div className="mb-6">
        <h2 className="text-gray-900 text-[24px]">Alerts & Notifications</h2>
        <p className="text-gray-600 text-sm mt-1">
          View all system alerts and notifications from oven monitoring
        </p>
      </div>

      <div className="space-y-3">
        {mockAlerts.map((alert) => (
          <div
            key={alert.id}
            className={`p-5 rounded-lg border ${getAlertBgColor(alert.type)} bg-white shadow-sm hover:shadow-md transition-shadow`}
          >
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 mt-0.5">{getAlertIcon(alert.type)}</div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-900">{alert.ovenName}</span>
                  <span className="text-xs text-gray-500 font-mono">{alert.timestamp}</span>
                </div>
                <p className="text-sm text-gray-700">{alert.message}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
