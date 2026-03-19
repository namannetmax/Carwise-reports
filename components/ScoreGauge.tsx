import React, { useEffect, useState } from 'react';
import { motion, useSpring, useTransform } from 'motion/react';

interface ScoreGaugeProps {
  score: number; // 0-10
}

const ScoreGauge: React.FC<ScoreGaugeProps> = ({ score }) => {
  const percentage = (score / 10) * 100;
  const circumference = 2 * Math.PI * 45; // Increased radius slightly
  
  const [displayScore, setDisplayScore] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = score;
    const duration = 1500;
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const currentScore = progress * end;
      setDisplayScore(currentScore);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [score]);

  let colorClass = 'text-rose-500';
  if (score >= 4) colorClass = 'text-amber-500';
  if (score >= 6) colorClass = 'text-yellow-500';
  if (score >= 8) colorClass = 'text-cyan-500';

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative w-40 h-40 flex items-center justify-center bg-zinc-900 rounded-full shadow-inner border-4 border-zinc-800 overflow-hidden">
        {/* Subtle pulsing background glow */}
        <motion.div 
          className={`absolute inset-0 opacity-10 blur-2xl ${colorClass.replace('text-', 'bg-')}`}
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.05, 0.15, 0.05]
          }}
          transition={{ 
            duration: 4, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
        />

        {/* Background Circle */}
        <svg className="w-full h-full transform -rotate-90 relative z-10" viewBox="0 0 120 120">
          <circle
            cx="60"
            cy="60"
            r="45"
            stroke="currentColor"
            strokeWidth="4"
            fill="transparent"
            className="text-zinc-800"
            strokeDasharray="2, 4"
          />
          {/* Progress Circle */}
          <motion.circle
            cx="60"
            cy="60"
            r="45"
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: circumference - (percentage / 100) * circumference }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            strokeLinecap="round"
            className={`${colorClass} drop-shadow-[0_0_8px_rgba(0,0,0,0.5)]`}
          />
        </svg>
        
        <div className="absolute flex flex-col items-center z-20">
          <motion.span 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`text-5xl font-mono font-bold ${colorClass} tracking-tighter`}
          >
            {displayScore.toFixed(1)}
          </motion.span>
        </div>
        
        {/* Decorative ticks with sequential animation */}
        <div className="absolute inset-0 pointer-events-none z-10">
          {[...Array(12)].map((_, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              className="absolute top-1/2 left-1/2 w-0.5 h-2 bg-zinc-700"
              style={{ 
                transform: `translate(-50%, -50%) rotate(${i * 30}deg) translateY(-52px)` 
              }}
            />
          ))}
        </div>

        {/* Scanning light effect */}
        <motion.div 
          className="absolute inset-0 pointer-events-none z-30"
          animate={{ rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        >
          <div className="absolute top-1/2 left-1/2 w-1 h-20 -translate-x-1/2 -translate-y-full bg-gradient-to-t from-transparent via-violet-500/20 to-transparent blur-sm" />
        </motion.div>
      </div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="flex flex-col items-center"
      >
        <span className="text-[10px] text-zinc-500 uppercase font-mono font-bold tracking-[0.3em]">Reliability Score</span>
        <div className="h-px w-8 bg-zinc-800 mt-2" />
      </motion.div>
    </div>
  );
};

export default ScoreGauge;
