'use client';

import { MODE_CONFIGS } from '@/lib/prompts';
import { AnalysisMode } from '@/lib/types';

interface ModeSelectorProps {
    selectedMode: AnalysisMode;
    onModeChange: (mode: AnalysisMode) => void;
}

export function ModeSelector({ selectedMode, onModeChange }: ModeSelectorProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {MODE_CONFIGS.map((mode) => (
                <button
                    key={mode.id}
                    onClick={() => onModeChange(mode.id)}
                    className={`
            p-6 rounded-lg border-2 transition-all text-left flex items-start gap-4
            ${selectedMode === mode.id
                            ? `${mode.color} ${mode.borderColor} text-white shadow-lg scale-[1.02]`
                            : 'bg-gray-800 border-gray-700 text-gray-300 hover:border-gray-600 hover:bg-gray-700'}
          `}
                >
                    <div className="text-4xl">{mode.icon}</div>
                    <div>
                        <h3 className="font-bold text-lg">{mode.name}</h3>
                        <p className="text-sm opacity-90">{mode.description}</p>
                    </div>
                </button>
            ))}
        </div>
    );
}
