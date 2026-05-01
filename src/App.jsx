import React, { useState, useEffect } from 'react';
import { 
  ChevronLeft, 
  RefreshCw, 
  ArrowRight, 
  Lightbulb, 
  LayoutGrid, 
  Zap, 
  Eye, 
  ChevronRight,
  HelpCircle,
  MousePointer2
} from 'lucide-react';

/**
 * MIND READING GAME - Web Version
 * Improved with interactive tutorial visuals and refined styles.
 */

// ===== DESIGN TOKENS =====
const C = {
  bg: "#05070A",
  gold: "#D4AF37",
  goldLight: "#F2D77A",
  surface: "rgba(255, 255, 255, 0.04)",
  border: "rgba(255, 255, 255, 0.08)",
  textDim: "rgba(255, 255, 255, 0.6)",
  textMuted: "rgba(255, 255, 255, 0.32)",
};

const BG_IMAGE = "https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?q=80&w=2071&auto=format&fit=crop";

// ===== GAME LOGIC DATA =====
const ALPHA = "ABCDEFGHIJKLMNOPQRSTUVWXYZ  ".split("");
const GRID1 = Array.from({ length: 7 }, (_, i) => ALPHA.slice(i * 4, (i + 1) * 4));

// ============================================================
// SHARED COMPONENTS
// ============================================================

const Starfield = () => {
  const [stars, setStars] = useState([]);
  useEffect(() => {
    setStars(Array.from({ length: 50 }, () => ({
      id: Math.random(),
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 1,
      duration: 2 + Math.random() * 3,
      delay: Math.random() * 5
    })));
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {stars.map(star => (
        <div key={star.id} className="absolute rounded-full bg-yellow-500 animate-pulse"
          style={{ left: `${star.x}%`, top: `${star.y}%`, width: `${star.size}px`, height: `${star.size}px`, opacity: 0.3, animationDuration: `${star.duration}s`, animationDelay: `${star.delay}s` }}
        />
      ))}
    </div>
  );
};

const Logo3D = () => (
  <div className="flex gap-4 my-8 perspective-1000 items-center justify-center">
    {['V', 'N', 'D'].map((letter, i) => (
      <div key={i} className="relative text-7xl md:text-9xl font-black italic text-yellow-600 animate-bounce"
        style={{ animationDelay: `${i * 0.2}s`, textShadow: '0 0 20px rgba(212, 175, 55, 0.5)' }}>
        {letter}
      </div>
    ))}
  </div>
);

const PulseButton = ({ label, onClick }) => (
  <div className="relative group">
    <div className="absolute inset-0 bg-yellow-600/20 rounded-full blur-xl scale-110 animate-pulse group-hover:bg-yellow-600/40 transition-all" />
    <button onClick={onClick} className="relative flex items-center gap-3 bg-gradient-to-br from-[#F2D77A] to-[#D4AF37] px-10 py-4 rounded-full text-black font-bold tracking-widest hover:scale-105 active:scale-95 transition-transform uppercase text-sm">
      {label}
      <ArrowRight size={18} />
    </button>
  </div>
);

// ============================================================
// MAIN APP
// ============================================================

export default function App() {
  const [step, setStep] = useState("splash");
  const [wordLength, setWordLength] = useState(4);
  const [curIdx, setCurIdx] = useState(0);
  const [sel1, setSel1] = useState([]);
  const [sel2, setSel2] = useState([]);

  const reset = () => {
    setStep("splash");
    setWordLength(4);
    setCurIdx(0);
    setSel1([]);
    setSel2([]);
  };

  const goBack = () => {
    if (step === "tutorial") setStep("splash");
    else if (step === "setup") setStep("tutorial");
    else if (step === "phase1") {
      if (curIdx > 0) setCurIdx(curIdx - 1);
      else setStep("setup");
    } else if (step === "phase2") {
      if (curIdx > 0) setCurIdx(curIdx - 1);
      else { setCurIdx(wordLength - 1); setStep("phase1"); }
    } else if (step === "reveal") reset();
  };

  const buildGrid2 = () => {
    const g = [[], [], [], []];
    sel1.forEach((r) => {
      g[0].push(GRID1[r][0]);
      g[1].push(GRID1[r][1]);
      g[2].push(GRID1[r][2]);
      g[3].push(GRID1[r][3]);
    });
    return g;
  };

  return (
    <div className="min-h-screen bg-[#05070A] text-white font-sans selection:bg-yellow-500/30 overflow-x-hidden relative flex flex-col">
      <div className="fixed inset-0 bg-cover bg-center opacity-20 pointer-events-none" style={{ backgroundImage: `url(${BG_IMAGE})` }} />
      <div className="fixed inset-0 bg-gradient-to-b from-black/60 via-black/80 to-black pointer-events-none" />
      <Starfield />

      <div className="relative z-10 max-w-lg mx-auto w-full min-h-screen flex flex-col">
        {step !== "splash" && (
          <header className="flex items-center justify-between p-6 border-b border-white/5 bg-black/20 backdrop-blur-sm sticky top-0 z-50">
            <button onClick={goBack} className="p-2 hover:bg-white/5 rounded-full transition-colors text-white/60">
              <ChevronLeft size={24} />
            </button>
            <h1 className="text-xl font-black tracking-[0.2em] italic text-yellow-600">VND</h1>
            <button onClick={reset} className="p-2 hover:bg-white/5 rounded-full transition-colors text-white/60">
              <RefreshCw size={20} />
            </button>
          </header>
        )}

        <main className="flex-1 p-6 flex flex-col items-center">
          {step === "splash" && <SplashScreen onEnter={() => setStep("setup")} onTutorial={() => setStep("tutorial")} />}
          {step === "tutorial" && <TutorialScreen onPlay={() => setStep("setup")} onBack={() => setStep("splash")} />}
          {step === "setup" && (
            <div className="w-full space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 flex flex-col items-center py-10">
              <span className="text-[10px] tracking-[0.3em] text-yellow-500 font-bold uppercase">◆ Step 1 of 3 ◆</span>
              <h2 className="text-5xl font-black text-center tracking-tight leading-tight">
                Think of a <span className="italic font-normal text-yellow-500">word.</span>
              </h2>
              <p className="text-white/60 text-center text-sm leading-relaxed max-w-xs">
                Pick any word and keep it secret. Just tell me how many letters it has.
              </p>

              <div className="w-full bg-white/5 rounded-3xl p-6 border border-yellow-600/20 flex items-center justify-between shadow-2xl mt-4">
                <span className="text-[10px] font-black tracking-widest text-white/40 uppercase">Letters</span>
                <div className="flex items-center gap-4">
                  <button onClick={() => setWordLength(Math.max(1, wordLength - 1))} className="w-10 h-10 rounded-xl bg-yellow-600/10 border border-yellow-600/30 text-yellow-500 text-2xl hover:bg-yellow-600/20 transition-colors">−</button>
                  <span className="text-5xl font-black w-14 text-center text-yellow-100">{wordLength}</span>
                  <button onClick={() => setWordLength(Math.min(10, wordLength + 1))} className="w-10 h-10 rounded-xl bg-yellow-600/10 border border-yellow-600/30 text-yellow-500 text-2xl hover:bg-yellow-600/20 transition-colors">+</button>
                </div>
              </div>

              <button onClick={() => { setCurIdx(0); setSel1([]); setSel2([]); setStep("phase1"); }} className="w-full bg-gradient-to-r from-yellow-500 to-yellow-700 py-4 rounded-2xl text-black font-black tracking-widest transition-transform hover:scale-[1.02] active:scale-95 shadow-lg shadow-yellow-600/20 mt-4 flex items-center justify-center gap-2">
                I'M READY <ArrowRight size={18} />
              </button>
              <p className="text-center text-[10px] text-white/20 tracking-[0.2em] mt-2 font-medium">✦ LENGTH 1 – 10 LETTERS ✦</p>
            </div>
          )}

          {(step === "phase1" || step === "phase2") && (
            <div className="w-full space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="text-center">
                <span className="text-[10px] tracking-[0.3em] text-yellow-500 block font-bold uppercase mb-2">◆ Phase {step === "phase1" ? 1 : 2} of 2 ◆</span>
                <h2 className="text-3xl font-serif font-bold italic">{step === "phase1" ? "Find your letter" : "One more time"}</h2>
                <p className="text-white/50 text-xs mt-2 max-w-[280px] mx-auto leading-relaxed">
                  {step === "phase1" ? `Look at letter ${curIdx + 1}. Find the row that contains it.` : `Letter ${curIdx + 1} again. Find it in this new layout.`}
                </p>
              </div>

              <div className="flex flex-wrap justify-center gap-2">
                {Array.from({ length: wordLength }).map((_, i) => (
                  <div key={i} className={`w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-bold border transition-all ${i < curIdx ? 'bg-yellow-600/20 border-yellow-600/50 text-yellow-500' : i === curIdx ? 'bg-yellow-600/40 border-yellow-500 text-white scale-110 shadow-[0_0_15px_rgba(212,175,55,0.3)]' : 'bg-white/5 border-white/10 text-white/30'}`}>{i + 1}</div>
                ))}
              </div>

              <div className="space-y-3 mt-4">
                {(step === "phase1" ? GRID1 : buildGrid2()).map((row, ri) => (
                  <button key={ri} onClick={() => step === "phase1" ? (()=>{ const n=[...sel1]; n[curIdx]=ri; setSel1(n); if(curIdx<wordLength-1) setCurIdx(curIdx+1); else {setCurIdx(0); setStep("phase2");}})() : (()=>{ const n=[...sel2]; n[curIdx]=ri; setSel2(n); if(curIdx<wordLength-1) setCurIdx(curIdx+1); else { setStep("loading"); setTimeout(() => setStep("reveal"), 2000); }})()} className="w-full flex items-center bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:bg-yellow-500/5 hover:border-yellow-500/30 transition-all group active:scale-[0.98]">
                    <div className="w-12 bg-white/5 py-5 flex items-center justify-center border-r border-white/5"><span className="text-[10px] font-bold text-yellow-600/60 uppercase">{step === "phase1" ? `G${ri+1}` : `L${ri+1}`}</span></div>
                    <div className="flex-1 flex justify-around px-4">{row.map((l, li) => <span key={li} className="text-xl font-black text-white/80 group-hover:text-yellow-500 transition-colors">{l === ' ' ? '·' : l}</span>)}</div>
                    <div className="px-4 opacity-20 group-hover:opacity-100 group-hover:translate-x-1 transition-all"><ChevronRight size={16} className="text-yellow-500" /></div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === "loading" && (
            <div className="flex-1 flex flex-col items-center justify-center space-y-8 animate-in fade-in duration-700">
              <div className="relative w-32 h-32 flex items-center justify-center">
                <div className="absolute inset-0 border-2 border-yellow-600/20 rounded-full animate-ping" />
                <div className="absolute inset-0 border-t-2 border-yellow-500 rounded-full animate-spin duration-1000" />
                <Eye className="text-yellow-500" size={40} />
              </div>
              <h2 className="text-2xl font-serif italic text-yellow-500 animate-pulse">Reading your mind...</h2>
            </div>
          )}

          {step === "reveal" && (
            <div className="w-full flex-1 flex flex-col items-center justify-center text-center space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
              <div className="space-y-2">
                <span className="text-[10px] tracking-[0.4em] text-yellow-600 font-bold uppercase block">◆ Your Word Is ◆</span>
                <h2 className="text-3xl font-serif text-white/80 italic">Behold. I have seen into your <span className="text-white font-black not-italic border-b-2 border-yellow-500">soul.</span></h2>
              </div>
              <div className="flex flex-wrap justify-center gap-3">
                {sel1.map((r, i) => GRID1[r]?.[sel2[i]] ?? "").join("").trim().split("").map((letter, idx) => (
                  <div key={idx} className="w-12 h-16 md:w-16 md:h-20 bg-gradient-to-br from-yellow-300 to-yellow-600 rounded-xl flex items-center justify-center text-black text-4xl md:text-5xl font-black shadow-[0_0_40px_rgba(212,175,55,0.4)] animate-in zoom-in duration-700" style={{ animationDelay: `${idx * 0.1}s` }}>{letter}</div>
                ))}
              </div>
              <div className="pt-8 w-full max-w-xs space-y-6">
                <button onClick={reset} className="w-full bg-gradient-to-r from-yellow-500 to-yellow-700 py-4 rounded-2xl text-black font-black tracking-widest transition-transform hover:scale-[1.02] active:scale-95 shadow-lg shadow-yellow-600/20 flex items-center justify-center gap-3"><RefreshCw size={18} /> PLAY AGAIN</button>
                <p className="text-white/40 text-[11px] italic">Think I got it wrong? Try again. The math never lies.</p>
              </div>
            </div>
          )}
        </main>
      </div>

      <style>{`
        @keyframes fade-in { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in { animation: fade-in 1s ease-out forwards; }
        .perspective-1000 { perspective: 1000px; }
      `}</style>
    </div>
  );
}

// ============================================================
// SPLASH COMPONENT
// ============================================================
function SplashScreen({ onEnter, onTutorial }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6">
      <span className="text-[10px] tracking-[0.4em] text-yellow-600 font-bold uppercase mb-4 animate-fade-in">◆ MIND READING ◆</span>
      <Logo3D />
      <h2 className="text-2xl font-serif">A game of <span className="italic text-yellow-500 font-medium">secret thoughts</span></h2>
      <p className="text-white/60 text-sm max-w-[280px] leading-relaxed">Think of any word. I'll read your mind through the patterns of your choices.</p>
      
      <div className="pt-10 flex flex-col items-center">
        <PulseButton label="TAP TO ENTER" onClick={onEnter} />
        <button onClick={onTutorial} className="flex items-center gap-2 mt-10 text-white/40 hover:text-white/80 transition-colors text-[11px] font-bold tracking-[0.2em] group uppercase">
          <HelpCircle size={14} className="opacity-60 group-hover:opacity-100" />
          How to play
        </button>
      </div>

      <footer className="mt-auto pt-10 flex items-center gap-4 opacity-40">
        <div className="w-8 h-[1px] bg-yellow-500/50" />
        <span className="text-[10px] tracking-widest font-semibold uppercase">Made by Vishnu N D</span>
        <div className="w-8 h-[1px] bg-yellow-500/50" />
      </footer>
    </div>
  );
}

// ============================================================
// REFINED TUTORIAL COMPONENT
// ============================================================
function TutorialScreen({ onPlay, onBack }) {
  const [tutStep, setTutStep] = useState(0);
  const totalSteps = 3;

  const steps = [
    {
      title: "Imagine a secret",
      body: "Pick a simple word and hold it in your mind. Focus on each letter clearly.",
      visual: (
        <div className="flex gap-2 py-8">
          {['M', 'I', 'N', 'D'].map((l, i) => (
            <div key={i} className={`w-12 h-16 rounded-xl flex items-center justify-center text-3xl font-black italic border-2 transition-all ${i === 0 ? 'bg-yellow-500 text-black border-yellow-400 shadow-[0_0_20px_rgba(212,175,55,0.6)]' : 'bg-yellow-500/10 text-yellow-500/40 border-yellow-500/20'}`}>
              {l}
            </div>
          ))}
        </div>
      ),
      label: "CHOOSE A WORD (E.G., 'MIND')"
    },
    {
      title: "Find your path",
      body: "I'll show you grids of letters. For every letter in your word, simply tap the row that contains it.",
      visual: (
        <div className="w-full space-y-2 py-6">
          <div className="flex items-center bg-yellow-500/10 border-2 border-yellow-500 rounded-xl overflow-hidden relative shadow-[0_0_25px_rgba(212,175,55,0.3)] animate-pulse">
             <div className="w-10 bg-yellow-500/20 py-3 flex items-center justify-center border-r border-yellow-500/20 text-[9px] font-bold text-yellow-500">G1</div>
             <div className="flex-1 flex justify-around px-2">
                <span className="text-xl font-black text-yellow-500">M</span>
                <span className="text-xl font-black text-white/30">A</span>
                <span className="text-xl font-black text-white/30">B</span>
                <span className="text-xl font-black text-white/30">C</span>
             </div>
             <div className="px-3 bg-yellow-500 py-1 rounded-l-md text-black font-black text-[10px]">TAP</div>
          </div>
          <div className="flex items-center bg-white/5 border border-white/10 rounded-xl overflow-hidden opacity-40">
             <div className="w-10 bg-white/5 py-3 border-r border-white/5" />
             <div className="flex-1 flex justify-around px-2">
                <span className="text-xl font-black text-white/50">X</span>
                <span className="text-xl font-black text-white/50">Y</span>
                <span className="text-xl font-black text-white/50">Z</span>
                <span className="text-xl font-black text-white/50">W</span>
             </div>
          </div>
        </div>
      ),
      label: "LOCATE EACH LETTER"
    },
    {
      title: "The math reveals",
      body: "After two rounds of pattern detection, I will separate the signal from the noise and pull the word from your mind.",
      visual: (
        <div className="py-8 flex flex-col items-center">
          <div className="relative">
             <div className="absolute inset-0 bg-yellow-500 rounded-full blur-2xl opacity-20 animate-pulse" />
             <Eye size={64} className="text-yellow-500 relative animate-bounce" />
          </div>
          <div className="mt-4 text-xs font-bold text-yellow-600 tracking-[0.3em] uppercase">Processing Patterns...</div>
        </div>
      ),
      label: "REVEALING THE SECRET"
    }
  ];

  const current = steps[tutStep];

  return (
    <div className="w-full flex-1 flex flex-col items-center animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-sm mx-auto">
      <span className="text-[10px] tracking-[0.4em] text-yellow-500 font-bold uppercase mb-2">◆ HOW TO PLAY ◆</span>
      <h2 className="text-4xl font-black text-center tracking-tight leading-tight italic">{current.title}</h2>
      
      <p className="text-white/60 text-center text-[14px] leading-relaxed mt-4">
        {current.body}
      </p>

      {/* Visual Demo Area */}
      <div className="w-full flex-1 flex flex-col items-center justify-center min-h-[220px]">
        {current.visual}
        <span className="text-[10px] font-black tracking-[0.3em] text-white/30 uppercase mt-4">{current.label}</span>
      </div>

      {/* Pagination Dots */}
      <div className="flex gap-2 mt-8 mb-10">
        {steps.map((_, i) => (
          <div key={i} className={`h-2 rounded-full transition-all duration-300 ${i === tutStep ? 'w-6 bg-yellow-500 shadow-[0_0_8px_rgba(212,175,55,0.6)]' : i < tutStep ? 'w-2 bg-yellow-600/40' : 'w-2 bg-white/10'}`} />
        ))}
      </div>

      <div className="w-full flex gap-3">
        <button onClick={onBack} className="flex-1 bg-white/5 border border-white/10 py-4 rounded-2xl text-[11px] font-black tracking-widest text-white/50 hover:bg-white/10 transition-all flex items-center justify-center gap-2 uppercase">
          <ChevronLeft size={16} /> Back
        </button>
        <button onClick={() => tutStep < totalSteps - 1 ? setTutStep(tutStep + 1) : onPlay()} className="flex-[2] bg-gradient-to-r from-yellow-500 to-yellow-700 py-4 rounded-2xl text-black font-black tracking-widest transition-transform hover:scale-[1.02] active:scale-95 shadow-lg shadow-yellow-600/20 flex items-center justify-center gap-2 uppercase text-[11px]">
          {tutStep < totalSteps - 1 ? 'Next' : 'Start Game'} <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
