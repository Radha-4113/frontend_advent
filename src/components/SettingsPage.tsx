import { Wifi, Bell, User, Info } from 'lucide-react';
import { useState } from 'react';

export function SettingsPage() {
  const [temperatureUnit, setTemperatureUnit] = useState('celsius');
  const [timeFormat, setTimeFormat] = useState('24h');
  const [autoRefresh, setAutoRefresh] = useState('5');
  const [soundAlerts, setSoundAlerts] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(false);
  const [tempThreshold, setTempThreshold] = useState('5');

  return (
    <div className="max-w-[1400px] mx-auto">
      <div className="mb-6">
        <h2 className="text-gray-900 text-[24px]">System Settings</h2>
        <p className="text-gray-600 text-sm mt-1">
          Configure system preferences and monitoring parameters
        </p>
      </div>

      <div className="grid grid-cols-2 gap-5">
        {/* General Settings */}
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-300">
          <div className="flex items-center gap-3 mb-5">
            <User className="w-5 h-5 text-gray-700" />
            <h3 className="text-gray-900 text-[16px]">General Settings</h3>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-700 mb-2">Temperature Unit</label>
              <select
                value={temperatureUnit}
                onChange={(e) => setTemperatureUnit(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#C1121F]"
              >
                <option value="celsius">Celsius (°C)</option>
                <option value="fahrenheit">Fahrenheit (°F)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-2">Time Format</label>
              <select
                value={timeFormat}
                onChange={(e) => setTimeFormat(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#C1121F]"
              >
                <option value="12h">12 Hour (AM/PM)</option>
                <option value="24h">24 Hour</option>
              </select>
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-2">Auto Refresh Interval</label>
              <select
                value={autoRefresh}
                onChange={(e) => setAutoRefresh(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#C1121F]"
              >
                <option value="1">1 second</option>
                <option value="5">5 seconds</option>
                <option value="10">10 seconds</option>
                <option value="30">30 seconds</option>
              </select>
            </div>
          </div>
        </div>

        {/* Alert Settings */}
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-300">
          <div className="flex items-center gap-3 mb-5">
            <Bell className="w-5 h-5 text-gray-700" />
            <h3 className="text-gray-900 text-[16px]">Alert Configuration</h3>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-700 mb-2">
                Temperature Deviation Threshold (°C)
              </label>
              <input
                type="number"
                value={tempThreshold}
                onChange={(e) => setTempThreshold(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#C1121F]"
                min="1"
                max="20"
              />
              <p className="text-xs text-gray-500 mt-1">
                Alert when temperature deviates from target by this amount
              </p>
            </div>

            <div className="flex items-center justify-between py-2">
              <div>
                <div className="text-sm text-gray-700">Sound Alerts</div>
                <div className="text-xs text-gray-500">Play sound for critical alerts</div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={soundAlerts}
                  onChange={(e) => setSoundAlerts(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#C1121F] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#28A745]"></div>
              </label>
            </div>

            <div className="flex items-center justify-between py-2">
              <div>
                <div className="text-sm text-gray-700">Email Notifications</div>
                <div className="text-xs text-gray-500">Send alerts via email</div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={emailAlerts}
                  onChange={(e) => setEmailAlerts(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#C1121F] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#28A745]"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Network Settings */}
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-300">
          <div className="flex items-center gap-3 mb-5">
            <Wifi className="w-5 h-5 text-gray-700" />
            <h3 className="text-gray-900 text-[16px]">Network & Security</h3>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-700 mb-2">ESP32 IP Address</label>
              <input
                type="text"
                value="192.168.1.100"
                readOnly
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm bg-gray-100 font-mono"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-2">Wi-Fi Network</label>
              <input
                type="text"
                value="AdventEngineers_Network"
                readOnly
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm bg-gray-100"
              />
            </div>

            <div className="flex items-center justify-between py-2">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#28A745]"></div>
                <div>
                  <div className="text-sm text-gray-700">TLS Encryption</div>
                  <div className="text-xs text-gray-500">Secure connection active</div>
                </div>
              </div>
              <div className="px-2 py-1 bg-green-50 text-[#28A745] text-xs rounded">Enabled</div>
            </div>

            <button className="w-full py-2 px-4 rounded bg-[#007BFF] hover:bg-[#0056b3] text-white transition-colors text-sm">
              Reconnect to ESP32
            </button>
          </div>
        </div>

        {/* System Information */}
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-300">
          <div className="flex items-center gap-3 mb-5">
            <Info className="w-5 h-5 text-gray-700" />
            <h3 className="text-gray-900 text-[16px]">System Information</h3>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between py-2 border-b border-gray-200">
              <div className="text-xs text-gray-500">Firmware Version</div>
              <div className="text-sm text-gray-900 font-mono">v2.1.4</div>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-200">
              <div className="text-xs text-gray-500">ESP32 Model</div>
              <div className="text-sm text-gray-900">ESP32-WROOM-32</div>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-200">
              <div className="text-xs text-gray-500">Last System Boot</div>
              <div className="text-sm text-gray-900">2025-11-12 09:00:00</div>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-200">
              <div className="text-xs text-gray-500">Uptime</div>
              <div className="text-sm text-gray-900">5 hours 23 minutes</div>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-200">
              <div className="text-xs text-gray-500">Active Ovens</div>
              <div className="text-sm text-gray-900">2 of 4</div>
            </div>
            <div className="flex justify-between py-2">
              <div className="text-xs text-gray-500">Total Cycles Today</div>
              <div className="text-sm text-gray-900">8 cycles</div>
            </div>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="mt-6 flex justify-end gap-3">
        <button className="px-6 py-2 rounded bg-gray-300 hover:bg-gray-400 text-gray-700 transition-colors text-sm">
          Reset to Defaults
        </button>
        <button className="px-6 py-2 rounded bg-[#28A745] hover:bg-[#218838] text-white transition-colors text-sm">
          Save Settings
        </button>
      </div>
    </div>
  );
}