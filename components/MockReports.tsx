import React from 'react';
import { TrendingDown, TrendingUp, TriangleAlert as AlertTriangle, CircleCheck as CheckCircle } from 'lucide-react';
import { AnalysisResult } from '../types';

const MockReports: React.FC<{ onSelect: (report: AnalysisResult) => void }> = ({ onSelect }) => {
  const mockReports: AnalysisResult[] = [
    {
      id: 'mock-1',
      timestamp: Date.now() - 86400000,
      carDetails: {
        year: 2018,
        make: 'Honda',
        model: 'Civic EX',
        mileage: 52000,
        price: 16800,
        description: 'Single owner, well maintained',
      },
      report: {
        reliabilityScore: 8.2,
        riskLevel: 'Low',
        technicalSummary: 'The 2018 Honda Civic EX represents a solid reliability choice with proven Honda engineering. The 1.5L turbocharged engine is known for longevity when maintained properly. This generation has minimal known defects compared to earlier iterations.',
        nonTechnicalSummary: 'This is a reliable, practical car. Honda parts are affordable, and mechanics everywhere can service it. With 52K miles and single-owner history, this vehicle shows strong care patterns.',
        carfaxInsights: 'Clean title history with regular maintenance records. No major accidents reported.',
        inspectionInsights: 'Engine runs smoothly with no unusual noises. Transmission shifts cleanly. Brake pads have 60% life remaining.',
        commonIssues: ['Occasional HVAC compressor issues at 80K+ miles', 'Transmission fluid degradation potential after 100K miles'],
        inspectionChecklist: ['Engine compression test passed', 'Timing chain inspection OK', 'Suspension components within spec', 'Exhaust system clean'],
        positiveIndicators: ['Well-maintained service history', 'Low mileage for age', 'Single owner', 'No rust concerns'],
        recalls: [
          { title: 'Seat Belt Anchor', description: 'Potential seat belt separation', severity: 'Historical' }
        ],
        priceAnalysis: 'Below market average for condition and mileage. Reasonable for the regional market.',
        suggestions: [
          { year: 2017, make: 'Toyota', model: 'Corolla', reason: 'Similar reliability, slightly lower depreciation' },
          { year: 2019, make: 'Mazda', model: 'Mazda3', reason: 'Better driving dynamics with comparable reliability' }
        ],
        deductionLogic: [
          { category: 'Mechanical Risk', deduction: 0.8, reasoning: 'Turbocharged engine adds complexity vs naturally aspirated' },
          { category: 'Mileage & Usage', deduction: 0.3, reasoning: 'Low mileage is positive factor' }
        ],
        verdict: 'Buy with confidence - excellent value for a reliable daily driver.'
      },
      sources: [
        { uri: 'https://www.nhtsa.gov', title: 'NHTSA Recalls' },
        { uri: 'https://www.cars.com', title: 'Cars.com Market Data' }
      ]
    },
    {
      id: 'mock-2',
      timestamp: Date.now() - 172800000,
      carDetails: {
        year: 2015,
        make: 'Jeep',
        model: 'Wrangler Unlimited',
        mileage: 78500,
        price: 24500,
        description: 'Off-road equipped, needs transmission work',
      },
      report: {
        reliabilityScore: 5.1,
        riskLevel: 'Moderate',
        technicalSummary: 'This JK-generation Wrangler has known transmission vulnerabilities, particularly with the 8-speed automatic variant. Earlier model years frequently experience transmission shuddering and premature failure. The 3.6L V6 engine is robust but paired with a problematic transmission.',
        nonTechnicalSummary: 'Good for off-roading but expect higher maintenance costs. The transmission is the concern here - repairs can be expensive. Consider a pre-purchase inspection focused on transmission health.',
        carfaxInsights: 'Service records show sporadic maintenance. One accident reported 18 months ago.',
        inspectionInsights: 'Transmission exhibits slight shudder under acceleration. Engine compression acceptable. Suspension shows typical off-road wear.',
        commonIssues: ['8-speed automatic transmission shudder/failure', 'Heater blend door actuator failures', 'Door latch corrosion'],
        inspectionChecklist: ['Transmission temperature normal', 'Engine knock detected during test', 'Transfer case seals weeping'],
        positiveIndicators: ['V6 engine durable', 'Off-road modifications well-done', 'Good tire tread remaining'],
        recalls: [
          { title: 'Automatic Transmission Downshift', description: 'Potential sudden downshift in automatic transmission', severity: 'Moderate' },
          { title: 'Door Hinge Corrosion', description: 'Possible door hinge separation', severity: 'Historical' }
        ],
        priceAnalysis: 'At market value but transmission concerns may warrant price negotiation. Factor in $3K-5K for transmission service.',
        suggestions: [
          { year: 2016, make: 'Toyota', model: '4Runner', reason: 'More reliable off-roader with proven transmission' },
          { year: 2014, make: 'Jeep', model: 'Wrangler', reason: 'Earlier generation with 5-speed transmission avoids 8-speed issues' }
        ],
        deductionLogic: [
          { category: 'Mechanical Risk', deduction: 3.2, reasoning: 'Known transmission failure risk - CRITICAL concern' },
          { category: 'Recall & Safety', deduction: 1.5, reasoning: 'Active transmission recall impacts safety' },
          { category: 'Ownership Cost', deduction: 1.2, reasoning: 'High maintenance potential' }
        ],
        verdict: 'Walk away unless transmission is recently replaced - too much risk at this price.'
      },
      sources: [
        { uri: 'https://www.nhtsa.gov', title: 'NHTSA Recalls' },
        { uri: 'https://www.jeepownersunited.com', title: 'Jeep Forums' }
      ]
    },
    {
      id: 'mock-3',
      timestamp: Date.now() - 259200000,
      carDetails: {
        year: 2019,
        make: 'Hyundai',
        model: 'Elantra Value',
        mileage: 41200,
        price: 13900,
        description: 'Fleet maintained, regular oil changes documented',
      },
      report: {
        reliabilityScore: 7.5,
        riskLevel: 'Low',
        technicalSummary: 'The AD-generation Elantra with 2.0L engine is a straightforward, dependable economy car. Recent Hyundai models have significantly improved quality control. This particular example shows excellent maintenance records consistent with fleet service protocols.',
        nonTechnicalSummary: 'A practical, budget-friendly choice. Well-maintained fleet vehicle means predictable service history. Good fuel economy and affordable parts make it economical to own.',
        carfaxInsights: 'Perfect maintenance record with fleet provider. No accidents, multiple oil change receipts on file.',
        inspectionInsights: 'Engine starts quickly and idles smoothly. Transmission engagement is crisp. Brakes show even wear.',
        commonIssues: ['Possible engine knock issues at high mileage', 'Brake dust accumulation (cosmetic)'],
        inspectionChecklist: ['Engine compression test good', 'Fluid levels all within spec', 'Battery health strong', 'Exhaust emissions clean'],
        positiveIndicators: ['Documented fleet maintenance', 'No accidents', 'All fluids changed regularly', 'Original paint'],
        recalls: [],
        priceAnalysis: 'Excellent value - well below market average for condition and mileage. Fleet pricing reflects volume sale.',
        suggestions: [
          { year: 2020, make: 'Kia', model: 'Forte', reason: 'Sibling platform with slightly better refinement' },
          { year: 2018, make: 'Toyota', model: 'Corolla', reason: 'Slightly higher price but marginally better resale value' }
        ],
        deductionLogic: [
          { category: 'Vehicle History Integrity', deduction: -0.5, reasoning: 'Fleet maintenance actually a POSITIVE factor' },
          { category: 'Mileage & Usage', deduction: 0.2, reasoning: 'Highway miles from fleet use are easier on engine' }
        ],
        verdict: 'Excellent buy - reliable transportation with proven maintenance history.'
      },
      sources: [
        { uri: 'https://www.edmunds.com', title: 'Edmunds Reliability Data' },
        { uri: 'https://www.hyundaiownersclub.com', title: 'Hyundai Owners Forum' }
      ]
    }
  ];

  return (
    <div className="mt-16 mb-20">
      <div className="text-center mb-12">
        <div className="inline-block px-3 py-1 bg-zinc-200 rounded-full mb-4 border border-zinc-300">
          <span className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest">Sample Analyses</span>
        </div>
        <h2 className="text-3xl font-display font-bold text-zinc-900 tracking-tight">See Example Reports</h2>
        <p className="text-zinc-600 mt-2 font-medium">Click any vehicle to view the full analysis</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {mockReports.map((report) => {
          const isLow = report.report.riskLevel === 'Low';
          const isHigh = report.report.riskLevel === 'High' || report.report.riskLevel === 'Critical';

          return (
            <button
              key={report.id}
              onClick={() => onSelect(report)}
              className="group text-left bg-white rounded-2xl border border-zinc-200 p-6 hover:shadow-lg hover:border-violet-300 transition-all duration-300 cursor-pointer"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold text-zinc-900">
                    {report.carDetails.year} {report.carDetails.make}
                  </h3>
                  <p className="text-sm text-zinc-500 font-mono">{report.carDetails.model}</p>
                </div>
                <div className={`flex items-center gap-1 px-3 py-1 rounded-lg text-sm font-bold ${
                  isLow ? 'bg-emerald-100 text-emerald-700' : isHigh ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                }`}>
                  {isLow ? <CheckCircle className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
                  {report.report.riskLevel}
                </div>
              </div>

              <div className="space-y-3 mb-5">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-zinc-500 font-mono uppercase tracking-wide">Score</span>
                  <div className="flex items-center gap-2">
                    <div className="text-2xl font-bold text-zinc-900">{report.report.reliabilityScore.toFixed(1)}</div>
                    <div className={isLow ? 'text-emerald-600' : isHigh ? 'text-red-600' : 'text-amber-600'}>
                      {isLow ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="bg-zinc-50 p-3 rounded-lg">
                    <span className="text-zinc-500 font-mono uppercase tracking-wide">Mileage</span>
                    <p className="font-mono font-bold text-zinc-900 mt-0.5">{(report.carDetails.mileage / 1000).toFixed(0)}K mi</p>
                  </div>
                  <div className="bg-zinc-50 p-3 rounded-lg">
                    <span className="text-zinc-500 font-mono uppercase tracking-wide">Price</span>
                    <p className="font-mono font-bold text-zinc-900 mt-0.5">${(report.carDetails.price / 1000).toFixed(0)}K</p>
                  </div>
                </div>
              </div>

              <p className="text-sm text-zinc-600 line-clamp-2 mb-4 italic">
                {report.report.verdict}
              </p>

              <div className="flex items-center justify-between text-xs">
                <span className="text-zinc-400 font-mono">View Full Analysis</span>
                <svg className="w-4 h-4 text-zinc-400 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default MockReports;
