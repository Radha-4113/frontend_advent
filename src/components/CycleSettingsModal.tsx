import { X } from 'lucide-react';
import { useState } from 'react';
import type { CycleOption } from '../App';

interface CycleSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (cycleId: number) => void;
  cycles: CycleOption[];
}

export function CycleSettingsModal({ isOpen, onClose, onApply, cycles }: CycleSettingsModalProps) {
  const [selectedCycle, setSelectedCycle] = useState(cycles[0].id);

  if (!isOpen) return null;

  const handleApply = () => {
    onApply(selectedCycle);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-md p-5 animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-gray-900 text-[16px]">Cycle Settings</h2>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4 text-gray-600" />
          </button>
        </div>

        {/* Cycle Options */}
        <div className="mb-5">
          <label className="block text-xs text-gray-700 mb-2">Select Cycle:</label>
          <div className="space-y-2">
            {cycles.map((cycle) => (
              <label
                key={cycle.id}
                className={`flex items-center justify-between p-3 rounded border-2 cursor-pointer transition-all ${
                  selectedCycle === cycle.id
                    ? 'border-[#C1121F] bg-red-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="cycle"
                    value={cycle.id}
                    checked={selectedCycle === cycle.id}
                    onChange={() => setSelectedCycle(cycle.id)}
                    className="w-4 h-4 accent-[#C1121F]"
                  />
                  <div>
                    <div className="text-gray-900 text-sm">{cycle.name}</div>
                    <div className="text-xs text-gray-600">
                      {cycle.temperature}°C • {cycle.duration} hrs
                    </div>
                  </div>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 py-1.5 px-3 rounded bg-gray-200 hover:bg-gray-300 text-gray-900 transition-colors text-sm"
          >
            Cancel
          </button>
          <button
            onClick={handleApply}
            className="flex-1 py-1.5 px-3 rounded bg-[#C1121F] hover:bg-[#A00F1A] text-white transition-colors text-sm"
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
}