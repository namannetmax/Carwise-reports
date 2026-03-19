import React, { useState, useEffect } from 'react';
import { Car, CarFront, Gauge, ShieldCheck, ChevronRight, Hop as Home, Crown, Zap } from 'lucide-react';
import InputForm from './components/InputForm';
import ReportView from './components/ReportView';
import HistoryList from './components/HistoryList';
import ComparisonView from './components/ComparisonView';
import PricingModal from './components/PricingModal';
import MockReports from './components/MockReports';
import { CarDetails, AnalysisResult, UserProfile, SubscriptionPlan } from './types';
import { analyzeCar } from './services/geminiService';
import { saveAnalysis, getHistory, deleteAnalysis, getUserProfile, updatePlan, incrementUsage } from './services/storageService';

type ViewMode = 'home' | 'report' | 'compare';

const App: React.FC = () => {
  const [view, setView] = useState<ViewMode>('home');
  const [currentResult, setCurrentResult] = useState<AnalysisResult | null>(null);
  const [editingCarDetails, setEditingCarDetails] = useState<CarDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPricing, setShowPricing] = useState(false);
  
  // Profile & History State
  const [profile, setProfile] = useState<UserProfile>(getUserProfile());
  const [history, setHistory] = useState<AnalysisResult[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  useEffect(() => {
    setHistory(getHistory());
  }, []);

  const handleAnalyze = async (details: CarDetails) => {
    if (profile.plan === 'free' && profile.analysisCount >= profile.limit) {
      setShowPricing(true);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await analyzeCar(details, profile.plan);
      const updatedHistory = saveAnalysis(data);
      const updatedProfile = incrementUsage();
      
      setHistory(updatedHistory);
      setProfile(updatedProfile);
      setCurrentResult(data);
      setView('report');
    } catch (err) {
      setError("Failed to generate report. Please try again later or check your network connection.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpgrade = (plan: SubscriptionPlan) => {
    const updated = updatePlan(plan);
    setProfile(updated);
    setShowPricing(false);
  };

  const handleDelete = (id: string) => {
    const updated = deleteAnalysis(id);
    setHistory(updated);
    setSelectedIds(prev => prev.filter(sid => sid !== id));
  };

  const handleSelectHistoryItem = (report: AnalysisResult) => {
    setCurrentResult(report);
    setView('report');
    window.scrollTo(0, 0);
  };

  const handleToggleSelect = (id: string) => {
    setSelectedIds(prev => {
      if (prev.includes(id)) {
        return prev.filter(sid => sid !== id);
      } else {
        if (prev.length >= 3) return prev;
        return [...prev, id];
      }
    });
  };

  const handleCompare = () => {
    if (selectedIds.length >= 2) {
      setView('compare');
      window.scrollTo(0, 0);
    }
  };

  const handleEdit = (details: CarDetails) => {
    setEditingCarDetails(details);
    setView('home');
    window.scrollTo(0, 0);
  };

  const goHome = () => {
    setView('home');
    setCurrentResult(null);
    setEditingCarDetails(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 pb-20">
      {showPricing && (
        <PricingModal 
          currentPlan={profile.plan} 
          onClose={() => setShowPricing(false)} 
          onUpgrade={handleUpgrade} 
        />
      )}

      {/* Navigation */}
      <nav className="bg-white border-b border-zinc-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2 cursor-pointer" onClick={goHome}>
              <div className="p-2 bg-violet-600 rounded-lg">
                <CarFront className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-zinc-900">
                CarWise <span className="text-violet-600">AI</span>
              </span>
            </div>
            
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setShowPricing(true)}
                className={`flex items-center gap-2 px-4 py-1.5 rounded-lg font-mono text-[10px] uppercase tracking-widest transition-all
                  ${profile.plan === 'premium' 
                    ? 'bg-amber-50 text-amber-700 border border-amber-200 shadow-sm' 
                    : 'bg-zinc-900 text-white hover:bg-zinc-800 border border-zinc-800 shadow-sm'}`}
              >
                {profile.plan === 'premium' ? <><Crown className="w-3 h-3 text-amber-500" /> Premium Active</> : <><Zap className="w-3 h-3 text-violet-400" /> Unlock Pro</>}
              </button>
              
              {view !== 'home' && (
                <button onClick={goHome} className="text-sm font-medium text-zinc-500 hover:text-violet-600 flex items-center gap-1">
                  <Home className="w-4 h-4" /> Dashboard
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {view === 'home' && (
        <div className="relative overflow-hidden bg-zinc-950 text-white mb-12 py-20">
           <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-10 grayscale"></div>
           <div className="absolute inset-0 bg-gradient-to-b from-zinc-950/50 via-zinc-950 to-zinc-950"></div>
           
           {/* Decorative grid */}
           <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#3f3f46 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>

           <div className="max-w-7xl mx-auto px-4 relative z-10 flex flex-col items-center text-center">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-px w-12 bg-violet-500/50"></div>
                <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-violet-400">Automotive Risk Architect</span>
                <div className="h-px w-12 bg-violet-500/50"></div>
              </div>
              <h1 className="text-5xl md:text-7xl font-display font-bold tracking-tight mb-6 leading-none">
                Don't Buy a <span className="text-violet-500 underline decoration-violet-500/30 underline-offset-8">Lemon</span>.
              </h1>
              <p className="text-lg text-zinc-400 max-w-2xl mb-8 font-medium leading-relaxed">
                Professional-grade AI diagnostics for used car buyers. 
                We cross-reference thousands of technical sources to architect your risk profile.
              </p>
              
              <div className="flex items-center gap-6 font-mono text-[10px] uppercase tracking-widest text-zinc-500">
                <span className="flex items-center gap-2"><Gauge className="w-3 h-3" /> Real-time Data</span>
                <span className="flex items-center gap-2"><ShieldCheck className="w-3 h-3" /> Risk Assessment</span>
                <span className="flex items-center gap-2"><Car className="w-3 h-3" /> Technical Specs</span>
              </div>
           </div>
        </div>
      )}

      <main className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 transition-all duration-500 ${view === 'home' ? '-mt-16 relative z-20' : 'mt-10'}`}>
        {error && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 flex items-center gap-3">
             <ShieldCheck className="w-5 h-5" />
             {error}
          </div>
        )}

        {view === 'home' && (
          <>
            <InputForm
              onAnalyze={handleAnalyze}
              isLoading={loading}
              plan={profile.plan}
              usageCount={profile.analysisCount}
              limit={profile.limit}
              onShowPricing={() => setShowPricing(true)}
              initialData={editingCarDetails}
            />
            <MockReports onSelect={handleSelectHistoryItem} />
            <HistoryList
              history={history}
              onSelect={handleSelectHistoryItem}
              onDelete={handleDelete}
              selectedIds={selectedIds}
              onToggleSelect={handleToggleSelect}
              onCompare={handleCompare}
            />
          </>
        )}

        {view === 'report' && currentResult && (
          <ReportView data={currentResult} onBack={goHome} onEdit={handleEdit} />
        )}

        {view === 'compare' && (
           <ComparisonView reports={history.filter(h => selectedIds.includes(h.id))} onBack={goHome} />
        )}
      </main>
      
      {loading && (
        <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-[110] flex flex-col items-center justify-center text-center px-4">
          <div className="relative">
             <div className="w-20 h-20 border-4 border-zinc-100 rounded-full animate-spin"></div>
             <div className="absolute top-0 left-0 w-20 h-20 border-4 border-violet-600 rounded-full animate-spin border-t-transparent"></div>
             <Car className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 text-violet-600 animate-bounce" />
          </div>
          <h3 className="mt-8 text-xl font-bold text-zinc-800">Deep Search in Progress...</h3>
          <p className="mt-2 text-zinc-500 text-sm max-w-xs leading-relaxed italic">
            "Scanning service bulletins, forum complaints, and historical reliability data..."
          </p>
        </div>
      )}
    </div>
  );
};

export default App;