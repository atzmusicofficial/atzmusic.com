import React, { useState } from 'react';
import { Send, Mail, User, Info, CheckCircle, Sparkles } from 'lucide-react';
import { Message } from '../types';

interface ContactFormProps {
  onMessageSubmitted: () => void;
}

export default function ContactForm({ onMessageSubmitted }: ContactFormProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [department, setDepartment] = useState<'general' | 'booking' | 'collaboration' | 'press'>('general');
  const [content, setContent] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !subject.trim() || !content.trim()) {
      setError('Please fill in all the fields before submitting.');
      return;
    }

    setError('');
    setIsSubmitting(true);

    // Simulate network delay
    setTimeout(() => {
      const newMessage: Message = {
        id: 'msg-' + Math.random().toString(36).substr(2, 9),
        name: name.trim(),
        email: email.trim(),
        subject: subject.trim(),
        department,
        content: content.trim(),
        timestamp: new Date().toISOString(),
        isRead: false
      };

      try {
        const stored = localStorage.getItem('atz_messages');
        const list: Message[] = stored ? JSON.parse(stored) : [];
        list.unshift(newMessage);
        localStorage.setItem('atz_messages', JSON.stringify(list));
      } catch (err) {
        console.error('Failed to save message to localStorage', err);
      }

      setIsSubmitting(false);
      setSubmitSuccess(true);
      
      // Clear fields
      setName('');
      setEmail('');
      setSubject('');
      setDepartment('general');
      setContent('');

      // Notify parent to refresh messages lists
      onMessageSubmitted();
    }, 1200);
  };

  return (
    <div id="contact-form-container" className="glass-panel rounded-2xl p-6 md:p-8 shadow-2xl relative overflow-hidden h-full flex flex-col justify-between z-10 bg-gradient-to-br from-neutral-900/40 via-neutral-950/65 to-neutral-950/90 border border-[#c5a880]/15">
      
      {/* Absolute ambient light effect */}
      <div className="absolute -top-32 -right-32 w-64 h-64 bg-[#c5a880]/5 rounded-full blur-3xl pointer-events-none" />
      
      {submitSuccess ? (
        <div id="contact-success-card" className="flex-1 flex flex-col items-center justify-center text-center py-8">
          <div className="w-16 h-16 rounded-full bg-[#c5a880]/10 border border-[#c5a880]/30 flex items-center justify-center text-[#c5a880] mb-6 animate-bounce">
            <CheckCircle className="w-8 h-8" />
          </div>
          
          <h3 className="font-serif font-light tracking-widest uppercase text-xl text-white mb-2 italic">
            Inquiry Dispatched
          </h3>
          <p className="font-serif text-xs text-stone-300 max-w-sm mb-8 font-light leading-relaxed lowercase italic">
            Your transmission has been logged successfully. Alexander's management team will review and reply shortly.
          </p>

          <button
            id="reset-form-btn"
            onClick={() => setSubmitSuccess(false)}
            className="px-5 py-3 bg-white/5 hover:bg-white/10 text-white rounded-lg border border-white/10 hover:border-white/20 transition-all font-serif text-[11px] font-bold uppercase tracking-widest cursor-pointer italic"
          >
            Send Another Message
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4 flex flex-col h-full justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Mail className="w-4 h-4 text-[#c5a880]" />
              <h3 className="font-serif font-light tracking-widest uppercase text-base text-white italic">
                book me // submit inquiry
              </h3>
            </div>
            <p className="font-serif text-xs text-stone-300 mb-6 font-light leading-relaxed lowercase italic">
              Submit booking requests, private piano/trumpet lesson inquiries, or creative collaborations directly to Alexander's secure ledger.
            </p>

            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-xs font-serif mb-4 lowercase italic">
                {error}
              </div>
            )}

            {/* Inputs grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-[11px] font-serif text-[#c5a880] uppercase tracking-wider font-light italic">
                  Full Name
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-neutral-500">
                    <User className="w-4 h-4" />
                  </span>
                  <input
                    id="contact-input-name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full pl-10 pr-4 py-2.5 bg-neutral-950/60 border border-[#c5a880]/20 rounded-lg text-xs font-serif text-neutral-200 placeholder-neutral-600 focus:outline-none focus:border-[#c5a880]/30 focus:ring-1 focus:ring-[#c5a880]/10 transition-all lowercase italic"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-[11px] font-serif text-[#c5a880] uppercase tracking-wider font-light italic">
                  Email Address
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-neutral-500">
                    <Mail className="w-4 h-4" />
                  </span>
                  <input
                    id="contact-input-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full pl-10 pr-4 py-2.5 bg-neutral-950/60 border border-[#c5a880]/20 rounded-lg text-xs font-serif text-neutral-200 placeholder-neutral-600 focus:outline-none focus:border-[#c5a880]/30 focus:ring-1 focus:ring-[#c5a880]/10 transition-all lowercase italic"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
              <div className="space-y-1.5">
                <label className="block text-[11px] font-serif text-[#c5a880] uppercase tracking-wider font-light italic">
                  Department
                </label>
                <select
                  id="contact-select-department"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 bg-neutral-950/60 border border-[#c5a880]/20 rounded-lg text-xs font-serif text-neutral-300 focus:outline-none focus:border-[#c5a880]/30 focus:ring-1 focus:ring-[#c5a880]/10 transition-all cursor-pointer lowercase italic"
                >
                  <option value="general">General Inquiry</option>
                  <option value="booking">Booking Agent</option>
                  <option value="collaboration">Creative Collaboration</option>
                  <option value="press">Press & Media</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="block text-[11px] font-serif text-[#c5a880] uppercase tracking-wider font-light italic">
                  Subject Header
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-neutral-500">
                    <Info className="w-4 h-4" />
                  </span>
                  <input
                    id="contact-input-subject"
                    type="text"
                    required
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Subject of inquiry"
                    className="w-full pl-10 pr-4 py-2.5 bg-neutral-950/60 border border-[#c5a880]/20 rounded-lg text-xs font-serif text-neutral-200 placeholder-neutral-600 focus:outline-none focus:border-[#c5a880]/30 focus:ring-1 focus:ring-[#c5a880]/10 transition-all lowercase italic"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-1.5 mt-4">
              <label className="block text-[11px] font-serif text-[#c5a880] uppercase tracking-wider font-light italic">
                Inquiry Message Details
              </label>
              <textarea
                id="contact-input-content"
                required
                rows={4}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Describe your booking date, venue, project timeline, or media questions..."
                className="w-full px-4 py-3 bg-neutral-950/60 border border-[#c5a880]/20 rounded-lg text-xs font-serif text-neutral-200 placeholder-neutral-600 focus:outline-none focus:border-[#c5a880]/30 focus:ring-1 focus:ring-[#c5a880]/10 transition-all resize-none font-light lowercase italic"
              />
            </div>
          </div>

          <div className="pt-4 flex items-center justify-between gap-4">
            <span className="text-[10px] font-serif text-neutral-500 flex items-center gap-1 italic lowercase">
              <Sparkles className="w-3.5 h-3.5 text-[#c5a880]" />
              secure ledger active
            </span>
            <button
              id="contact-submit-btn"
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 bg-[#c5a880] hover:bg-[#dfc49c] text-black font-serif text-[11px] font-semibold uppercase tracking-widest rounded-lg transition-all shadow-md active:scale-95 disabled:opacity-50 flex items-center gap-2 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                  transmitting...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 text-black" />
                  transmit inquiry ♩
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
