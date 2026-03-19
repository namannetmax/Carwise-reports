import React from 'react';
import { RiskLevel } from '../types';
import { AlertTriangle, CheckCircle, AlertOctagon } from 'lucide-react';

interface RiskBadgeProps {
  level: RiskLevel;
}

const RiskBadge: React.FC<RiskBadgeProps> = ({ level }) => {
  const getStyles = () => {
    switch (level) {
      case RiskLevel.LOW:
        return {
          bg: 'bg-cyan-100',
          text: 'text-cyan-800',
          border: 'border-cyan-200',
          icon: <CheckCircle className="w-5 h-5" />,
          label: 'Low Risk'
        };
      case RiskLevel.MODERATE:
        return {
          bg: 'bg-yellow-100',
          text: 'text-yellow-800',
          border: 'border-yellow-200',
          icon: <AlertTriangle className="w-5 h-5" />,
          label: 'Moderate Risk'
        };
      case RiskLevel.HIGH:
        return {
          bg: 'bg-amber-100',
          text: 'text-amber-800',
          border: 'border-amber-200',
          icon: <AlertOctagon className="w-5 h-5" />,
          label: 'High Risk'
        };
      case RiskLevel.CRITICAL:
        return {
          bg: 'bg-rose-100',
          text: 'text-rose-800',
          border: 'border-rose-200',
          icon: <AlertOctagon className="w-5 h-5" />,
          label: 'Critical Risk'
        };
    }
  };

  const style = getStyles();

  return (
    <div className={`flex items-center gap-2 px-4 py-2 rounded-full border ${style.bg} ${style.border} ${style.text}`}>
      {style.icon}
      <span className="font-bold text-sm uppercase tracking-wide">{style.label}</span>
    </div>
  );
};

export default RiskBadge;
