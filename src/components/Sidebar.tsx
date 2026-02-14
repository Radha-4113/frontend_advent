import { LayoutDashboard, AlertTriangle, FileText, Settings, LogOut } from 'lucide-react';
import { useState } from 'react';

interface SidebarProps {
  currentPage: string;
  onPageChange: (page: 'dashboard' | 'alerts' | 'reports' | 'settings' | 'oven') => void;
  onOvenSelect?: (ovenId: number) => void;
}

export function Sidebar({ currentPage, onPageChange, onOvenSelect }: SidebarProps) {
  const menuItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'alerts', icon: AlertTriangle, label: 'Alerts' },
    { id: 'reports', icon: FileText, label: 'Reports' },
    { id: 'settings', icon: Settings, label: 'Settings' },
  ];

  const [showOvenMenu, setShowOvenMenu] = useState(false);

  return (
    <aside className="w-16 bg-[#1B1B1B] flex flex-col items-center pt-3 pb-6 shadow-2xl">
      <div className="flex-1 flex flex-col gap-6 mt-3">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id || (item.id === 'dashboard' && currentPage === 'oven');
          
          // Dashboard item with submenu
          if (item.id === 'dashboard') {
            return (
              <div 
                key={item.id} 
                className="group relative"
              >
                <button
                  onClick={() => {
                    if (showOvenMenu) {
                      setShowOvenMenu(false);
                      onPageChange('dashboard');
                    } else {
                      setShowOvenMenu(true);
                    }
                  }}
                  className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all ${
                    isActive
                      ? 'bg-[#C1121F] text-white shadow-lg'
                      : 'text-gray-400 hover:bg-[#2A2A2A] hover:text-white'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </button>
                
                {/* Oven Submenu */}
                {showOvenMenu && (
                  <div 
                    className="absolute left-full ml-4 top-0 bg-[#2A2A2A] rounded-lg shadow-xl py-2 min-w-[140px] z-50 border border-gray-700"
                    onMouseLeave={() => setShowOvenMenu(false)}
                  >
                    <button
                      onClick={() => {
                        onPageChange('dashboard');
                        setShowOvenMenu(false);
                      }}
                      className="w-full px-3 py-1.5 text-[10px] text-gray-400 hover:text-white hover:bg-[#C1121F] uppercase tracking-wider border-b border-gray-700 mb-1 transition-colors text-left"
                    >
                      Ovens
                    </button>
                    {[1, 2, 3, 4].map((ovenId) => (
                      <button
                        key={ovenId}
                        onClick={() => {
                          if (onOvenSelect) {
                            onOvenSelect(ovenId);
                          }
                          setShowOvenMenu(false);
                        }}
                        className="w-full px-3 py-2 text-left text-sm text-gray-300 hover:bg-[#C1121F] hover:text-white transition-colors"
                      >
                        Oven {ovenId}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          }
          
          // Other menu items
          return (
            <div key={item.id} className="group relative">
              <button
                onClick={() => {
                  if (item.id === 'dashboard' || item.id === 'alerts' || item.id === 'reports' || item.id === 'settings') {
                    onPageChange(item.id);
                  }
                }}
                className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all ${
                  isActive
                    ? 'bg-[#C1121F] text-white shadow-lg'
                    : 'text-gray-400 hover:bg-[#2A2A2A] hover:text-white'
                }`}
              >
                <Icon className="w-5 h-5" />
              </button>
              <div className="absolute left-full ml-4 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white text-[10px] rounded px-2 py-1 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                {item.label}
              </div>
            </div>
          );
        })}
      </div>

      <div className="group relative">
        <button className="w-10 h-10 rounded-lg flex items-center justify-center text-gray-400 hover:bg-[#2A2A2A] hover:text-white transition-all">
          <LogOut className="w-5 h-5" />
        </button>
        <div className="absolute left-full ml-4 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white text-[10px] rounded px-2 py-1 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
          Logout
        </div>
      </div>
    </aside>
  );
}