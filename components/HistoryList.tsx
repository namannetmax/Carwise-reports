import React from 'react';
import { AnalysisResult } from '../types';
import { Trash2, ExternalLink, Calendar, Gauge, Tag, GitCompareArrows } from 'lucide-react';
import RiskBadge from './RiskBadge';

interface HistoryListProps {
  history: AnalysisResult[];
  onSelect: (report: AnalysisResult) => void;
  onDelete: (id: string) => void;
  selectedIds: string[];
  onToggleSelect: (id: string) => void;
  onCompare: () => void;
}

const HistoryList: React.FC<HistoryListProps> = ({ 
  history, 
  onSelect, 
  onDelete, 
  selectedIds, 
  onToggleSelect,
  onCompare
}) => {
  if (history.length === 0) return null;

  return (
    <div className="mt-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 animate-fade-in-up">
      <div className="flex flex-col md:flex-row justify-between items-end md:items-center mb-6 gap-4">
        <div>
          <h3 className="text-xl font-bold text-zinc-800 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-zinc-500" />
            Recent Analysis History
          </h3>
          <p className="text-sm text-zinc-500 mt-1">Select 2-3 vehicles to compare them side-by-side.</p>
        </div>
        <button
          onClick={onCompare}
          disabled={selectedIds.length < 2 || selectedIds.length > 3}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-mono text-[10px] uppercase tracking-widest transition-all shadow-md
            ${selectedIds.length >= 2 && selectedIds.length <= 3 
              ? 'bg-zinc-900 text-white hover:bg-zinc-800 border border-zinc-800' 
              : 'bg-zinc-100 text-zinc-400 cursor-not-allowed border border-zinc-200 shadow-none'
            }`}
        >
          <GitCompareArrows className="w-3 h-3" />
          Compare ({selectedIds.length})
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {history.map((item) => {
          const isSelected = selectedIds.includes(item.id);
          const date = new Date(item.timestamp).toLocaleDateString();
          
          return (
            <div 
              key={item.id} 
              className={`bg-white rounded-xl p-5 border transition-all duration-200 relative group
                ${isSelected ? 'border-violet-500 ring-2 ring-violet-100 shadow-lg' : 'border-zinc-200 hover:border-violet-200 hover:shadow-md'}
              `}
            >
              {/* Selection Checkbox */}
              <div className="absolute top-4 right-4 z-10">
                <input 
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => onToggleSelect(item.id)}
                  className="w-5 h-5 rounded border-zinc-300 text-violet-600 focus:ring-violet-500 cursor-pointer"
                />
              </div>

              <div 
                className="cursor-pointer"
                onClick={() => onSelect(item)}
              >
                <div className="flex items-start justify-between mb-3 pr-8">
                  <h4 className="font-bold text-zinc-800 text-lg leading-tight">
                    {item.carDetails.year} {item.carDetails.make} {item.carDetails.model}
                  </h4>
                </div>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  <RiskBadge level={item.report.riskLevel} />
                  <span className="px-3 py-1 rounded-full bg-zinc-100 text-zinc-600 text-xs font-bold border border-zinc-200 flex items-center gap-1">
                    <Gauge className="w-3 h-3" />
                    {item.report.reliabilityScore}/10
                  </span>
                </div>

                <div className="flex items-center gap-4 text-xs text-zinc-500 mb-4 font-medium">
                  <span className="flex items-center gap-1">
                    <Tag className="w-3 h-3" />
                    ${item.carDetails.price.toLocaleString()}
                  </span>
                  <span className="flex items-center gap-1">
                    <Gauge className="w-3 h-3" />
                    {item.carDetails.mileage.toLocaleString()} mi
                  </span>
                  <span>{date}</span>
                </div>
              </div>

              <div className="pt-4 border-t border-zinc-100 flex justify-between items-center">
                 <button 
                   onClick={() => onSelect(item)}
                   className="text-violet-600 hover:text-violet-800 font-mono text-[10px] uppercase tracking-widest flex items-center gap-1.5"
                 >
                   Access Report <ExternalLink className="w-3 h-3" />
                 </button>
                 <button 
                   onClick={(e) => { e.stopPropagation(); onDelete(item.id); }}
                   className="text-zinc-400 hover:text-rose-500 transition-colors p-2 -mr-2"
                   title="Delete Report"
                 >
                   <Trash2 className="w-4 h-4" />
                 </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default HistoryList;