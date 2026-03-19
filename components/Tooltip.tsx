import React, { useState } from 'react';
import { HelpCircle } from 'lucide-react';

interface TooltipProps {
  term: string;
  definition: string;
}

const Tooltip: React.FC<TooltipProps> = ({ term, definition }) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <span 
      className="relative inline-block"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      onClick={() => setIsVisible(!isVisible)} // Mobile support
    >
      <span className="cursor-help border-b-2 border-dashed border-indigo-400 text-slate-800 font-medium hover:bg-indigo-50 transition-colors inline-flex items-center gap-0.5">
        {term}
        <HelpCircle className="w-3 h-3 text-indigo-400 inline-block align-top mb-1" />
      </span>
      
      {isVisible && (
        <div className="absolute z-[9999] w-72 px-4 py-3 mt-2 text-sm text-left bg-slate-900 text-white rounded-xl shadow-2xl left-1/2 transform -translate-x-1/2 animate-fade-in pointer-events-none">
          <div className="absolute top-0 left-1/2 w-3 h-3 bg-slate-900 transform -translate-x-1/2 -translate-y-1.5 rotate-45"></div>
          <p className="font-semibold text-indigo-300 text-[10px] uppercase tracking-wider mb-1">Mechanic's Note</p>
          <p className="leading-relaxed text-slate-100 whitespace-normal">{definition}</p>
        </div>
      )}
    </span>
  );
};

export default Tooltip;