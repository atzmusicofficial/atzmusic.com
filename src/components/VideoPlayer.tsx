import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Youtube, Sparkles, Volume2, VolumeX, Sliders } from 'lucide-react';

export default function VideoPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [activeTab, setActiveTab] = useState<'visualizer' | 'embed'>('visualizer');
  const [progress, setProgress] = useState(35);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationRef = useRef<number | null>(null);

  // Hardcoded default cool YouTube video for an elegant trumpet jazz solo performance
  const defaultYoutubeEmbed = "https://www.youtube.com/embed/PcsO-r2mPec?autoplay=0&mute=0";

  // Simulate progress bar ticking when playing
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && activeTab === 'visualizer') {
      interval = setInterval(() => {
        setProgress((prev) => (prev >= 100 ? 0 : prev + 0.5));
      }, 200);
    }
    return () => clearInterval(interval);
  }, [isPlaying, activeTab]);

  // Particle System Canvas animation for the "visualizer" video mode styled with golden tones
  useEffect(() => {
    if (activeTab !== 'visualizer') return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = canvas.width;
    let height = canvas.height;

    interface Particle {
      x: number;
      y: number;
      radius: number;
      color: string;
      speedY: number;
      speedX: number;
      phase: number;
      growth: number;
    }

    const particles: Particle[] = [];
    // Golden brass and warm ivory colors to match the aesthetic
    const colors = ['#c5a880', '#dfc49c', '#f3e4cb', '#ffffff', '#a8895b'];

    // Initialize particles
    for (let i = 0; i < 40; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 4 + 1,
        color: colors[Math.floor(Math.random() * colors.length)],
        speedY: -(Math.random() * 1.2 + 0.3),
        speedX: (Math.random() * 1 - 0.5) * 0.6,
        phase: Math.random() * Math.PI * 2,
        growth: Math.random() * 0.04 + 0.01,
      });
    }

    let linePhase = 0;

    const animate = () => {
      ctx.fillStyle = 'rgba(10, 10, 12, 0.2)'; // Smooth trail
      ctx.fillRect(0, 0, width, height);

      // Draw subtle grid overlay
      ctx.strokeStyle = 'rgba(197, 168, 128, 0.03)';
      ctx.lineWidth = 1;
      const gridSize = 50;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      const activeSpeedMultiplier = isPlaying ? 2.0 : 0.25;
      linePhase += 0.01 * activeSpeedMultiplier;

      // Draw horizontal gold oscilloscope scanlines representing live trumpet wave
      ctx.strokeStyle = 'rgba(197, 168, 128, 0.3)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      for (let x = 0; x < width; x += 3) {
        const yOffset1 = Math.sin((x / 60) + linePhase) * 22;
        const yOffset2 = Math.cos((x / 140) - linePhase * 1.2) * 12;
        const yOffset3 = Math.sin((x / 12) + linePhase * 2.5) * (isPlaying ? 10 : 1.5);
        const y = height / 2 + yOffset1 + yOffset2 + yOffset3;
        if (x === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.stroke();

      // Mirror subtle wave representing piano resonance
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.beginPath();
      for (let x = 0; x < width; x += 4) {
        const yOffset1 = Math.sin((x / 80) - linePhase) * 20;
        const yOffset2 = Math.cos((x / 100) + linePhase * 1.1) * 8;
        const y = height / 2 + (yOffset1 + yOffset2) * -1;
        if (x === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.stroke();

      // Update and draw warm gold note-like particles
      particles.forEach((p) => {
        p.y += p.speedY * activeSpeedMultiplier * 0.5;
        p.x += p.speedX * activeSpeedMultiplier * 0.5;
        p.phase += p.growth * activeSpeedMultiplier;

        // Wrap around boundaries
        if (p.y < -10) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }
        if (p.x < -10 || p.x > width + 10) {
          p.x = Math.random() * width;
        }

        const sizeMod = Math.sin(p.phase) * 1.2 + p.radius;
        const size = Math.max(0.5, sizeMod);

        // Draw gold glow effect
        ctx.shadowBlur = isPlaying ? 10 : 3;
        ctx.shadowColor = p.color;

        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
        ctx.fill();

        // Reset shadow
        ctx.shadowBlur = 0;
      });

      // Draw elegant vignette
      const borderGradient = ctx.createRadialGradient(
        width / 2, height / 2, width / 4,
        width / 2, height / 2, width / 1.7
      );
      borderGradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
      borderGradient.addColorStop(1, 'rgba(10, 10, 12, 0.95)');
      ctx.fillStyle = borderGradient;
      ctx.fillRect(0, 0, width, height);

      // HUD Text styled for live jazz sessions
      ctx.fillStyle = 'rgba(197, 168, 128, 0.45)';
      ctx.font = '10px serif';
      ctx.fillText('LIVE RECORDING // ACOUSTIC LEDGER', 20, 30);
      ctx.fillText(`TEMPO: 92 BPM`, width - 110, 30);
      ctx.fillText(`INPUT 1 [TRUMPET]: ${isPlaying ? 'ACTIVE MODULATION' : 'STANDBY'}`, 20, height - 20);

      // Simulated recording blinking dot
      if (Math.floor(Date.now() / 700) % 2 === 0) {
        ctx.fillStyle = '#c5a880';
        ctx.beginPath();
        ctx.arc(width - 20, 26, 3, 0, Math.PI * 2);
        ctx.fill();
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.parentElement.clientWidth;
      height = canvas.parentElement.clientHeight || 380;
      canvas.width = width;
      canvas.height = height;
    };

    handleResize();
    animate();

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isPlaying, activeTab]);

  return (
    <div id="video-showcase-container" className="rounded-2xl overflow-hidden shadow-2xl relative z-10 bg-neutral-900/40 border border-[#c5a880]/10 backdrop-blur-md">
      {/* Player Header Tabs */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-[#c5a880]/15 bg-neutral-950/25">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-[#c5a880] animate-pulse" />
          <h3 className="font-serif text-sm font-light text-white tracking-widest lowercase italic">
            live performance session
          </h3>
        </div>

        <div className="flex bg-neutral-950 border border-[#c5a880]/20 rounded-lg p-0.5 backdrop-blur-md">
          <button
            id="tab-visualizer"
            onClick={() => {
              setActiveTab('visualizer');
              setIsPlaying(false);
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[10px] font-semibold font-serif uppercase tracking-wider transition-all cursor-pointer italic ${
              activeTab === 'visualizer'
                ? 'bg-[#c5a880] text-black shadow-md'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            Acoustic Improv ♩
          </button>
          <button
            id="tab-embed"
            onClick={() => {
              setActiveTab('embed');
              setIsPlaying(false);
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[10px] font-semibold font-serif uppercase tracking-wider transition-all cursor-pointer italic ${
              activeTab === 'embed'
                ? 'bg-[#c5a880] text-black shadow-md'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Youtube className="w-3.5 h-3.5" />
            Live Video Solo 𝄞
          </button>
        </div>
      </div>

      {/* Main Video Viewport */}
      <div className="relative aspect-video w-full bg-neutral-950 flex items-center justify-center overflow-hidden">
        {activeTab === 'visualizer' ? (
          <div className="w-full h-full relative group">
            {/* Canvas Rendering */}
            <canvas ref={canvasRef} className="w-full h-full block cursor-pointer" onClick={() => setIsPlaying(!isPlaying)} />

            {/* Dark overlay when paused */}
            {!isPlaying && (
              <div 
                className="absolute inset-0 bg-neutral-950/80 flex flex-col items-center justify-center transition-opacity cursor-pointer"
                onClick={() => setIsPlaying(true)}
              >
                <button 
                  id="video-play-overlay-btn"
                  className="w-16 h-16 rounded-full bg-neutral-900/60 hover:bg-[#c5a880]/15 text-white flex items-center justify-center border border-[#c5a880]/30 backdrop-blur-md transform group-hover:scale-110 transition-all duration-300 shadow-2xl mb-4"
                >
                  <Play className="w-7 h-7 text-[#c5a880] fill-current translate-x-0.5" />
                </button>
                <p className="font-serif text-sm text-neutral-300 font-medium tracking-wide lowercase italic">
                  click to begin the warm acoustic session
                </p>
                <p className="font-serif text-[11px] text-[#c5a880] mt-1 lowercase italic">
                  92 BPM | Live Improvisational Trumpet Solos
                </p>
              </div>
            )}

            {/* In-Video Controls Overlay (Only visible when playing & hovering) */}
            {isPlaying && (
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-neutral-950/95 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button 
                    id="video-pause-btn"
                    onClick={() => setIsPlaying(false)} 
                    className="text-[#c5a880] hover:text-white transition-colors cursor-pointer"
                  >
                    <Pause className="w-5 h-5 fill-current" />
                  </button>
                  <button 
                    id="video-mute-btn"
                    onClick={() => setIsMuted(!isMuted)} 
                    className="text-[#c5a880] hover:text-white transition-colors cursor-pointer"
                  >
                    {isMuted ? <VolumeX className="w-5 h-5 text-neutral-500" /> : <Volume2 className="w-5 h-5" />}
                  </button>
                  <span className="text-xs font-serif text-[#c5a880] italic lowercase">
                    acoustic improvisation
                  </span>
                </div>

                <div className="w-1/3 flex items-center gap-3">
                  <div className="flex-1 h-1 bg-neutral-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-[#c5a880] to-white rounded-full" 
                      style={{ width: `${progress}%` }} 
                    />
                  </div>
                  <span className="text-[10px] font-serif text-[#c5a880] italic">
                    {Math.floor(progress)}%
                  </span>
                </div>

                <div>
                  <span className="text-[10px] font-serif border border-[#c5a880]/30 rounded px-1.5 py-0.5 text-[#c5a880] italic">
                    pure gold audio
                  </span>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* YouTube Embed Mode */
          <div className="w-full h-full relative">
            <iframe
              id="youtube-embed-frame"
              className="w-full h-full absolute inset-0 border-0"
              src={defaultYoutubeEmbed}
              title="Alexander Triestman Performance Solo"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
        )}
      </div>

      {/* Video Details Bar */}
      <div className="p-6 bg-neutral-950/20 border-t border-[#c5a880]/15 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div>
          <h4 className="font-serif font-light tracking-wide text-white text-base lowercase">
            {activeTab === 'visualizer' 
              ? "ATZ (Alexander Triestman) — Late-Night Acoustic Improv Session" 
              : "ATZ (Alexander Triestman) — Live Solo Recital & Acoustic Performance"
            }
          </h4>
          <p className="font-serif text-xs text-neutral-400 mt-1.5 font-light italic lowercase">
            captured raw in a cozy late-night jazz studio. pure, unedited trumpet tones and elegant ivory keys.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
          <a
            href="https://www.youtube.com/@atzmusicofficial"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 px-4 py-2 bg-neutral-900 hover:bg-[#c5a880]/10 text-white font-serif font-semibold uppercase tracking-wider text-[10px] border border-[#c5a880]/20 hover:border-[#c5a880]/40 rounded-lg transition-colors text-center w-full sm:w-auto justify-center italic cursor-pointer"
          >
            <Youtube className="w-3.5 h-3.5 text-red-500 fill-current" />
            YouTube Channel
          </a>
          <div className="flex items-center gap-2 text-[10px] font-serif text-neutral-400 border border-[#c5a880]/20 rounded-xl px-3 py-1.5 bg-neutral-950/60 w-full sm:w-auto justify-center italic">
            <Sliders className="w-3.5 h-3.5 text-[#c5a880]" />
            <span>Stereo Recital Mix</span>
          </div>
        </div>
      </div>
    </div>
  );
}
