import React from 'react';
import { AnalysisResult } from '../types';
import RiskBadge from './RiskBadge';
import FormattedText from './FormattedText';
import { ArrowLeft, CheckCircle, AlertTriangle, Trophy, Camera } from 'lucide-react';

interface ComparisonViewProps {
  reports: AnalysisResult[];
  onBack: () => void;
}

const ComparisonView: React.FC<ComparisonViewProps> = ({ reports, onBack }) => {
  
  // Find the winner based on reliability score
  const winner = reports.reduce((prev, current) => 
    (prev.report.reliabilityScore > current.report.reliabilityScore) ? prev : current
  );

  return (
    <div className="animate-fade-in-up pb-12">
      <div className="mb-6 flex items-center justify-between">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-zinc-600 hover:text-violet-600 font-semibold transition-colors bg-white px-4 py-2 rounded-lg border border-zinc-200 shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Search
        </button>
        <h2 className="text-3xl font-display font-bold text-zinc-900">Vehicle Comparison</h2>
      </div>

      <div className="overflow-x-auto pb-4">
        <div className="min-w-[800px] bg-white rounded-3xl shadow-2xl border border-zinc-200 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-zinc-900 border-b border-zinc-800">
                <th className="p-6 w-48 text-zinc-400 font-mono text-[10px] uppercase tracking-[0.2em]">Feature Matrix</th>
                {reports.map((item) => (
                  <th key={item.id} className="p-6 relative text-white">
                    {winner.id === item.id && (
                      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -mt-3 bg-violet-500 text-white text-[9px] font-mono font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow-lg uppercase tracking-widest">
                        <Trophy className="w-3 h-3" /> Architect Pick
                      </div>
                    )}
                    <div className="mb-4 aspect-video rounded-xl overflow-hidden border border-zinc-800 bg-zinc-800 flex items-center justify-center">
                      {item.carDetails.images && item.carDetails.images.length > 0 ? (
                        <img src={item.carDetails.images[0]} className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500" alt="Car preview" />
                      ) : (
                        <Camera className="w-8 h-8 text-zinc-700" />
                      )}
                    </div>
                    <div className="text-xl font-display font-bold text-white leading-tight mb-1">
                      {item.carDetails.year} {item.carDetails.make}
                    </div>
                    <div className="text-sm text-zinc-400 font-mono uppercase tracking-wider">
                      {item.carDetails.model}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              
              {/* Key Specs */}
              <tr>
                <td className="p-6 bg-zinc-50 font-mono text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Price & Odometer</td>
                {reports.map((item) => (
                  <td key={item.id} className="p-6">
                    <div className="font-mono font-bold text-zinc-900 text-lg">${item.carDetails.price.toLocaleString()}</div>
                    <div className="font-mono text-xs text-zinc-500 uppercase tracking-tight">{item.carDetails.mileage.toLocaleString()} MI</div>
                  </td>
                ))}
              </tr>

              {/* Risk & Score */}
              <tr>
                <td className="p-6 bg-zinc-50 font-mono text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Diagnostic Score</td>
                {reports.map((item) => (
                  <td key={item.id} className="p-6">
                    <div className="flex flex-col gap-3 items-start">
                       <div className="flex items-center gap-2">
                         <span className={`text-3xl font-mono font-bold tracking-tighter
                           ${item.report.reliabilityScore >= 8 ? 'text-cyan-600' : 
                             item.report.reliabilityScore >= 6 ? 'text-yellow-600' : 
                             item.report.reliabilityScore >= 4 ? 'text-amber-600' : 'text-rose-600'}`}>
                           {item.report.reliabilityScore.toFixed(1)}
                         </span>
                         <span className="font-mono text-[9px] text-zinc-400 font-bold uppercase tracking-widest">/ 10.0</span>
                       </div>
                       <RiskBadge level={item.report.riskLevel} />
                    </div>
                  </td>
                ))}
              </tr>

              {/* Verdict */}
              <tr>
                <td className="p-6 bg-zinc-50 font-mono text-[10px] font-bold text-zinc-400 uppercase tracking-widest align-top">Architect Verdict</td>
                {reports.map((item) => (
                  <td key={item.id} className="p-6 align-top">
                    <p className="text-sm font-bold text-zinc-900 leading-relaxed font-display mb-2">
                      <FormattedText text={item.report.verdict} />
                    </p>
                    <p className="text-xs text-zinc-500 leading-relaxed font-medium">
                      <FormattedText text={item.report.nonTechnicalSummary} />
                    </p>
                  </td>
                ))}
              </tr>

              {/* Price Analysis */}
              <tr>
                <td className="p-6 bg-zinc-50/50 font-semibold text-zinc-700 align-top">Value Analysis</td>
                {reports.map((item) => (
                  <td key={item.id} className="p-6 align-top">
                    <p className="text-sm text-zinc-600 leading-relaxed">
                      <FormattedText text={item.report.priceAnalysis} />
                    </p>
                  </td>
                ))}
              </tr>

              {/* Common Issues */}
              <tr>
                <td className="p-6 bg-zinc-50/50 font-semibold text-zinc-700 align-top">Top Concerns</td>
                {reports.map((item) => (
                  <td key={item.id} className="p-6 align-top">
                    <ul className="space-y-2">
                      {item.report.commonIssues.slice(0, 3).map((issue, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-xs text-rose-700">
                          <AlertTriangle className="w-3 h-3 mt-0.5 shrink-0" />
                          <span><FormattedText text={issue} /></span>
                        </li>
                      ))}
                      {item.report.commonIssues.length > 3 && (
                        <li className="text-xs text-zinc-400 italic">+{item.report.commonIssues.length - 3} more...</li>
                      )}
                    </ul>
                  </td>
                ))}
              </tr>

              {/* Positives */}
               <tr>
                <td className="p-6 bg-zinc-50/50 font-semibold text-zinc-700 align-top">Positives</td>
                {reports.map((item) => (
                  <td key={item.id} className="p-6 align-top">
                    <ul className="space-y-2">
                      {item.report.positiveIndicators.slice(0, 3).map((pos, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-xs text-cyan-700">
                          <CheckCircle className="w-3 h-3 mt-0.5 shrink-0" />
                          <span><FormattedText text={pos} /></span>
                        </li>
                      ))}
                    </ul>
                  </td>
                ))}
              </tr>

            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ComparisonView;