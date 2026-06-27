import { useState, useEffect } from "react";
import { ScanLine, Clock } from "lucide-react";

const STEPS = [
  { text: "Fetching live page & rendering DOM tree", time: 0 },
  { text: "Extracting color clusters, font weights & grid rhythm", time: 7 },
  { text: "Classifying components, elements & interactive structures", time: 14 },
  { text: "Composing structured visual deconstruction prompts", time: 21 },
];

const ESTIMATED_TIME = 28; // seconds

export function ScanningLoader() {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const start = Date.now();
    const interval = setInterval(() => {
      const currentElapsed = Math.floor((Date.now() - start) / 1000);
      setElapsed(currentElapsed);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const progress = Math.min((elapsed / ESTIMATED_TIME) * 100, 99); // Cap at 99% until complete
  const remaining = Math.max(ESTIMATED_TIME - elapsed, 1);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-[0_8px_30px_rgba(15,23,42,0.03)] font-sans">
      <div className="relative mx-auto h-48 w-full max-w-md overflow-hidden rounded-xl border border-slate-200 bg-slate-50 bg-grid">
        <div className="absolute inset-x-0 top-0 h-12 animate-scan-line bg-[linear-gradient(to_bottom,transparent,rgba(79,70,229,0.1),transparent)]" />
        <div className="absolute inset-0 flex items-center justify-center pb-6">
          <ScanLine className="size-10 text-primary animate-pulse" />
        </div>
        
        {/* Progress Bar & Countdown */}
        <div className="absolute bottom-4 left-5 right-5 bg-white/80 backdrop-blur-sm p-3 rounded-lg border border-slate-200/60 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600">Deconstructing</span>
            <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-primary">
              <Clock className="size-3" />
              <span>~{remaining}s remaining</span>
            </div>
          </div>
          <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200/50">
            <div 
              className="h-full bg-primary transition-all duration-1000 ease-linear rounded-full" 
              style={{ width: `${progress}%` }} 
            />
          </div>
        </div>
      </div>
      
      {/* Active Steps */}
      <div className="mt-8 space-y-3 max-w-sm mx-auto">
        {STEPS.map((s, i) => {
          const isActive = elapsed >= s.time && (i === STEPS.length - 1 || elapsed < STEPS[i + 1].time);
          const isDone = elapsed >= STEPS[i + 1]?.time;
          const isPending = elapsed < s.time;
          
          return (
            <div
              key={s.text}
              className={`flex items-center gap-3 text-[10px] font-bold uppercase tracking-wider transition-all duration-500 ${
                isActive ? 'text-primary' : isDone ? 'text-slate-400' : 'text-slate-300'
              }`}
            >
              <span className={`size-1.5 rounded-full shrink-0 transition-colors duration-500 ${
                isActive ? 'bg-primary animate-pulse-glow' : isDone ? 'bg-slate-300' : 'bg-slate-200'
              }`} />
              {s.text}
            </div>
          );
        })}
      </div>
    </div>
  );
}
