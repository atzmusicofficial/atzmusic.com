import React from 'react';
import { Sparkles, Instagram } from 'lucide-react';

export default function AboutMe() {
  return (
    <div id="about-me-container" className="glass-panel rounded-2xl p-6 md:p-10 shadow-2xl relative overflow-hidden z-10 bg-gradient-to-br from-neutral-900/40 via-neutral-950/65 to-neutral-950/90 border border-[#c5a880]/10">
      {/* Background ambient lighting in gold */}
      <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 w-96 h-96 bg-[#c5a880]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 translate-y-12 -translate-x-12 w-96 h-96 bg-[#c5a880]/3 rounded-full blur-3xl pointer-events-none" />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
        
        {/* LEFT COLUMN: center logo atzmusic & Scattered Instrument Images */}
        <div className="lg:col-span-5 flex flex-col justify-between relative py-2 gap-6 border-b lg:border-b-0 lg:border-r border-[#c5a880]/10 pb-8 lg:pb-0 lg:pr-8">
          
          <div className="flex flex-col items-center text-center">
            {/* Logo Sphere */}
            <div className="relative group w-48 h-48 sm:w-56 sm:h-56 rounded-full flex items-center justify-center select-none mb-4">
              {/* Spinning decorative orbits */}
              <div className="absolute inset-0 rounded-full border border-dashed border-[#c5a880]/10 animate-spin" style={{ animationDuration: '40s' }} />
              <div className="absolute inset-4 rounded-full border border-double border-white/5 animate-spin" style={{ animationDuration: '60s', animationDirection: 'reverse' }} />
              
              {/* Pulsating glow ring */}
              <div className="absolute inset-6 rounded-full bg-[#c5a880]/5 border border-white/5 group-hover:bg-[#c5a880]/10 group-hover:border-[#c5a880]/30 transition-all duration-700 blur-sm" />
              
              {/* Central Circle Glass Panel */}
              <div className="absolute inset-8 rounded-full bg-neutral-950/90 border border-white/10 backdrop-blur-md shadow-2xl flex flex-col items-center justify-center group-hover:border-[#c5a880]/35 transition-all duration-500">
                {/* Lowercase Logo Typography */}
                <span className="font-serif text-4xl sm:text-5xl font-light italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white via-[#fcfaf2] to-[#c5a880] lowercase">
                  atzmusic
                </span>
                
                {/* Lowercase Handle Subtitle with Instagram Logo integration */}
                <a 
                  href="https://www.instagram.com/atzmusicofficial/"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 font-serif text-[10px] sm:text-[11px] text-[#c5a880] hover:text-[#dfc49c] tracking-[0.25em] lowercase mt-2 italic hover:underline transition-colors"
                >
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                  </svg>
                  @atzmusicofficial
                </a>
              </div>
            </div>

            <p className="font-serif text-[10px] text-neutral-500 lowercase tracking-widest italic">
              independent catalog // est. 2022
            </p>
          </div>

          {/* Sprinkled shaded illustrations of piano & trumpet with musical notes */}
          <div className="grid grid-cols-2 gap-3 mt-4 relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 text-neutral-700/40 text-xs font-serif select-none pointer-events-none">
              ♩ &nbsp; 𝄽 &nbsp; ♬
            </div>
            
            <div className="relative rounded-xl overflow-hidden h-24 border border-[#c5a880]/15 bg-neutral-950/40 group">
              <img 
                src="https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?q=80&w=300"
                alt="Shaded grand piano keys"
                className="w-full h-full object-cover opacity-30 group-hover:opacity-50 transition-opacity duration-500"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-neutral-950/60" />
              <div className="absolute inset-0 p-3 flex flex-col justify-between">
                <span className="text-[12px] text-[#c5a880]/70 font-serif">𝄢</span>
                <span className="text-[9px] uppercase tracking-widest text-neutral-300 font-sans font-semibold">Grand Piano</span>
              </div>
            </div>

            <div className="relative rounded-xl overflow-hidden h-24 border border-[#c5a880]/15 bg-neutral-950/40 group">
              <img 
                src="https://images.unsplash.com/photo-1511192336575-5a79af67a629?q=80&w=300"
                alt="Shaded brass trumpet"
                className="w-full h-full object-cover opacity-30 group-hover:opacity-50 transition-opacity duration-500"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-neutral-950/60" />
              <div className="absolute inset-0 p-3 flex flex-col justify-between">
                <span className="text-[12px] text-[#c5a880]/70 font-serif">𝄞</span>
                <span className="text-[9px] uppercase tracking-widest text-neutral-300 font-sans font-semibold">Bb Trumpet</span>
              </div>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: Unified Comprehensive Lowercase Biography */}
        <div className="lg:col-span-7 flex flex-col justify-between gap-8">
          
          <div className="space-y-6">
            <div className="flex items-center gap-2 border-b border-[#c5a880]/10 pb-4">
              <Sparkles className="w-5 h-5 text-[#c5a880]" />
              <h4 className="font-serif text-lg font-light tracking-widest lowercase text-white italic">
                artist biography
              </h4>
            </div>

            <div className="space-y-4 font-serif text-[14px] text-stone-300 leading-relaxed font-light lowercase italic">
              <p>
                alexander triestman, operating under the independent record label and creative umbrella <span className="text-white font-medium not-italic">atz (atzmusicofficial)</span>, is a california-based multi-instrumentalist producer, trumpet specialist, pianist, and private instructor. 
              </p>
              <p>
                he graduated from <span className="text-white font-medium not-italic">cal poly pomona</span> with a b.s. in international business and a minor in marketing management, successfully aligning corporate execution with artistic curiosity. under the moniker <span className="text-white font-medium not-italic">atz</span>, he builds his musical brand completely end-to-end—driving full music composition, digital sound synthesis, album graphic curation, and video editing.
              </p>
              <p>
                his extensive live performance background is highlighted by playing for the <span className="text-white font-medium not-italic">united states military</span> in major tributes for both <span className="text-white font-medium not-italic">memorial day and 9/11 ceremonies</span>, commanding large, high-profile public venues with clean discipline and a powerful brass sound.
              </p>
              <p>
                in addition to large civic venues, alexander has performed numerous <span className="text-white font-medium not-italic">church gigs for christmas seasons</span> and special services, delivering beautiful classical trumpet solos and warm, seasonal piano orchestrations to local communities.
              </p>
              <p>
                as a session artist and sound designer, he has been an integral part of many large-scale <span className="text-white font-medium not-italic">recordings, cinematic soundscapes, and multi-instrumental projects</span>, merging high-caliber acoustic trumpet voicings with rich, atmospheric synthesizer arrangements.
              </p>
              <p>
                having led college jazz ensembles as section leader, performed in prestigious symphonic orchestras, and mentored private students in brass and music theory since 2016, alexander is a highly experienced musician who is fully open and eager to collaborate in any musical setting, genre, or creative arrangement.
              </p>
            </div>

            {/* Additional scattered instrument banner inside biography */}
            <div className="relative group rounded-xl overflow-hidden border border-[#c5a880]/15 bg-neutral-950 h-32 shadow-lg">
              <img 
                src="https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=800&auto=format&fit=crop" 
                alt="hands playing piano keys" 
                className="w-full h-full object-cover opacity-50 transition-transform duration-700 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/40 to-transparent flex flex-col justify-end p-4">
                <span className="font-serif font-semibold text-xs text-white uppercase tracking-wider mb-0.5">♩ multi genre fusion</span>
                <p className="text-[11px] text-stone-300 font-light lowercase italic">blending acoustic trumpet performance, orchestral piano keys, and electronic arrangement.</p>
              </div>
            </div>

          </div>

          {/* Quick Metrics */}
          <div className="border-t border-[#c5a880]/10 pt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="flex items-center gap-12">
              <div>
                <p className="font-serif text-2xl font-light text-white tracking-tight leading-none">20+</p>
                <p className="font-serif text-[10px] text-neutral-500 lowercase tracking-widest mt-1">label releases</p>
              </div>
              <span className="h-6 w-px bg-white/10" />
              <div>
                <p className="font-serif text-2xl font-light text-white tracking-tight leading-none">10yrs+</p>
                <p className="font-serif text-[10px] text-neutral-500 lowercase tracking-widest mt-1">teaching & brass</p>
              </div>
            </div>

            {/* Direct Email Integration */}
            <a 
              href="mailto:atzmusicofficial@gmail.com"
              className="px-5 py-2.5 bg-[#c5a880]/10 hover:bg-[#c5a880]/20 border border-[#c5a880]/20 hover:border-[#c5a880]/40 text-[#c5a880] hover:text-[#dfc49c] font-serif text-[11px] tracking-widest lowercase rounded-lg flex items-center justify-center gap-2 transition-all shrink-0 italic"
            >
              <svg className="w-4 h-4 text-[#c5a880]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              atzmusicofficial@gmail.com
            </a>
          </div>

        </div>

      </div>
    </div>
  );
}
