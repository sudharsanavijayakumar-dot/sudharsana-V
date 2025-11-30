import React from 'react';
import { NAV_ITEMS } from '../constants';
import { ViewMode } from '../types';

interface NavigationProps {
  currentMode: ViewMode;
  onModeChange: (mode: ViewMode) => void;
  disabled: boolean;
}

export const Navigation: React.FC<NavigationProps> = ({ currentMode, onModeChange, disabled }) => {
  return (
    <nav className="flex justify-center space-x-4 md:space-x-8 py-6 border-b border-mystic-700 bg-mystic-900/50 backdrop-blur-md sticky top-0 z-50">
      {NAV_ITEMS.map((item) => {
        const Icon = item.icon;
        const isActive = currentMode === item.id;
        
        return (
          <button
            key={item.id}
            onClick={() => onModeChange(item.id as ViewMode)}
            disabled={disabled}
            className={`flex flex-col items-center group transition-all duration-300 ${
              disabled ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer hover:scale-105'
            }`}
          >
            <div className={`p-3 rounded-full transition-colors duration-300 ${
              isActive 
                ? 'bg-mystic-accent text-mystic-900 shadow-[0_0_15px_rgba(212,175,55,0.5)]' 
                : 'bg-mystic-800 text-gray-400 group-hover:bg-mystic-700 group-hover:text-mystic-accent'
            }`}>
              <Icon size={24} />
            </div>
            <span className={`text-xs mt-2 font-serif tracking-wider ${
              isActive ? 'text-mystic-accent' : 'text-gray-500 group-hover:text-gray-300'
            }`}>
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};