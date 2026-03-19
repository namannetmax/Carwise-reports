import React, { useState, useRef } from 'react';
import { CarDetails, SubscriptionPlan } from '../types';
import { Search, Loader2, Upload, X, Camera, FileText, ShieldAlert, Lock, Crown, Info, ChevronRight } from 'lucide-react';

interface InputFormProps {
  onAnalyze: (details: CarDetails) => void;
  isLoading: boolean;
  plan: SubscriptionPlan;
  usageCount: number;
  limit: number;
  onShowPricing: () => void;
  initialData?: CarDetails | null;
}

const InputForm: React.FC<InputFormProps> = ({ 
  onAnalyze, 
  isLoading, 
  plan, 
  usageCount, 
  limit,
  onShowPricing,
  initialData
}) => {
  const [formData, setFormData] = useState<Omit<CarDetails, 'images' | 'carfaxReport' | 'carfaxMimeType' | 'inspectionReport' | 'inspectionMimeType'>>({
    make: initialData?.make || '',
    model: initialData?.model || '',
    year: initialData?.year || new Date().getFullYear() - 5,
    mileage: initialData?.mileage || 60000,
    price: initialData?.price || 15000,
    description: initialData?.description || '',
  });
  
  const [images, setImages] = useState<string[]>([]);
  const [carfax, setCarfax] = useState<{ data: string; mime: string; name: string } | null>(null);
  const [inspection, setInspection] = useState<{ data: string; mime: string; name: string } | null>(null);
  const [disclaimerChecked, setDisclaimerChecked] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const carfaxInputRef = useRef<HTMLInputElement>(null);
  const inspectionInputRef = useRef<HTMLInputElement>(null);

  const isAtLimit = usageCount >= limit;
  const isPremium = plan === 'premium';

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'year' || name === 'mileage' || name === 'price' ? Number(value) : value
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isPremium) {
      onShowPricing();
      return;
    }
    const files = e.target.files;
    if (!files) return;
    const filesArray = Array.from(files) as File[];
    filesArray.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImages(prev => [...prev, reader.result as string].slice(0, 5));
      };
      reader.readAsDataURL(file);
    });
  };

  const handleCarfaxUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isPremium) {
      onShowPricing();
      return;
    }
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setCarfax({
        data: reader.result as string,
        mime: file.type,
        name: file.name
      });
    };
    reader.readAsDataURL(file);
  };

  const handleInspectionUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isPremium) {
      onShowPricing();
      return;
    }
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setInspection({
        data: reader.result as string,
        mime: file.type,
        name: file.name
      });
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isAtLimit) {
      onShowPricing();
      return;
    }
    if ((carfax || inspection) && !disclaimerChecked) return;
    
    onAnalyze({ 
      ...formData, 
      images, 
      carfaxReport: carfax?.data, 
      carfaxMimeType: carfax?.mime,
      inspectionReport: inspection?.data,
      inspectionMimeType: inspection?.mime,
      description: formData.description
    });
  };

  return (
    <div className="bg-zinc-100 rounded-3xl shadow-2xl p-10 max-w-2xl mx-auto border border-zinc-200 relative overflow-hidden">
      {/* Plan Progress Badge for Free Users */}
      {!isPremium && (
        <div className="absolute top-0 right-0 left-0 bg-zinc-900 px-6 py-2.5 flex items-center justify-between">
          <span className="font-mono text-[9px] font-bold text-zinc-400 uppercase tracking-[0.2em]">
            System Access: {usageCount}/{limit} Reports Remaining
          </span>
          <button onClick={onShowPricing} className="font-mono text-[9px] font-bold text-violet-400 hover:text-violet-300 uppercase tracking-[0.2em] flex items-center gap-1.5 transition-colors">
            <Crown className="w-3 h-3" /> Initialize Premium
          </button>
        </div>
      )}

      <div className={`${!isPremium ? 'mt-8' : ''} mb-10 text-center`}>
        <div className="inline-block px-3 py-1 bg-zinc-200 rounded-full mb-4 border border-zinc-300">
          <span className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest">Input Module v1.0</span>
        </div>
        <h2 className="text-4xl font-display font-bold text-zinc-900 tracking-tight">Vehicle Diagnostic Input</h2>
        <p className="text-zinc-600 mt-2 font-medium">Enter vehicle parameters for architectural risk assessment.</p>
        
        {initialData && (
          <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3 text-left animate-fade-in">
            <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-bold text-amber-900">Modification Mode Active</h4>
              <p className="text-xs text-amber-700 mt-1 leading-relaxed">
                You are editing a previous analysis. Submitting changes will generate a new report and <strong>consume 1 analysis credit</strong> from your plan.
              </p>
            </div>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-2">
            <label className="font-mono text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Model Year</label>
            <input
              type="number"
              name="year"
              min="1990"
              max={new Date().getFullYear() + 1}
              value={formData.year}
              onChange={handleChange}
              required
              className="w-full px-4 py-4 bg-white border border-zinc-200 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none font-mono text-zinc-900 transition-all"
            />
          </div>
          <div className="space-y-2">
            <label className="font-mono text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Manufacturer</label>
            <input
              type="text"
              name="make"
              placeholder="e.g. TOYOTA"
              value={formData.make}
              onChange={handleChange}
              required
              className="w-full px-4 py-4 bg-white border border-zinc-200 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none font-mono text-zinc-900 transition-all placeholder:opacity-30"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="font-mono text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Model Designation</label>
          <input
            type="text"
            name="model"
            placeholder="e.g. CAMRY SE V6"
            value={formData.model}
            onChange={handleChange}
            required
            className="w-full px-4 py-4 bg-white border border-zinc-200 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none font-mono text-zinc-900 transition-all placeholder:opacity-30"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-2">
            <label className="font-mono text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Odometer (MI)</label>
            <div className="relative">
              <input
                type="number"
                name="mileage"
                value={formData.mileage}
                onChange={handleChange}
                required
                className="w-full px-4 py-4 bg-white border border-zinc-200 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none font-mono text-zinc-900 transition-all"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="font-mono text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Listing Price (USD)</label>
            <div className="relative">
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
                className="w-full px-4 py-4 bg-white border border-zinc-200 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none font-mono text-zinc-900 transition-all"
              />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label className="font-mono text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Additional Observations</label>
          <textarea
            name="description"
            rows={4}
            placeholder="List any red flags:
• Mechanical: Smoke, rust, or shifting issues?
• History: Are service receipts available?
• Usage: Was it used for delivery or heavy commuting?
• Behavior: Did the seller refuse a mechanic's inspection?"
            value={formData.description}
            onChange={handleChange}
            className="w-full px-4 py-4 bg-white border border-zinc-200 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none font-sans text-sm text-zinc-900 transition-all placeholder:text-zinc-400 placeholder:italic"
          />
        </div>

        {/* Feature Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
          {/* Photos */}
          <div className={`space-y-4 p-6 rounded-2xl border-2 border-dashed transition-all ${isPremium ? 'bg-white border-zinc-200 hover:border-zinc-400' : 'bg-zinc-50 border-zinc-100 opacity-50 cursor-not-allowed'}`}>
            <div className="flex items-center justify-between">
              <label className="font-mono text-[10px] font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                <Camera className="w-4 h-4" /> Vehicle Photos
              </label>
              {!isPremium && <span className="font-mono text-[8px] bg-zinc-900 text-white px-2 py-0.5 rounded uppercase tracking-widest">Locked</span>}
            </div>
            {!isPremium ? (
              <div onClick={onShowPricing} className="h-20 flex flex-col items-center justify-center cursor-pointer">
                <Lock className="w-5 h-5 text-zinc-300 mb-2" />
                <span className="font-mono text-[9px] text-zinc-400 uppercase tracking-widest">Premium Only</span>
              </div>
            ) : (
              <div onClick={() => fileInputRef.current?.click()} className="h-20 flex flex-col items-center justify-center cursor-pointer group">
                <Upload className="w-5 h-5 text-zinc-400 mb-2 group-hover:text-zinc-900 transition-colors" />
                <span className="font-mono text-[9px] text-zinc-500 uppercase tracking-widest">Upload Car Images</span>
                <input type="file" ref={fileInputRef} onChange={handleImageUpload} multiple accept="image/*" className="hidden" />
              </div>
            )}
            {images.length > 0 && <span className="font-mono text-[9px] text-cyan-600 font-bold uppercase tracking-widest">{images.length} Images Uploaded</span>}
          </div>

          {/* CARFAX */}
          <div className={`space-y-4 p-6 rounded-2xl border-2 border-dashed transition-all ${isPremium ? 'bg-white border-zinc-200 hover:border-zinc-400' : 'bg-zinc-50 border-zinc-100 opacity-50 cursor-not-allowed'}`}>
            <div className="flex items-center justify-between">
              <label className="font-mono text-[10px] font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                <FileText className="w-4 h-4" /> CarFax Report
              </label>
              {!isPremium && <span className="font-mono text-[8px] bg-zinc-900 text-white px-2 py-0.5 rounded uppercase tracking-widest">Locked</span>}
            </div>
            {!isPremium ? (
              <div onClick={onShowPricing} className="h-20 flex flex-col items-center justify-center cursor-pointer">
                <Lock className="w-5 h-5 text-zinc-300 mb-2" />
                <span className="font-mono text-[9px] text-zinc-400 uppercase tracking-widest">Premium Only</span>
              </div>
            ) : (
              <div onClick={() => carfaxInputRef.current?.click()} className="h-20 flex flex-col items-center justify-center cursor-pointer group">
                <FileText className="w-5 h-5 text-zinc-400 mb-2 group-hover:text-zinc-900 transition-colors" />
                <span className="font-mono text-[9px] text-zinc-500 uppercase tracking-widest">Upload PDF/Image</span>
                <input type="file" ref={carfaxInputRef} onChange={handleCarfaxUpload} accept=".pdf,image/*" className="hidden" />
              </div>
            )}
            {carfax && <span className="font-mono text-[9px] text-cyan-600 font-bold uppercase tracking-widest">Report Ready</span>}
          </div>

          {/* Pre-Inspection Report */}
          <div className={`space-y-4 p-6 rounded-2xl border-2 border-dashed transition-all ${isPremium ? 'bg-white border-zinc-200 hover:border-zinc-400' : 'bg-zinc-50 border-zinc-100 opacity-50 cursor-not-allowed'}`}>
            <div className="flex items-center justify-between">
              <label className="font-mono text-[10px] font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                <ShieldAlert className="w-4 h-4" /> Pre-Inspection
              </label>
              {!isPremium && <span className="font-mono text-[8px] bg-zinc-900 text-white px-2 py-0.5 rounded uppercase tracking-widest">Locked</span>}
            </div>
            {!isPremium ? (
              <div onClick={onShowPricing} className="h-20 flex flex-col items-center justify-center cursor-pointer">
                <Lock className="w-5 h-5 text-zinc-300 mb-2" />
                <span className="font-mono text-[9px] text-zinc-400 uppercase tracking-widest">Premium Only</span>
              </div>
            ) : (
              <div onClick={() => inspectionInputRef.current?.click()} className="h-20 flex flex-col items-center justify-center cursor-pointer group">
                <Upload className="w-5 h-5 text-zinc-400 mb-2 group-hover:text-zinc-900 transition-colors" />
                <span className="font-mono text-[9px] text-zinc-500 uppercase tracking-widest">Upload Report</span>
                <input type="file" ref={inspectionInputRef} onChange={handleInspectionUpload} accept=".pdf,image/*" className="hidden" />
              </div>
            )}
            {inspection && <span className="font-mono text-[9px] text-cyan-600 font-bold uppercase tracking-widest">Inspection Data Ingested</span>}
          </div>
        </div>

        {(carfax || inspection) && isPremium && (
          <div className="bg-violet-50/60 p-5 rounded-2xl border border-violet-100 shadow-sm animate-fade-in">
            <label className="flex items-start gap-4 cursor-pointer group">
              <div className="relative flex items-center h-5">
                <input 
                  type="checkbox" 
                  checked={disclaimerChecked} 
                  onChange={(e) => setDisclaimerChecked(e.target.checked)} 
                  className="w-5 h-5 text-violet-600 border-zinc-300 rounded focus:ring-violet-500 cursor-pointer transition-transform group-hover:scale-105" 
                />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2 mb-1.5">
                  <ShieldAlert className="w-4 h-4 text-violet-600" />
                  <span className="text-xs font-bold text-violet-900 uppercase tracking-tight">Security & Privacy Assurance</span>
                </div>
                <span className="text-[11px] leading-relaxed text-violet-800/80 font-medium">
                  I confirm that I am authorized to provide these reports for analysis. CarWise AI will process the data in real-time to generate your vehicle assessment, and to ensure your absolute privacy, no original files or sensitive personal records are permanently stored on our servers once the session is complete.
                </span>
              </div>
            </label>
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading || ((carfax || inspection) && !disclaimerChecked)}
          className={`w-full py-5 rounded-xl font-mono text-xs uppercase tracking-[0.3em] transition-all duration-300 flex items-center justify-center gap-3 relative overflow-hidden group
            ${isLoading || ((carfax || inspection) && !disclaimerChecked) 
              ? 'bg-zinc-200 text-zinc-400 cursor-not-allowed border border-zinc-300' 
              : 'bg-zinc-900 text-white hover:bg-zinc-800 border border-zinc-800 shadow-[0_0_20px_rgba(139,92,246,0.1)] hover:shadow-[0_0_30px_rgba(139,92,246,0.2)]'
            }
          `}
        >
          {isLoading ? (
            <><Loader2 className="w-4 h-4 animate-spin text-violet-400" /> Initializing Diagnostic...</>
          ) : isAtLimit ? (
            <><Crown className="w-4 h-4 text-amber-400" /> Upgrade Required</>
          ) : (
            <>
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Start Analysis Sequence
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-violet-400" />
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default InputForm;