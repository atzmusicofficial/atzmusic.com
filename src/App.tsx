import React, { useState, useEffect } from 'react';
import { 
  Mail, ArrowDown, Sparkles, MessageSquare, Youtube, Instagram, Music,
  Upload, Image as ImageIcon, RotateCcw, X, Check, Eye
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

import AudioPlayer from './components/AudioPlayer';
import ContactForm from './components/ContactForm';
import InboxManager from './components/InboxManager';
import AboutMe from './components/AboutMe';

// Import actual studio image and trumpet night image for background
import trumpetNightBg from './assets/images/musician_trumpet_night_1782348677429.jpg';

// Preset background options for high artistic customization
const BACKGROUND_PRESETS = [
  { id: 'default', name: 'Original Portrait', url: trumpetNightBg },
  { id: 'piano-keys', name: 'Vintage Grand Piano', url: 'https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?q=80&w=1200' },
  { id: 'brass-trumpet', name: 'Gleaming Brass Trumpet', url: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?q=80&w=1200' },
  { id: 'jazz-ensemble', name: 'Atmospheric Studio Session', url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1200' },
];

// Frequencies for our interactive ambient keyboard
const WHITE_KEYS = [
  { note: 'C4', freq: 261.63 },
  { note: 'D4', freq: 293.66 },
  { note: 'E4', freq: 329.63 },
  { note: 'F4', freq: 349.23 },
  { note: 'G4', freq: 392.00 },
  { note: 'A4', freq: 440.00 },
  { note: 'B4', freq: 493.88 },
  { note: 'C5', freq: 523.25 },
  { note: 'D5', freq: 587.33 },
  { note: 'E5', freq: 659.25 },
  { note: 'F5', freq: 698.46 },
  { note: 'G5', freq: 783.99 },
];

const BLACK_KEYS = [
  { note: 'C#4', freq: 277.18, leftOffset: 'calc(100% / 12 * 0.7)' },
  { note: 'D#4', freq: 311.13, leftOffset: 'calc(100% / 12 * 1.75)' },
  { note: 'F#4', freq: 369.99, leftOffset: 'calc(100% / 12 * 3.72)' },
  { note: 'G#4', freq: 415.30, leftOffset: 'calc(100% / 12 * 4.75)' },
  { note: 'A#4', freq: 466.16, leftOffset: 'calc(100% / 12 * 5.76)' },
  { note: 'C#5', freq: 554.37, leftOffset: 'calc(100% / 12 * 7.72)' },
  { note: 'D#5', freq: 622.25, leftOffset: 'calc(100% / 12 * 8.75)' },
  { note: 'F#5', freq: 739.99, leftOffset: 'calc(100% / 12 * 10.72)' },
];

let audioCtx: AudioContext | null = null;

function playAmbientTone(freq: number) {
  try {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    
    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    
    osc.type = 'triangle'; // Smooth, warm, retro ambient sound
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
    
    // Smooth volume envelope to prevent clicking
    gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.15, audioCtx.currentTime + 0.05);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 1.2);
    
    osc.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    
    osc.start();
    osc.stop(audioCtx.currentTime + 1.2);
  } catch (e) {
    console.warn('Audio context failed to start:', e);
  }
}

export default function App() {
  const [contactViewMode, setContactViewMode] = useState<'form' | 'admin'>('form');
  const [inboxRefreshTrigger, setInboxRefreshTrigger] = useState(0);
  
  // Safe helper to store in localStorage to prevent QuotaExceededError
  const safeSetLocalStorage = (key: string, value: string): boolean => {
    try {
      localStorage.setItem(key, value);
      return true;
    } catch (error) {
      console.warn(`Failed to save to localStorage for key: ${key}. It might have exceeded quota.`, error);
      return false;
    }
  };

  // Safe helper to remove from localStorage
  const safeRemoveLocalStorage = (key: string) => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.warn(`Failed to remove key ${key} from localStorage`, error);
    }
  };

  // Custom Background Management states
  const [heroBg, setHeroBg] = useState<string>(() => {
    try {
      return localStorage.getItem('custom_background_url') || trumpetNightBg;
    } catch (error) {
      console.warn('Failed to read custom background from localStorage', error);
      return trumpetNightBg;
    }
  });
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [customUrlInput, setCustomUrlInput] = useState('');
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [quotaWarning, setQuotaWarning] = useState(false);

  const handleMessageSubmitted = () => {
    setInboxRefreshTrigger(prev => prev + 1);
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Local File Upload Handler -> Converts to Base64 data URL
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        // ALWAYS update the background in state first so it immediately functions in-session
        setHeroBg(result);
        
        // Try persisting safely
        const saved = safeSetLocalStorage('custom_background_url', result);
        if (!saved) {
          // If QuotaExceededError is thrown, show user-friendly feedback that it's temporarily active
          setQuotaWarning(true);
          setTimeout(() => setQuotaWarning(false), 6000);
        } else {
          setUploadSuccess(true);
          setTimeout(() => setUploadSuccess(false), 2500);
        }
      }
    };
    reader.readAsDataURL(file);
  };

  // Custom Image URL Pasted
  const handleApplyCustomUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customUrlInput.trim()) return;
    setHeroBg(customUrlInput.trim());
    safeSetLocalStorage('custom_background_url', customUrlInput.trim());
    setCustomUrlInput('');
    setUploadSuccess(true);
    setTimeout(() => setUploadSuccess(false), 2500);
  };

  // Reset to original trumpet night portrait
  const handleResetBg = () => {
    safeRemoveLocalStorage('custom_background_url');
    setHeroBg(trumpetNightBg);
  };

  return (
    <div id="portfolio-app-root" className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col font-sans relative overflow-x-hidden selection:bg-[#c5a880] selection:text-black">
      
      {/* Dynamic Background Ambiance with Warm Gold Tones */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-[5%] left-[-10%] w-[60%] h-[40%] bg-[#c5a880]/5 rounded-full blur-[140px]"></div>
        <div className="absolute top-[35%] right-[-10%] w-[50%] h-[45%] bg-yellow-950/10 rounded-full blur-[140px]"></div>
        <div className="absolute bottom-[10%] left-[10%] w-[55%] h-[40%] bg-neutral-950/15 rounded-full blur-[140px]"></div>
        <div className="absolute inset-0 immersive-pattern opacity-[0.06]"></div>
      </div>

      {/* Immersive Blurred Header Background */}
      <header id="portfolio-header" className="sticky top-0 z-40 bg-neutral-950/65 backdrop-blur-xl border-b border-white/5 px-6 md:px-12 py-5 transition-all">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div 
              className="text-xl md:text-2xl font-serif italic text-[#c5a880] font-semibold cursor-pointer select-none tracking-wide" 
              onClick={() => scrollToSection('hero-intro')}
            >
              atzmusic 𝄞
            </div>
            <span className="h-4 w-px bg-white/10 hidden sm:inline" />
            
            {/* Elegant, clean handle */}
            <a 
              href="https://www.instagram.com/atzmusicofficial/"
              target="_blank"
              rel="noreferrer"
              className="font-serif text-[11px] text-[#c5a880]/70 hover:text-[#c5a880] tracking-widest lowercase hidden sm:flex items-center gap-1.5 transition-colors italic"
            >
              <Instagram className="w-3.5 h-3.5 text-[#c5a880]" />
              @atzmusicofficial
            </a>
          </div>

          {/* Desktop Navigation matching the ultra-clean screenshot */}
          <nav className="hidden md:flex items-center gap-10 text-[11px] lowercase tracking-[0.2em] text-neutral-400 font-medium font-serif">
            <button onClick={() => scrollToSection('about-me')} className="hover:text-[#c5a880] transition-all cursor-pointer pb-0.5 hover:italic">about me</button>
            <button onClick={() => scrollToSection('sound-system')} className="hover:text-[#c5a880] transition-all cursor-pointer pb-0.5 hover:italic">listen</button>
            <a href="https://www.instagram.com/atzmusicofficial/" target="_blank" rel="noreferrer" className="hover:text-[#c5a880] transition-all cursor-pointer pb-0.5 hover:italic">instagram</a>
            <button onClick={() => scrollToSection('communications')} className="hover:text-[#c5a880] transition-all cursor-pointer pb-0.5 hover:italic">contact</button>
          </nav>

          {/* Social Icons Hub */}
          <div className="flex items-center gap-4">
            <a 
              href="https://open.spotify.com/artist/3qBExvvWJ1gt14vDHfTo5u" 
              target="_blank" 
              rel="noreferrer" 
              className="text-neutral-300 hover:text-white transition-all flex items-center gap-2 bg-[#c5a880]/10 hover:bg-[#c5a880]/20 px-3 py-1.5 rounded-full border border-[#c5a880]/20 hover:border-[#c5a880]/40 text-[10px] font-serif tracking-wider font-semibold italic"
              title="spotify artist profile"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#c5a880] animate-pulse"></span>
              spotify
            </a>
            <a 
              href="https://www.youtube.com/@atzmusicofficial" 
              target="_blank" 
              rel="noreferrer" 
              className="text-neutral-400 hover:text-[#c5a880] transition-colors p-2 hover:bg-white/5 rounded-full" 
              title="YouTube"
            >
              <Youtube className="w-4 h-4" />
            </a>
          </div>
        </div>
      </header>

      {/* Main Content Sections */}
      <main className="flex-1 relative z-10">

        {/* SECTION 1: Immersive Artistic Jazz Hero Panel */}
        <section 
          id="hero-intro" 
          className="relative min-h-[92vh] flex items-center justify-center overflow-hidden px-6 md:px-12 py-16 border-b border-[#c5a880]/10"
        >
          {/* Permanent background of the actual musician photo / custom selection */}
          <div className="absolute inset-0 z-0 select-none bg-neutral-950">
            <img
              src={heroBg}
              alt="Artistic Musician Background"
              referrerPolicy="no-referrer"
              className="absolute inset-0 w-full h-full object-cover opacity-50 md:opacity-65 object-right md:object-center transition-all duration-1000"
            />
            {/* Elegant warm vignette/gradient to ensure text readability */}
            <div className="absolute inset-0 bg-gradient-to-r from-neutral-950 via-neutral-950/80 to-transparent pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-neutral-950/50 pointer-events-none" />
            
            {/* Sprinkled Floating Background Musical Notes throughout the canvas */}
            <div className="absolute top-[15%] left-[10%] text-[#c5a880]/20 text-5xl select-none pointer-events-none animate-float-note" style={{ animationDelay: '0s', animationDuration: '8s' }}>𝄞</div>
            <div className="absolute top-[40%] left-[5%] text-[#c5a880]/15 text-4xl select-none pointer-events-none animate-float-note" style={{ animationDelay: '3s', animationDuration: '10s' }}>♩</div>
            <div className="absolute bottom-[25%] left-[12%] text-white/10 text-3xl select-none pointer-events-none animate-float-note" style={{ animationDelay: '1.5s', animationDuration: '7s' }}>♫</div>
            <div className="absolute top-[20%] right-[10%] text-[#c5a880]/15 text-4xl select-none pointer-events-none animate-float-note" style={{ animationDelay: '4.5s', animationDuration: '9s' }}>♬</div>
            <div className="absolute top-[45%] right-[18%] text-white/10 text-3xl select-none pointer-events-none animate-float-note" style={{ animationDelay: '2s', animationDuration: '11s' }}>𝄢</div>
            <div className="absolute bottom-[30%] right-[8%] text-[#c5a880]/15 text-5xl select-none pointer-events-none animate-float-note" style={{ animationDelay: '0.5s', animationDuration: '6s' }}>𝄽</div>
          </div>

          {/* Floating Background Customizer Panel Trigger */}
          <div className="absolute top-6 right-6 md:right-12 z-30">
            <button
              onClick={() => setIsPanelOpen(!isPanelOpen)}
              className="flex items-center gap-2 px-4 py-2.5 bg-neutral-900/85 hover:bg-[#c5a880] hover:text-neutral-950 text-white rounded-xl border border-[#c5a880]/30 hover:border-transparent transition-all backdrop-blur-md shadow-2xl text-[10px] font-bold tracking-widest uppercase cursor-pointer"
              title="Change Background Image"
            >
              <ImageIcon className="w-3.5 h-3.5 text-[#c5a880]" />
              <span>Change Hero Background</span>
            </button>
            
            <AnimatePresence>
              {isPanelOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 mt-3 w-80 bg-neutral-950/95 border border-[#c5a880]/30 rounded-2xl p-5 shadow-2xl backdrop-blur-xl z-50 text-left"
                >
                  <div className="flex items-center justify-between mb-4 pb-2 border-b border-white/5">
                    <h4 className="text-xs uppercase tracking-widest text-[#c5a880] font-semibold">Select Background</h4>
                    <button onClick={() => setIsPanelOpen(false)} className="text-neutral-400 hover:text-white cursor-pointer">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  
                  {/* Presets Grid */}
                  <div className="space-y-2 mb-4">
                    <span className="text-[10px] uppercase text-neutral-500 tracking-wider font-semibold block">Artist Presets</span>
                    <div className="grid grid-cols-2 gap-2">
                      {BACKGROUND_PRESETS.map((preset) => (
                        <button
                          key={preset.id}
                          onClick={() => {
                            setHeroBg(preset.url);
                            if (preset.id === 'default') {
                              safeRemoveLocalStorage('custom_background_url');
                            } else {
                              safeSetLocalStorage('custom_background_url', preset.url);
                            }
                          }}
                          className={`group relative h-16 rounded-lg overflow-hidden border transition-all cursor-pointer ${
                            heroBg === preset.url ? 'border-[#c5a880] ring-1 ring-[#c5a880]' : 'border-white/10 hover:border-[#c5a880]/50'
                          }`}
                        >
                          <img src={preset.url} className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity" alt="" />
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center p-1">
                            <span className="text-[9px] text-white font-medium text-center leading-tight truncate w-full">{preset.name}</span>
                          </div>
                          {heroBg === preset.url && (
                            <div className="absolute top-1 right-1 bg-[#c5a880] text-black rounded-full p-0.5">
                              <Check className="w-2.5 h-2.5 stroke-[3]" />
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  {/* Upload File / Custom URL */}
                  <div className="space-y-3 pt-3 border-t border-white/5">
                    <span className="text-[10px] uppercase text-neutral-500 tracking-wider font-semibold block">Or Upload Your Own Image</span>
                    
                    <label className="flex flex-col items-center justify-center border border-dashed border-[#c5a880]/20 hover:border-[#c5a880]/50 rounded-xl py-4 bg-neutral-900/40 cursor-pointer transition-colors text-center">
                      <Upload className="w-5 h-5 text-[#c5a880] mb-1.5" />
                      <span className="text-[10px] text-neutral-300 font-medium">Browse Local Photo</span>
                      <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                    </label>
                    
                    <form onSubmit={handleApplyCustomUrl} className="space-y-1.5">
                      <span className="text-[10px] uppercase text-neutral-500 tracking-wider font-semibold block">Or Paste Direct Image URL</span>
                      <div className="flex gap-1.5">
                        <input
                          type="text"
                          placeholder="https://images.unsplash.com/..."
                          value={customUrlInput}
                          onChange={(e) => setCustomUrlInput(e.target.value)}
                          className="flex-1 px-2.5 py-1.5 bg-neutral-900 border border-white/10 rounded-lg text-[10px] text-neutral-300 placeholder-neutral-600 focus:outline-none focus:border-[#c5a880]/50"
                        />
                        <button type="submit" className="px-3 bg-[#c5a880] text-black text-[10px] font-bold rounded-lg uppercase cursor-pointer hover:bg-[#dfc49c] transition-all">
                          Apply
                        </button>
                      </div>
                    </form>
                    
                    {uploadSuccess && (
                      <div className="text-[10px] text-emerald-400 font-medium flex items-center gap-1 mt-1 justify-center">
                        <Check className="w-3.5 h-3.5" />
                        <span>Background applied!</span>
                      </div>
                    )}

                    {quotaWarning && (
                      <div className="text-[9px] text-amber-400 font-medium leading-relaxed mt-1 text-center border border-amber-500/10 p-2 rounded-lg bg-amber-500/5">
                        <span>Applied in-session! (File exceeds storage quota, so it won't persist after page reload)</span>
                      </div>
                    )}
                    
                    <button
                      onClick={handleResetBg}
                      className="w-full flex items-center justify-center gap-1.5 py-2 mt-2 border border-white/5 bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-white rounded-lg text-[10px] uppercase tracking-widest cursor-pointer transition-colors font-semibold"
                    >
                      <RotateCcw className="w-3 h-3" />
                      Reset to Default
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Core Content Container */}
          <div className="w-full max-w-7xl mx-auto relative z-20">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              
              {/* Left Column: Premium Typography Column */}
              <div className="lg:col-span-8 flex flex-col items-start text-left relative z-10">
                
                {/* Subtitle Accent */}
                <span className="text-[#c5a880] tracking-[0.3em] font-sans font-bold text-xs mb-4 animate-fade-in flex items-center gap-2 uppercase">
                  <span>𝄞</span>
                  <span>trumpet artist & performer</span>
                  <span className="text-xs">𝄽</span>
                </span>

                {/* Main Heading styled with beautiful clean modern sans-serif */}
                <h1 className="font-sans text-5xl sm:text-7xl lg:text-[5.5rem] font-light tracking-tight leading-[0.95] text-white mb-6 uppercase">
                  music is my <span className="text-[#c5a880] font-normal">voice</span>
                </h1>

                {/* Subtext description */}
                <p className="font-sans text-stone-300 font-light leading-relaxed max-w-xl mb-8 text-sm md:text-base">
                  "From the first notes of childhood to the concert stage — Alexander Triestman brings passion, precision, and soul to every performance."
                </p>

                {/* Interactive Instruments Section - Piano is downsized, Trumpet is extremely visible, Shaded piano and trumpet imagery */}
                <div className="w-full max-w-xl mb-10 bg-neutral-950/85 border border-[#c5a880]/20 rounded-2xl p-5 md:p-6 backdrop-blur-md relative overflow-hidden shadow-2xl">
                  {/* Scattered shaded ambient background illustrations */}
                  <div className="absolute right-0 bottom-0 top-0 w-1/3 bg-cover bg-center opacity-[0.06] pointer-events-none mix-blend-overlay" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?q=80&w=400')" }} />
                  
                  {/* TRUMPET PANEL - Highlighting the trumpet to make it extremely visible! */}
                  <div className="mb-6 relative z-10">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 bg-[#c5a880] text-neutral-950 text-[9px] font-bold uppercase tracking-wider rounded">Trumpet</span>
                        <h4 className="text-[11px] font-mono uppercase tracking-widest text-[#c5a880]">✧ Bb Signature Trumpet Valves</h4>
                      </div>
                      <span className="text-[10px] text-neutral-500 font-mono">Input active</span>
                    </div>

                    <div className="grid grid-cols-12 gap-4 items-center">
                      {/* Left: Beautifully Shaded Trumpet Close-up Image so they can definitely see it */}
                      <div className="col-span-4 h-24 rounded-lg overflow-hidden border border-[#c5a880]/20 relative group shadow-md bg-black">
                        <img 
                          src="https://images.unsplash.com/photo-1511192336575-5a79af67a629?q=80&w=400" 
                          alt="Gleaming golden trumpet" 
                          className="w-full h-full object-cover opacity-85 group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
                        <span className="absolute bottom-1 left-2 text-[8px] font-bold text-[#c5a880] uppercase tracking-wider">True Brass</span>
                      </div>

                      {/* Right: Highly Glowing Gold SVG Trumpet Line-art */}
                      <div className="col-span-8 relative">
                        <svg 
                          viewBox="0 0 400 180" 
                          className="w-full h-auto text-[#c5a880] transition-transform hover:scale-[1.02] duration-300" 
                          fill="none" 
                          xmlns="http://www.w3.org/2000/svg"
                          style={{ filter: 'drop-shadow(0px 0px 14px rgba(197, 168, 128, 0.7))' }}
                        >
                          {/* Mouthpiece */}
                          <path d="M 25 90 L 45 90 M 25 84 L 25 96 M 25 84 L 35 87 L 35 93 L 25 96" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                          
                          {/* Tubing */}
                          <path d="M 35 87 L 195 87" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                          <path d="M 35 93 L 195 93" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                          
                          {/* Loop Details */}
                          <path d="M 195 87 C 235 87, 235 55, 195 55 L 85 55 C 65 55, 65 70, 85 70 L 145 70" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                          <path d="M 195 93 C 245 93, 245 125, 195 125 L 145 125" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                          
                          {/* Valves */}
                          <rect x="145" y="40" width="10" height="90" rx="2" stroke="currentColor" strokeWidth="3" fill="#0c0c0c" />
                          <line x1="150" y1="40" x2="150" y2="28" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                          <circle cx="150" cy="25" r="5" stroke="currentColor" strokeWidth="3" fill="#0c0c0c" />
                          
                          <rect x="160" y="40" width="10" height="90" rx="2" stroke="currentColor" strokeWidth="3" fill="#0c0c0c" />
                          <line x1="165" y1="40" x2="165" y2="28" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                          <circle cx="165" cy="25" r="5" stroke="currentColor" strokeWidth="3" fill="#0c0c0c" />
                          
                          <rect x="175" y="40" width="10" height="90" rx="2" stroke="currentColor" strokeWidth="3" fill="#0c0c0c" />
                          <line x1="180" y1="40" x2="180" y2="28" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                          <circle cx="180" cy="25" r="5" stroke="currentColor" strokeWidth="3" fill="#0c0c0c" />
                          
                          {/* Flared Bell */}
                          <path d="M 195 93 L 315 93 C 345 93, 365 70, 385 50 L 385 130 C 365 110, 345 93, 315 93" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                          <ellipse cx="385" cy="90" rx="4" ry="40" stroke="currentColor" strokeWidth="3" fill="#0c0c0c" />
                        </svg>

                        {/* Staggered musical notes rising directly out of the trumpet's bell */}
                        <span className="absolute top-[30%] right-[12%] text-[#c5a880] text-sm animate-bounce select-none">♩</span>
                        <span className="absolute bottom-[20%] right-[4%] text-[#dfc49c] text-xs animate-pulse select-none" style={{ animationDelay: '0.4s' }}>♫</span>
                        <span className="absolute top-[10%] right-[2%] text-white text-[10px] animate-bounce select-none" style={{ animationDelay: '0.8s' }}>♬</span>
                      </div>
                    </div>
                  </div>

                  {/* DOWNSIZED PIANO PANEL - Highly compact, elegant, bone and ebony keys */}
                  <div className="w-full relative z-10 border-t border-white/5 pt-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 bg-[#c5a880] text-neutral-950 text-[9px] font-bold uppercase tracking-wider rounded">Piano</span>
                        <h4 className="text-[11px] font-mono uppercase tracking-widest text-[#c5a880]">✧ downsized acoustic keys</h4>
                      </div>
                      <span className="text-[9px] text-neutral-500 font-mono">hover / tap keys</span>
                    </div>
                    
                    <div className="relative w-full h-16 bg-neutral-950 border border-[#c5a880]/20 rounded-lg overflow-hidden p-0.5 flex shadow-2xl">
                      {WHITE_KEYS.map((key) => (
                        <button
                          key={key.note}
                          onMouseEnter={() => playAmbientTone(key.freq)}
                          onClick={() => playAmbientTone(key.freq)}
                          className="flex-1 h-full bg-[#fcfaf2] hover:bg-[#ebdcb9] border-r border-neutral-300 last:border-r-0 rounded-b transition-all duration-100 relative group flex items-end justify-center pb-0.5 cursor-pointer shadow-sm active:bg-[#dfc49c]"
                          title={`Play ${key.note}`}
                        >
                          <span className="font-mono text-[6px] text-neutral-400 group-hover:text-neutral-950 transition-colors uppercase font-semibold select-none">{key.note}</span>
                        </button>
                      ))}
                      
                      {BLACK_KEYS.map((key) => (
                        <button
                          key={key.note}
                          onMouseEnter={() => playAmbientTone(key.freq)}
                          onClick={() => playAmbientTone(key.freq)}
                          style={{ left: key.leftOffset }}
                          className="absolute w-[5%] h-[55%] bg-neutral-950 hover:bg-[#c5a880] border-b-2 border-black rounded-b z-10 transition-all duration-75 flex items-end justify-center pb-0.5 cursor-pointer shadow-md"
                          title={`Play ${key.note}`}
                        >
                          <span className="font-mono text-[4.5px] text-neutral-500 group-hover:text-black transition-colors uppercase font-bold select-none">{key.note}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Main Action Buttons */}
                <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
                  <button
                    onClick={() => scrollToSection('sound-system')}
                    className="w-full sm:w-auto px-8 py-4 bg-[#c5a880] text-black font-sans font-semibold uppercase tracking-widest text-xs rounded-md shadow-2xl hover:bg-[#dfc49c] transition-colors cursor-pointer flex items-center justify-center gap-2"
                  >
                    ♩ watch & listen
                  </button>

                  <button
                    onClick={() => scrollToSection('communications')}
                    className="w-full sm:w-auto px-8 py-4 bg-transparent text-white font-sans font-semibold uppercase tracking-widest text-xs rounded-md border border-[#c5a880]/30 hover:border-[#c5a880] hover:text-[#c5a880] transition-colors cursor-pointer flex items-center justify-center gap-2"
                  >
                    ♬ book a show
                  </button>
                </div>
              </div>

              {/* Right Column: Beautiful Portrait Graphic Card of Alexander (with golden accenting) */}
              <div className="lg:col-span-4 hidden lg:flex flex-col gap-6 items-center justify-center relative">
                {/* Floating ambient graphic card of the artist */}
                <div className="w-full max-w-[320px] rounded-2xl border border-[#c5a880]/20 bg-neutral-900/40 p-3 backdrop-blur-md shadow-2xl relative overflow-hidden group">
                  <div className="aspect-[4/5] rounded-xl overflow-hidden bg-black relative mb-4">
                    <img 
                      src={trumpetNightBg} 
                      alt="Alexander Triestman performing" 
                      className="w-full h-full object-cover object-center group-hover:scale-[1.03] transition-transform duration-700" 
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-transparent opacity-80" />
                    
                    {/* Golden banner */}
                    <div className="absolute bottom-3 left-3 bg-neutral-950/90 border border-[#c5a880]/30 px-3 py-1.5 rounded-lg backdrop-blur-sm">
                      <p className="text-[10px] font-mono uppercase text-[#c5a880] tracking-wider">Live Recital Capture</p>
                      <p className="text-[9px] text-neutral-400 mt-0.5">Trumpet Solo Session</p>
                    </div>
                  </div>
                  
                  <div className="px-1 text-left">
                    <span className="text-[9px] font-mono uppercase text-[#c5a880] tracking-widest">Acoustic Ledger</span>
                    <h4 className="text-sm font-semibold text-white mt-1 uppercase">Alexander Triestman</h4>
                    <p className="text-xs text-neutral-400 mt-1 font-light leading-relaxed">Pianist, brass mentor, and composer crafting late-night soundscapes.</p>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Smooth page navigation pointer */}
          <button 
            onClick={() => scrollToSection('about-me')}
            className="absolute bottom-6 left-1/2 -translate-x-1/2 animate-bounce p-3 text-neutral-500 hover:text-white transition-colors cursor-pointer"
            title="Scroll down"
          >
            <ArrowDown className="w-4 h-4" />
          </button>
        </section>
        {/* Divider accent line */}
        <div className="h-px bg-gradient-to-r from-transparent via-[#c5a880]/10 to-transparent max-w-7xl mx-auto" />

        {/* SECTION 1.5: About Me (Creative Identity) */}
        <section id="about-me" className="max-w-7xl mx-auto px-6 md:px-12 py-24 relative">
          <div className="mb-12 md:mb-16 text-center relative z-10">
            <span className="font-serif text-[11px] lowercase tracking-[0.3em] text-[#c5a880] font-semibold flex items-center justify-center italic">
              <span>01 // creative identity</span>
            </span>
            <h3 className="font-serif text-2xl md:text-3xl font-light tracking-widest lowercase text-white mt-2 flex items-center justify-center italic">
              <span>the artist & mind</span>
            </h3>
            <p className="font-serif text-xs text-neutral-400 max-w-md mx-auto mt-3 font-light leading-relaxed lowercase italic">
              discover the background, musical pedagogy, and multi-instrumental foundations of alexander triestman.
            </p>
          </div>

          <div className="max-w-4xl mx-auto w-full relative">
            <AboutMe />
          </div>
        </section>

        {/* Divider accent line */}
        <div className="h-px bg-gradient-to-r from-transparent via-white/5 to-transparent max-w-7xl mx-auto" />

        {/* SECTION 2: Sound System (Spotify Discography) */}
        <section id="sound-system" className="max-w-7xl mx-auto px-6 md:px-12 py-24 relative">
          <div className="mb-12 md:mb-16 text-center relative z-10">
            <span className="font-mono text-[10px] lowercase tracking-[0.3em] text-[#c5a880] font-bold flex items-center justify-center">
              <span>02 // core audio releases</span>
            </span>
            <h3 className="font-sans text-2xl md:text-3xl font-light tracking-widest lowercase text-white mt-2 flex items-center justify-center">
              <span>discography streaming</span>
            </h3>
            <p className="font-sans text-xs text-neutral-400 max-w-md mx-auto mt-3 font-light leading-relaxed lowercase">
              explore the official digital releases, single master logs, and custom-compiled ambient soundscapes from spotify.
            </p>
          </div>

          <div className="max-w-4xl mx-auto w-full relative">
            <AudioPlayer />
          </div>
        </section>

        {/* Elegant Instagram Connector Banner */}
        <section className="max-w-4xl mx-auto px-6 mt-4 mb-16 relative z-10">
          <a 
            href="https://www.instagram.com/atzmusicofficial/" 
            target="_blank" 
            rel="noreferrer"
            className="block group relative overflow-hidden rounded-2xl border border-pink-500/10 bg-neutral-900/40 p-8 text-center backdrop-blur-md transition-all duration-500 hover:border-pink-500/30 hover:shadow-[0_0_30px_rgba(236,72,153,0.1)]"
          >
            {/* Ambient glow decoration */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-72 h-72 bg-pink-500/5 rounded-full blur-[80px] pointer-events-none group-hover:bg-pink-500/10 transition-colors" />
            
            <div className="relative z-10 flex flex-col items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-yellow-500 via-pink-500 to-purple-600 flex items-center justify-center text-white shadow-lg transform group-hover:scale-110 transition-transform duration-300">
                <Instagram className="w-5 h-5" />
              </div>
              
              <p className="font-serif text-lg sm:text-xl md:text-2xl font-light tracking-wide text-neutral-200 mt-2 italic lowercase leading-relaxed">
                "connect with yourself through a broad range of genres and sounds."
              </p>
              
              <div className="flex items-center gap-2 mt-2">
                <span className="font-mono text-[10px] text-pink-400 tracking-[0.3em] uppercase font-bold">
                  follow on instagram
                </span>
                <span className="h-px w-6 bg-pink-500/30" />
                <span className="font-sans text-xs text-neutral-400 font-light group-hover:text-white transition-colors">
                  @atzmusicofficial
                </span>
              </div>
            </div>
          </a>
        </section>

        {/* Divider accent line */}
        <div className="h-px bg-gradient-to-r from-transparent via-white/5 to-transparent max-w-7xl mx-auto" />

        {/* SECTION 3: Built-in Contact Form with Admin Inbox Dashboard Toggle */}
        <section id="communications" className="max-w-7xl mx-auto px-6 md:px-12 py-24 relative border-t border-white/5">
          <div className="mb-12 md:mb-16 flex flex-col md:flex-row items-center justify-between gap-6 border-b border-white/5 pb-8 relative z-10">
            <div className="text-center md:text-left">
              <span className="font-mono text-[10px] lowercase tracking-[0.3em] text-[#c5a880] font-bold flex items-center justify-center md:justify-start">
                <span>03 // book me</span>
              </span>
              <h3 className="font-sans text-2xl md:text-3xl font-light tracking-widest lowercase text-white mt-2">
                {contactViewMode === 'form' ? "book me" : "artist inbox"}
              </h3>
              <p className="font-sans text-xs text-neutral-400 mt-2 font-light lowercase">
                {contactViewMode === 'form' 
                  ? "send direct booking, collaboration, or lesson inquiries directly to alexander's secure database."
                  : "view and manage incoming inquiries in the direct database logs."
                }
              </p>
            </div>

            {/* Toggle between Contact Form and Artist Inbox Manager */}
            <div className="flex bg-white/5 border border-white/10 p-1 rounded-xl self-stretch md:self-auto backdrop-blur-md">
              <button
                id="toggle-contact-form"
                onClick={() => setContactViewMode('form')}
                className={`flex-1 md:flex-none px-5 py-2.5 rounded-lg text-[10px] font-mono font-bold lowercase tracking-widest transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  contactViewMode === 'form'
                    ? 'bg-white text-black shadow-lg'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                <Mail className="w-3.5 h-3.5" />
                submit inquiry
              </button>
              <button
                id="toggle-contact-inbox"
                onClick={() => setContactViewMode('admin')}
                className={`flex-1 md:flex-none px-5 py-2.5 rounded-lg text-[10px] font-mono font-bold lowercase tracking-widest transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  contactViewMode === 'admin'
                    ? 'bg-white text-black shadow-lg'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5" />
                artist inbox
              </button>
            </div>
          </div>

          {/* Elegant banner for lesson & gig bookings */}
          <div className="max-w-4xl mx-auto mb-8 p-6 rounded-2xl bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 border border-white/10 text-center relative overflow-hidden backdrop-blur-md shadow-xl">
            <div className="absolute top-0 left-0 w-2 h-full bg-blue-500" />
            <div className="absolute top-0 right-0 w-2 h-full bg-pink-500" />
            <h4 className="font-sans text-lg md:text-xl font-light tracking-widest text-white lowercase">
              lesson and gig bookings for piano and trumpet
            </h4>
            <p className="font-sans text-[11px] text-neutral-400 mt-2 font-light lowercase">
              instrument lessons, recording sessions, and live venue bookings. secure your dates directly via the form below.
            </p>
          </div>

          <div className="max-w-4xl mx-auto w-full relative">
            {contactViewMode === 'form' ? (
              <ContactForm onMessageSubmitted={handleMessageSubmitted} />
            ) : (
              <InboxManager 
                refreshTrigger={inboxRefreshTrigger} 
                onMessagesChanged={handleMessageSubmitted} 
              />
            )}
          </div>
        </section>

      </main>

      {/* FOOTER */}
      <footer id="portfolio-footer" className="bg-neutral-950/80 backdrop-blur-xl border-t border-white/5 py-12 px-6 md:px-12 relative z-10">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="text-center sm:text-left">
            <p className="font-sans font-light text-base text-white tracking-[0.3em] lowercase">
              alexander triestman (atz)
            </p>
            <p className="font-sans text-[10px] text-neutral-500 mt-2 lowercase tracking-widest font-light">
              &copy; {new Date().getFullYear()} atzmusic. all rights reserved.
            </p>
          </div>

          <div className="flex items-center gap-6 text-[9px] lowercase tracking-[0.25em] text-neutral-500 font-medium">
            <span>spotify</span>
            <span>apple music</span>
            <span>bandcamp</span>
          </div>
          
          <div className="text-[9px] lowercase tracking-[0.25em] text-neutral-600 font-mono">
            designed for immersive display
          </div>
        </div>
      </footer>

    </div>
  );
}
