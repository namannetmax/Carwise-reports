import React from 'react';
import { Check, X, Crown, Zap, ShieldCheck, Sparkles } from 'lucide-react';
import { SubscriptionPlan } from '../types';

interface PricingModalProps {
  onClose: () => void;
  onUpgrade: (plan: SubscriptionPlan) => void;
  currentPlan: SubscriptionPlan;
}

const PricingModal: React.FC<PricingModalProps> = ({ onClose, onUpgrade, currentPlan }) => {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-zinc-900/60 backdrop-blur-md" onClick={onClose} />
      
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-4xl overflow-hidden animate-in fade-in zoom-in duration-300">
        <button onClick={onClose} className="absolute top-6 right-6 p-2 hover:bg-zinc-100 rounded-full text-zinc-400">
          <X className="w-6 h-6" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Free Plan */}
          <div className="p-10 bg-zinc-50 border-r border-zinc-100">
            <h3 className="text-xl font-bold text-zinc-800 mb-2">Free Plan</h3>
            <div className="flex items-baseline gap-1 mb-8">
              <span className="text-4xl font-extrabold text-zinc-900">$0</span>
              <span className="text-zinc-500 font-medium">/forever</span>
            </div>
            
            <ul className="space-y-4 mb-10">
              <li className="flex items-center gap-3 text-zinc-600">
                <Check className="w-5 h-5 text-cyan-500" />
                <span>3 Car Analysis Reports</span>
              </li>
              <li className="flex items-center gap-3 text-zinc-600">
                <Check className="w-5 h-5 text-cyan-500" />
                <span>Standard Market Research</span>
              </li>
              <li className="flex items-center gap-3 text-zinc-400">
                <X className="w-5 h-5" />
                <span className="line-through">Car Photo Analysis</span>
              </li>
              <li className="flex items-center gap-3 text-zinc-400">
                <X className="w-5 h-5" />
                <span className="line-through">Detailed Technical Summary</span>
              </li>
            </ul>

            <button 
              disabled={currentPlan === 'free'}
              onClick={() => onUpgrade('free')}
              className={`w-full py-3 rounded-lg font-mono text-[10px] uppercase tracking-widest transition-all 
                ${currentPlan === 'free' 
                  ? 'bg-zinc-100 text-zinc-400 cursor-default border border-zinc-200' 
                  : 'bg-white border border-zinc-200 text-zinc-700 hover:bg-zinc-50 shadow-sm'}`}
            >
              {currentPlan === 'free' ? 'Active Configuration' : 'Select Basic Tier'}
            </button>
          </div>

          {/* Premium Plan */}
          <div className="p-10 relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-violet-600 text-white px-8 py-2 rotate-45 translate-x-10 translate-y-4 font-bold text-xs uppercase tracking-widest">
              Best Value
            </div>
            
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-xl font-bold text-violet-600">Premium Plan</h3>
              <Sparkles className="w-5 h-5 text-yellow-400 fill-yellow-400" />
            </div>
            
            <div className="flex items-baseline gap-1 mb-8">
              <span className="text-4xl font-extrabold text-zinc-900">$10</span>
              <span className="text-zinc-500 font-medium">/month</span>
            </div>
            
            <ul className="space-y-4 mb-10">
              <li className="flex items-center gap-3 text-zinc-700 font-medium">
                <Zap className="w-5 h-5 text-violet-500 fill-violet-500" />
                <span>Unlimited Car Analysis</span>
              </li>
              <li className="flex items-center gap-3 text-zinc-700 font-medium">
                <Crown className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                <span>Photo & CarFax Analysis</span>
              </li>
              <li className="flex items-center gap-3 text-zinc-700 font-medium">
                <ShieldCheck className="w-5 h-5 text-violet-500 fill-violet-500" />
                <span>Pro Technical Insights</span>
              </li>
              <li className="flex items-center gap-3 text-violet-600 font-bold italic">
                <Sparkles className="w-5 h-5" />
                <span>AI Negotiation Scripts (Coming Soon)</span>
              </li>
            </ul>

            <button 
              onClick={() => onUpgrade('premium')}
              className={`w-full py-4 rounded-lg font-mono text-[10px] uppercase tracking-widest transition-all shadow-lg
                ${currentPlan === 'premium'
                  ? 'bg-violet-950/20 text-violet-500 border border-violet-900/30'
                  : 'bg-zinc-900 text-white hover:bg-zinc-800 border border-zinc-800 shadow-violet-500/10'
                }
              `}
            >
              {currentPlan === 'premium' ? 'System Optimized' : 'Initialize Pro Access'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingModal;