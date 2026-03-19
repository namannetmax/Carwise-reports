import React, { useState } from 'react';
import { ThumbsUp, ThumbsDown, MessageSquare, Send, CheckCircle } from 'lucide-react';

interface FeedbackSectionProps {
  reportId: string;
  onSubmit: (feedback: { rating: 'positive' | 'negative'; comment: string }) => void;
}

const FeedbackSection: React.FC<FeedbackSectionProps> = ({ reportId, onSubmit }) => {
  const [rating, setRating] = useState<'positive' | 'negative' | null>(null);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rating) return;
    
    onSubmit({ rating, comment });
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="bg-zinc-50 rounded-2xl border border-zinc-200 p-8 text-center animate-fade-in">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 mb-4">
          <CheckCircle className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-bold text-zinc-900 mb-2">Thank You</h3>
        <p className="text-zinc-500 text-sm max-w-md mx-auto">
          Your feedback helps improve our diagnostic accuracy.
        </p>
      </div>
    );
  }

  return (
    <section className="bg-white rounded-2xl shadow-sm border border-zinc-200 p-8 transition-all duration-300">
      <div className="text-center mb-6">
        <h3 className="font-serif italic text-xl text-zinc-900 mb-2">Was this report helpful?</h3>
        <p className="text-zinc-500 text-sm">Rate the accuracy of this diagnostic analysis.</p>
      </div>

      <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-6">
        <div className="flex justify-center gap-6">
          <button
            type="button"
            onClick={() => setRating('positive')}
            className={`group flex flex-col items-center gap-3 p-4 rounded-2xl transition-all w-32 ${
              rating === 'positive'
                ? 'bg-emerald-50 ring-2 ring-emerald-500 scale-105'
                : 'bg-zinc-50 hover:bg-zinc-100 hover:scale-105'
            }`}
          >
            <div className={`p-3 rounded-full transition-colors ${
              rating === 'positive' ? 'bg-emerald-100 text-emerald-600' : 'bg-white text-zinc-400 group-hover:text-zinc-600'
            }`}>
              <ThumbsUp className={`w-6 h-6 ${rating === 'positive' ? 'fill-current' : ''}`} />
            </div>
            <span className={`text-xs font-bold uppercase tracking-widest ${
              rating === 'positive' ? 'text-emerald-700' : 'text-zinc-500'
            }`}>Yes</span>
          </button>

          <button
            type="button"
            onClick={() => setRating('negative')}
            className={`group flex flex-col items-center gap-3 p-4 rounded-2xl transition-all w-32 ${
              rating === 'negative'
                ? 'bg-rose-50 ring-2 ring-rose-500 scale-105'
                : 'bg-zinc-50 hover:bg-zinc-100 hover:scale-105'
            }`}
          >
            <div className={`p-3 rounded-full transition-colors ${
              rating === 'negative' ? 'bg-rose-100 text-rose-600' : 'bg-white text-zinc-400 group-hover:text-zinc-600'
            }`}>
              <ThumbsDown className={`w-6 h-6 ${rating === 'negative' ? 'fill-current' : ''}`} />
            </div>
            <span className={`text-xs font-bold uppercase tracking-widest ${
              rating === 'negative' ? 'text-rose-700' : 'text-zinc-500'
            }`}>No</span>
          </button>
        </div>

        {rating && (
          <div className="space-y-4 animate-fade-in-up">
            <div className="relative">
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder={rating === 'positive' ? "What was most helpful?" : "What did we miss?"}
                rows={3}
                className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none text-sm text-zinc-900 placeholder:text-zinc-400 transition-all resize-none"
                autoFocus
              />
              <div className="absolute bottom-3 right-3">
                <button
                  type="submit"
                  className="p-2 bg-zinc-900 text-white rounded-lg hover:bg-zinc-800 transition-colors shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0"
                  title="Send Feedback"
                >
                  <Send className="w-3 h-3" />
                </button>
              </div>
            </div>
            <p className="text-center text-[10px] text-zinc-400 uppercase tracking-widest">
              Your feedback is anonymous and helps train our models.
            </p>
          </div>
        )}
      </form>
    </section>
  );
};

export default FeedbackSection;
