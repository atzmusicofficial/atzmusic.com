import React from 'react';
import { Music, Youtube, Headphones, Disc, CheckCircle, ExternalLink } from 'lucide-react';

export default function AudioPlayer() {
  return (
    <div id="spotify-player-wrapper" className="glass-panel rounded-2xl overflow-hidden shadow-2xl p-6 md:p-8 bg-gradient-to-br from-neutral-900/40 via-neutral-950/65 to-neutral-950/90 border border-[#c5a880]/15 flex flex-col lg:flex-row gap-8 items-stretch relative">
      
      {/* Background radial highlight */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-[#c5a880]/[0.03] rounded-full blur-3xl pointer-events-none" />

      {/* Left Column: Official Discography Stream & Details */}
      <div className="flex-1 flex flex-col justify-between py-2 relative z-10">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#c5a880]/10 border border-[#c5a880]/25 text-[10px] font-serif uppercase tracking-widest text-[#c5a880] mb-4 font-semibold italic">
            <span className="w-1.5 h-1.5 rounded-full bg-[#c5a880] animate-pulse"></span>
            official spotify channel
          </div>
          
          <h3 className="font-serif text-2xl md:text-3xl font-light text-white uppercase tracking-wider mb-3 italic">
            spotify discography
          </h3>
          
          <p className="font-serif text-xs md:text-sm text-stone-300 leading-relaxed font-light mb-6 lowercase italic">
            listen to the official releases of alexander triestman (atz) spanning deep jazz trumpet solos, ambient piano soundscapes, and cinematic synthesizer productions. stream high-fidelity audio direct from spotify below or open the full catalog inside the native app.
          </p>
          
          <div className="space-y-3.5 mb-8">
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-[#c5a880]/10 border border-[#c5a880]/20 flex items-center justify-center text-[#c5a880] mt-0.5 text-[10px] font-serif italic font-bold">
                ♩
              </div>
              <div>
                <h5 className="font-serif text-xs font-semibold text-white tracking-wide uppercase">lossless master sources</h5>
                <p className="font-serif text-[11px] text-neutral-400 mt-0.5 lowercase italic">mastered files optimized for spatial, high-dynamic audio delivery.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-[#c5a880]/10 border border-[#c5a880]/20 flex items-center justify-center text-[#c5a880] mt-0.5 text-[10px] font-serif italic font-bold">
                ♬
              </div>
              <div>
                <h5 className="font-serif text-xs font-semibold text-white tracking-wide uppercase">cross-platform availability</h5>
                <p className="font-serif text-[11px] text-neutral-400 mt-0.5 lowercase italic">accessible globally on mobile devices, desktop clients, and web interfaces.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Hub */}
        <div className="flex flex-col sm:flex-row gap-4 mt-auto">
          <a
            href="https://open.spotify.com/artist/3qBExvvWJ1gt14vDHfTo5u"
            target="_blank"
            rel="noreferrer"
            className="flex-1 px-6 py-4 bg-[#c5a880] text-black font-serif font-semibold uppercase tracking-widest text-[11px] rounded-xl shadow-xl hover:bg-[#dfc49c] hover:shadow-[#c5a880]/10 transition-all transform active:scale-95 flex items-center justify-center gap-2"
          >
            <Music className="w-4 h-4 fill-current text-black" />
            open spotify profile
          </a>
          <a
            href="https://www.youtube.com/@atzmusicofficial"
            target="_blank"
            rel="noreferrer"
            className="flex-1 px-6 py-4 bg-white/5 hover:bg-white/10 text-white font-serif font-semibold uppercase tracking-widest text-[11px] rounded-xl border border-white/10 hover:border-white/20 transition-all flex items-center justify-center gap-2 italic"
          >
            <Youtube className="w-4 h-4 text-[#c5a880]" />
            youtube studio
          </a>
        </div>
      </div>

      {/* Right Column: Embedded Spotify Playlist Widget */}
      <div className="lg:w-[50%] flex flex-col justify-center bg-black/40 p-4 rounded-xl border border-[#c5a880]/10 relative min-h-[380px] z-10">
        <iframe
          src="https://open.spotify.com/embed/artist/3qBExvvWJ1gt14vDHfTo5u?utm_source=generator&theme=0"
          width="100%"
          height="380"
          frameBorder="0"
          allowFullScreen={true}
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          loading="lazy"
          className="rounded-xl shadow-inner"
          title="atz spotify player"
        ></iframe>
      </div>

    </div>
  );
}
