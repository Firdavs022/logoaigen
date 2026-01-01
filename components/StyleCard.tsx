
import React from 'react';
import { LogoStyle } from '../types';

interface StyleCardProps {
  styleId: LogoStyle;
  label: string;
  icon: string;
  isSelected: boolean;
  onSelect: (style: LogoStyle) => void;
}

const StyleCard: React.FC<StyleCardProps> = ({ styleId, label, icon, isSelected, onSelect }) => {
  return (
    <button
      onClick={() => onSelect(styleId)}
      className={`flex flex-col items-center justify-center p-4 rounded-xl transition-all duration-300 border ${
        isSelected 
          ? 'bg-blue-600/20 border-blue-500 scale-105 shadow-lg shadow-blue-500/20' 
          : 'bg-slate-800/50 border-slate-700 hover:border-slate-500 hover:bg-slate-800'
      }`}
    >
      <div className={`text-2xl mb-2 ${isSelected ? 'text-blue-400' : 'text-slate-400'}`}>
        <i className={`fas ${icon}`}></i>
      </div>
      <span className={`text-xs font-semibold uppercase tracking-wider ${isSelected ? 'text-white' : 'text-slate-400'}`}>
        {label}
      </span>
    </button>
  );
};

export default StyleCard;
