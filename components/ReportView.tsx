import React, { useState, useEffect } from 'react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { AnalysisResult, RecallItem, CarDetails } from '../types';
import ScoreGauge from './ScoreGauge';
import RiskBadge from './RiskBadge';
import FormattedText from './FormattedText';
import FeedbackSection from './FeedbackSection';
import { saveFeedback } from '../services/storageService';
import { 
  Wrench, 
  Search, 
  ThumbsUp, 
  AlertCircle, 
  Activity, 
  BookOpen, 
  DollarSign, 
  ExternalLink,
  CheckCircle,
  Sparkles,
  Camera,
  FileCheck,
  ShieldAlert,
  AlertTriangle,
  ArrowUp,
  ChevronRight,
  Download,
  Edit
} from 'lucide-react';

interface ReportViewProps {
  data: AnalysisResult;
  onBack: () => void;
  onEdit?: (details: CarDetails) => void;
}

const ReportView: React.FC<ReportViewProps> = ({ data, onBack, onEdit }) => {
  const { report, sources, carDetails } = data;
  const carName = `${carDetails.year} ${carDetails.make} ${carDetails.model}`;
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const navRef = React.useRef<HTMLDivElement>(null);
  const [showLeftScroll, setShowLeftScroll] = useState(false);
  const [showRightScroll, setShowRightScroll] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 500);
    };

    const checkScroll = () => {
      if (navRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = navRef.current;
        setShowLeftScroll(scrollLeft > 0);
        setShowRightScroll(scrollLeft < scrollWidth - clientWidth - 1); // -1 for tolerance
      }
    };

    window.addEventListener('scroll', handleScroll);
    navRef.current?.addEventListener('scroll', checkScroll);
    window.addEventListener('resize', checkScroll);
    checkScroll(); // Initial check

    return () => {
      window.removeEventListener('scroll', handleScroll);
      navRef.current?.removeEventListener('scroll', checkScroll);
      window.removeEventListener('resize', checkScroll);
    };
  }, []);

  const getRecallColor = (severity: string) => {
    switch (severity) {
      case 'Critical': return 'bg-rose-950/20 border-rose-900/30 text-rose-400';
      case 'Moderate': return 'bg-amber-950/20 border-amber-900/30 text-amber-400';
      default: return 'bg-violet-950/20 border-violet-900/30 text-violet-400';
    }
  };

  const navItems = [
    { id: 'overview', label: 'Overview', icon: Activity },
    { id: 'insights', label: 'Key Insights', icon: Wrench },
    { id: 'deep-dive', label: 'Deep Dive', icon: Search },
    { id: 'safety', label: 'Safety', icon: ShieldAlert },
    { id: 'checklist', label: 'Checklist', icon: FileCheck },
    { id: 'history', label: 'History', icon: BookOpen },
  ];

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 120; // Account for main header (64px) + diagnostic nav (~50px)
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const scrollNav = (direction: 'left' | 'right') => {
    if (navRef.current) {
      const scrollAmount = navRef.current.clientWidth / 2; // Scroll half the visible width
      navRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  const generatePDF = async () => {
    const element = document.getElementById('report-content');
    if (!element) return;

    setIsGeneratingPdf(true);
    try {
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#fafafa', // match zinc-50
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgHeight = (canvas.height * pdfWidth) / canvas.width;
      
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight);
      heightLeft -= pdfHeight;

      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight);
        heightLeft -= pdfHeight;
      }

      const filename = `CarWise_Report_${carDetails.year}_${carDetails.make}_${carDetails.model}.pdf`.replace(/\s+/g, '_');
      pdf.save(filename);
    } catch (error) {
      console.error('Failed to generate PDF:', error);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const handleFeedbackSubmit = (feedback: { rating: 'positive' | 'negative'; comment: string }) => {
    saveFeedback({
      id: crypto.randomUUID(),
      reportId: data.id,
      rating: feedback.rating,
      comment: feedback.comment,
      timestamp: Date.now(),
    });
  };

  return (
    <div className="space-y-12 animate-fade-in-up pb-20 relative">
      {/* Sticky Navigation */}
      <nav className="sticky top-16 z-40 bg-white/80 backdrop-blur-md border-b border-zinc-200 -mx-4 px-4 py-3 mb-8 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-6">
          {showLeftScroll && (
            <button
              onClick={() => scrollNav('left')}
              className="absolute left-0 top-1/2 -translate-y-1/2 bg-gradient-to-r from-white via-white/80 to-transparent w-12 h-full flex items-center justify-start pr-6 z-10 lg:hidden"
            >
              <ChevronRight className="w-5 h-5 text-zinc-500 rotate-180" />
            </button>
          )}
          <div ref={navRef} className="flex items-center gap-6 overflow-x-auto no-scrollbar scroll-smooth flex-grow">
            <button 
              onClick={onBack}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg hover:bg-zinc-100 transition-colors whitespace-nowrap group border-r border-zinc-200 pr-6 mr-2 shrink-0"
            >
              <ChevronRight className="w-4 h-4 text-zinc-500 group-hover:text-violet-600 transition-colors rotate-180" />
              <span className="font-mono text-[10px] font-bold text-zinc-700 group-hover:text-zinc-900 uppercase tracking-widest">
                Back
              </span>
            </button>
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-zinc-100 transition-colors whitespace-nowrap group shrink-0"
              >
                <item.icon className="w-4 h-4 text-zinc-500 group-hover:text-violet-600 transition-colors" />
                <span className="font-mono text-[10px] font-bold text-zinc-700 group-hover:text-zinc-900 uppercase tracking-widest">
                  {item.label}
                </span>
              </button>
            ))}
          </div>
          {showRightScroll && (
            <button
              onClick={() => scrollNav('right')}
              className="absolute right-0 top-1/2 -translate-y-1/2 bg-gradient-to-l from-white via-white/80 to-transparent w-12 h-full flex items-center justify-end pl-6 z-10 lg:hidden"
            >
              <ChevronRight className="w-5 h-5 text-zinc-500" />
            </button>
          )}
          <div className="hidden md:flex items-center gap-4">
            {onEdit && (
              <button
                onClick={() => onEdit(carDetails)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-zinc-200 text-zinc-700 hover:bg-zinc-50 hover:text-violet-600 transition-colors"
              >
                <Edit className="w-3.5 h-3.5" />
                <span className="font-mono text-[9px] font-bold uppercase tracking-widest">
                  Edit Inputs
                </span>
              </button>
            )}
            <button
              onClick={generatePDF}
              disabled={isGeneratingPdf}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 text-white hover:bg-zinc-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isGeneratingPdf ? (
                <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Download className="w-3.5 h-3.5" />
              )}
              <span className="font-mono text-[9px] font-bold uppercase tracking-widest">
                {isGeneratingPdf ? 'Generating...' : 'Export PDF'}
              </span>
            </button>

          </div>
        </div>
      </nav>

      <div id="report-content" className="space-y-12 pb-8">
        {/* Hero Diagnostic Header */}
      <div id="overview" className="relative bg-zinc-950 rounded-3xl shadow-2xl border border-zinc-800 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,#27272a_0%,transparent_70%)] opacity-50"></div>
        
        <div className="relative p-8 md:p-12 flex flex-col md:flex-row gap-12 items-center">
          <div className="flex-shrink-0">
            <ScoreGauge score={report.reliabilityScore} />
          </div>
          
          <div className="flex-grow space-y-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="font-mono text-[10px] text-violet-400 uppercase tracking-[0.3em] bg-violet-400/10 px-2 py-1 rounded border border-violet-400/20">
                    System Diagnostic v2.5
                  </span>
                  {carDetails.carfaxReport && (
                    <span className="font-mono text-[10px] text-cyan-400 uppercase tracking-[0.3em] bg-cyan-400/10 px-2 py-1 rounded border border-cyan-400/20">
                      Verified History
                    </span>
                  )}
                </div>
                <h2 className="text-4xl md:text-6xl font-display font-bold text-white tracking-tight leading-none">
                  {carName}
                </h2>
              </div>
              <RiskBadge level={report.riskLevel} />
            </div>

            <div className="h-px bg-gradient-to-r from-zinc-800 via-zinc-700 to-transparent"></div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <h3 className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest">Our Verdict</h3>
                <p className="text-xl text-zinc-200 font-medium leading-tight">
                  <FormattedText text={report.verdict} />
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest">Market Value Index</h3>
                <p className="text-zinc-400 text-sm leading-relaxed">
                  <FormattedText text={report.priceAnalysis} />
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Diagnostic Grid Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Technical Readout */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Risk Architect Deduction Logic - Table Style */}
          <section id="insights" className="bg-white rounded-2xl shadow-sm border border-zinc-200 overflow-hidden">
            <div className="bg-zinc-50 px-6 py-4 border-b border-zinc-200 flex justify-between items-center">
              <h3 className="font-serif italic text-xl text-zinc-900">Key Findings</h3>
              <span className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest">Ref: ARCH-DIAG-001</span>
            </div>
            <div className="divide-y divide-zinc-100">
              {report.deductionLogic.map((item, idx) => (
                <div key={idx} className="grid grid-cols-1 md:grid-cols-4 hover:bg-zinc-50 transition-colors group">
                  <div className="p-6 md:border-r border-zinc-100 flex flex-col justify-center">
                    <span className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest mb-1">Category</span>
                    <span className="font-bold text-zinc-800 text-sm">{item.category}</span>
                  </div>
                  <div className="p-6 md:col-span-2">
                    <span className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest mb-1">Reasoning</span>
                    <p className="text-sm text-zinc-600 leading-relaxed">
                      <FormattedText text={item.reasoning} />
                    </p>
                  </div>
                  <div className="p-6 flex flex-col justify-center items-end bg-zinc-50/50 group-hover:bg-zinc-100/50 transition-colors">
                    <span className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest mb-1">Impact</span>
                    <span className={`font-mono font-bold text-lg ${item.deduction > 0 ? 'text-rose-600' : 'text-cyan-600'}`}>
                      {item.deduction > 0 ? `-${item.deduction.toFixed(2)}` : '0.00'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <div className="bg-zinc-900 p-4 flex justify-between items-center text-white">
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] opacity-50">Final Reliability Score</span>
              <span className="font-mono text-2xl font-bold tracking-tighter">{report.reliabilityScore.toFixed(1)} / 10.0</span>
            </div>
          </section>

          {/* Technical Deep Dive */}
          <section id="deep-dive" className="bg-white rounded-2xl shadow-sm border border-zinc-200 p-8">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-px bg-zinc-200"></div>
              <h3 className="font-serif italic text-2xl text-zinc-900">Technical Deep Dive</h3>
              <div className="flex-grow h-px bg-zinc-200"></div>
            </div>
            <div className="prose prose-zinc max-w-none">
              <p className="text-zinc-600 leading-relaxed text-base first-letter:text-4xl first-letter:font-serif first-letter:mr-2 first-letter:float-left first-letter:text-zinc-900">
                <FormattedText text={report.technicalSummary} />
              </p>
            </div>
            
            <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h4 className="font-mono text-[10px] text-rose-500 uppercase tracking-widest flex items-center gap-2">
                  <AlertCircle className="w-3 h-3" /> Critical Failure Points
                </h4>
                <div className="space-y-3">
                  {report.commonIssues.map((issue, idx) => (
                    <div key={idx} className="flex gap-3 p-3 rounded-lg bg-rose-50 border border-rose-100 text-sm text-rose-900">
                      <span className="font-mono text-[10px] opacity-50 mt-0.5">{String(idx + 1).padStart(2, '0')}</span>
                      <FormattedText text={issue} />
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="space-y-4">
                <h4 className="font-mono text-[10px] text-cyan-600 uppercase tracking-widest flex items-center gap-2">
                  <ThumbsUp className="w-3 h-3" /> Positive Indicators
                </h4>
                <div className="space-y-3">
                  {report.positiveIndicators.map((item, idx) => (
                    <div key={idx} className="flex gap-3 p-3 rounded-lg bg-cyan-50 border border-cyan-100 text-sm text-cyan-900">
                      <span className="font-mono text-[10px] opacity-50 mt-0.5">{String(idx + 1).padStart(2, '0')}</span>
                      <FormattedText text={item} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Right Column: Sidebar Data */}
        <div className="lg:col-span-4 space-y-8">
          
          {/* Recalls Sidebar */}
          <section id="safety" className="bg-zinc-900 rounded-2xl shadow-xl border border-zinc-800 p-6 text-white">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">Safety Alerts</h3>
              <ShieldAlert className="w-4 h-4 text-yellow-500" />
            </div>
            
            {report.recalls && report.recalls.length > 0 ? (
              <div className="space-y-4">
                {report.recalls.map((recall, idx) => (
                  <div key={idx} className={`p-4 rounded-xl border ${getRecallColor(recall.severity)}`}>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-bold text-xs flex items-center gap-2">
                        <AlertTriangle className="w-3 h-3" />
                        {recall.title}
                      </h4>
                    </div>
                    <p className="text-[11px] leading-relaxed opacity-80">
                      <FormattedText text={recall.description} />
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center p-8 text-center border border-dashed border-zinc-800 rounded-xl">
                <CheckCircle className="w-8 h-8 text-cyan-500 mb-3 opacity-50" />
                <span className="text-xs font-mono text-zinc-500 uppercase tracking-widest">No Active Recalls</span>
              </div>
            )}
          </section>

          {/* Inspection Checklist */}
          <section id="checklist" className="bg-white rounded-2xl shadow-sm border border-zinc-200 p-6">
            <h3 className="font-mono text-[10px] uppercase tracking-widest text-zinc-500 mb-6">Field Inspection Checklist</h3>
            <div className="space-y-4">
              {report.inspectionChecklist.map((item, idx) => (
                <div key={idx} className="flex items-start gap-4 p-4 rounded-xl border border-zinc-100 hover:border-violet-200 transition-colors group">
                  <div className="w-5 h-5 rounded border-2 border-zinc-200 group-hover:border-violet-400 transition-colors shrink-0 mt-0.5" />
                  <span className="text-xs text-zinc-600 leading-relaxed">
                    <FormattedText text={item} />
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* Smart Alternatives */}
          {report.suggestions && report.suggestions.length > 0 && (
            <section className="bg-violet-50 rounded-2xl border border-violet-100 p-6">
              <h3 className="font-mono text-[10px] uppercase tracking-widest text-violet-400 mb-6">Smart Alternatives</h3>
              <div className="space-y-4">
                {report.suggestions.map((car, idx) => (
                  <div key={idx} className="bg-white rounded-xl p-4 shadow-sm border border-violet-100">
                    <div className="flex justify-between items-baseline mb-1">
                      <h4 className="font-bold text-zinc-800 text-sm">{car.make} {car.model}</h4>
                      <span className="font-mono text-[10px] text-zinc-400">{car.year}</span>
                    </div>
                    <p className="text-[11px] text-zinc-500 leading-relaxed">
                      <FormattedText text={car.reason} />
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>

      {/* History & Sources Footer */}
      <div id="history" className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white rounded-2xl shadow-sm border border-zinc-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <FileCheck className="w-4 h-4 text-violet-500" />
              <h3 className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">History Analysis</h3>
            </div>
            <div className="text-sm text-zinc-600 leading-relaxed">
              <FormattedText text={report.carfaxInsights || "No specific history report was provided for deep analysis."} />
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-zinc-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <ShieldAlert className="w-4 h-4 text-emerald-500" />
              <h3 className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">Pre-Inspection Analysis</h3>
            </div>
            <div className="text-sm text-zinc-600 leading-relaxed">
              <FormattedText text={report.inspectionInsights || "No pre-inspection report was provided for deep analysis."} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-zinc-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <BookOpen className="w-4 h-4 text-zinc-400" />
            <h3 className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">Research Sources</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {sources.map((source, idx) => (
              <a 
                key={idx} 
                href={source.uri} 
                target="_blank" 
                rel="noopener noreferrer"
                className="font-mono text-[10px] text-violet-600 hover:text-violet-800 bg-violet-50 px-3 py-1.5 rounded border border-violet-100 transition-colors flex items-center gap-2"
              >
                <ExternalLink className="w-3 h-3" />
                {source.title}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Feedback Section */}
      <div className="pt-12 border-t border-zinc-200">
        <div className="max-w-2xl mx-auto">
          <FeedbackSection reportId={data.id} onSubmit={handleFeedbackSubmit} />
        </div>
      </div>
      </div>

      {/* Back to Top Button */}
      {showBackToTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-8 right-8 z-50 p-4 bg-zinc-900 text-white rounded-full shadow-2xl hover:bg-violet-600 transition-all duration-300 animate-fade-in group"
          aria-label="Back to top"
        >
          <ArrowUp className="w-6 h-6 group-hover:-translate-y-1 transition-transform" />
        </button>
      )}
    </div>
  );
};

export default ReportView;