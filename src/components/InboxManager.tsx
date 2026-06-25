import React, { useState, useEffect } from 'react';
import { Mail, Trash2, Check, RefreshCw, Eye, Star, CornerDownLeft, Inbox, Shield, Lock } from 'lucide-react';
import { Message } from '../types';

interface InboxManagerProps {
  refreshTrigger: number;
  onMessagesChanged: () => void;
}

export default function InboxManager({ refreshTrigger, onMessagesChanged }: InboxManagerProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedMsg, setSelectedMsg] = useState<Message | null>(null);
  const [isReplying, setIsReplying] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [replySuccess, setReplySuccess] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Load messages from localStorage
  const loadMessages = () => {
    try {
      const stored = localStorage.getItem('atz_messages');
      if (stored) {
        setMessages(JSON.parse(stored));
      } else {
        // Seed initial mock messages for better visual display on first load
        const mockMessages: Message[] = [
          {
            id: 'mock-1',
            name: 'Sarah Jenkins',
            email: 'sjenkins@sonarbooking.com',
            subject: 'Headliner Request - Berlin Synth Festival 2026',
            department: 'booking',
            content: 'Hi Alexander, we love your latest releases under ATZ and want to invite you to headline the Late-Night ambient stage in Berlin on Nov 14th. Let us know your availability and rates.',
            timestamp: new Date(Date.now() - 3600000 * 4).toISOString(),
            isRead: false
          },
          {
            id: 'mock-2',
            name: 'Damian Black',
            email: 'd.black@cybernetlabel.org',
            subject: 'Vocal Collaboration Offer',
            department: 'collaboration',
            content: 'Hey ATZ, I\'m working on a dystopian synthwave album and think your horn voicings and trumpet/piano production would be perfect. Let\'s collab!',
            timestamp: new Date(Date.now() - 3600000 * 24).toISOString(),
            isRead: true
          }
        ];
        localStorage.setItem('atz_messages', JSON.stringify(mockMessages));
        setMessages(mockMessages);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadMessages();
  }, [refreshTrigger]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'admin' || password === 'atz' || password === '') {
      setIsAuthenticated(true);
      setLoginError('');
    } else {
      setLoginError('Invalid authorization key.');
    }
  };

  const handleMarkRead = (id: string) => {
    const updated = messages.map((m) => {
      if (m.id === id) return { ...m, isRead: true };
      return m;
    });
    setMessages(updated);
    localStorage.setItem('atz_messages', JSON.stringify(updated));
    if (selectedMsg && selectedMsg.id === id) {
      setSelectedMsg({ ...selectedMsg, isRead: true });
    }
    onMessagesChanged();
  };

  const handleDelete = (id: string) => {
    const filtered = messages.filter((m) => m.id !== id);
    setMessages(filtered);
    localStorage.setItem('atz_messages', JSON.stringify(filtered));
    if (selectedMsg && selectedMsg.id === id) {
      setSelectedMsg(null);
    }
    onMessagesChanged();
  };

  const handleSendReply = () => {
    if (!replyText.trim()) return;
    setIsReplying(true);
    setTimeout(() => {
      setIsReplying(false);
      setReplySuccess(true);
      setReplyText('');
      setTimeout(() => {
        setReplySuccess(false);
      }, 3000);
    }, 1000);
  };

  const selectReplyTemplate = (template: string) => {
    if (!selectedMsg) return;
    if (template === 'booking') {
      setReplyText(`Hi ${selectedMsg.name},\n\nThank you for reaching out regarding booking. I am very interested in this opportunity! My booking agent will contact you shortly with our technical rider, performance rates, and schedule details.\n\nBest regards,\nATZ Team`);
    } else if (template === 'decline') {
      setReplyText(`Hi ${selectedMsg.name},\n\nThank you so much for the invitation. Unfortunately, due to scheduling conflicts on those dates, we are unable to accept this booking. Let's stay in touch for future projects!\n\nBest,\nAlexander Triestman (ATZ)`);
    } else {
      setReplyText(`Hi ${selectedMsg.name},\n\nThanks for your message! We appreciate you reaching out and sharing this. Our team will look over the details and get back to you as soon as possible.\n\nWarmly,\nATZMUSIC Team`);
    }
  };

  const getDepartmentLabel = (dept: string) => {
    switch (dept) {
      case 'booking': return 'Booking';
      case 'collaboration': return 'Collab';
      case 'press': return 'Press';
      default: return 'General';
    }
  };

  const getDepartmentColor = (dept: string) => {
    switch (dept) {
      case 'booking': return 'bg-[#c5a880]/10 text-[#c5a880] border border-[#c5a880]/20';
      case 'collaboration': return 'bg-white/5 text-neutral-300 border border-white/10';
      case 'press': return 'bg-[#dfc49c]/10 text-[#dfc49c] border border-[#dfc49c]/20';
      default: return 'bg-neutral-500/10 text-neutral-400 border border-neutral-500/20';
    }
  };

  // Auth Screen if not unlocked
  if (!isAuthenticated) {
    return (
      <div id="admin-auth-container" className="bg-neutral-900/80 backdrop-blur-xl border border-[#c5a880]/20 rounded-2xl p-8 max-w-md mx-auto text-center shadow-2xl">
        <div className="w-14 h-14 bg-[#c5a880]/10 border border-[#c5a880]/25 text-[#c5a880] flex items-center justify-center rounded-full mx-auto mb-5">
          <Shield className="w-6 h-6" />
        </div>
        <h3 className="font-serif text-xl font-light text-white mb-2 italic">
          Artist Decryption Key Required 𝄞
        </h3>
        <p className="font-serif text-xs text-stone-300 mb-6 lowercase italic">
          Decrypt the communications ledger database. Just click **Unlock Ledger** directly or enter any key to proceed.
        </p>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-neutral-600">
              <Lock className="w-4 h-4" />
            </span>
            <input
              id="admin-pass-input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Authorization Key (leave blank)"
              className="w-full pl-10 pr-4 py-2.5 bg-neutral-950/80 border border-[#c5a880]/20 rounded-xl text-xs font-serif text-center text-neutral-200 placeholder-neutral-700 focus:outline-none focus:border-[#c5a880]/50 lowercase italic"
            />
          </div>

          {loginError && (
            <p className="text-red-400 font-serif text-[11px] uppercase tracking-wider italic">{loginError}</p>
          )}

          <button
            id="admin-auth-submit-btn"
            type="submit"
            className="w-full py-2.5 bg-[#c5a880] hover:bg-[#dfc49c] text-black rounded-xl font-serif text-xs font-semibold hover:shadow-[#c5a880]/10 transition-all active:scale-95 transform shadow-lg"
          >
            Unlock Communications Ledger
          </button>
        </form>
      </div>
    );
  }

  const unreadCount = messages.filter(m => !m.isRead).length;

  return (
    <div id="inbox-dashboard" className="bg-neutral-900/80 backdrop-blur-xl border border-[#c5a880]/10 rounded-2xl overflow-hidden shadow-2xl flex flex-col lg:flex-row h-[550px]">
      
      {/* Left List Pane */}
      <div className="w-full lg:w-[45%] border-b lg:border-b-0 lg:border-r border-neutral-800 flex flex-col justify-between">
        {/* Inbox Header */}
        <div className="p-4 md:p-5 border-b border-neutral-800/80 bg-neutral-950/30 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Inbox className="w-4 h-4 text-[#c5a880]" />
            <h3 className="font-serif text-sm font-light text-white uppercase tracking-wider italic">
              Inbox Inquiries
            </h3>
            {unreadCount > 0 && (
              <span className="bg-[#c5a880] text-black font-serif text-[9px] px-1.5 py-0.5 rounded-full animate-pulse italic">
                {unreadCount} NEW
              </span>
            )}
          </div>
          <button 
            id="refresh-inbox-btn"
            onClick={loadMessages} 
            className="p-1.5 text-neutral-500 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors"
            title="Reload database logs"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* List of Messages */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2 max-h-[480px]">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-8">
              <Mail className="w-8 h-8 text-neutral-700 mb-2 animate-bounce" />
              <p className="font-serif text-xs text-neutral-500 lowercase italic">
                Communications ledger is empty. Try submitting the contact form to see messages instantly populate!
              </p>
            </div>
          ) : (
            messages.map((msg) => (
              <button
                id={`msg-item-${msg.id}`}
                key={msg.id}
                onClick={() => {
                  setSelectedMsg(msg);
                  if (!msg.isRead) {
                    handleMarkRead(msg.id);
                  }
                }}
                className={`w-full text-left p-3.5 rounded-xl border transition-all flex flex-col gap-2 relative ${
                  selectedMsg?.id === msg.id
                    ? 'bg-neutral-800/80 border-[#c5a880]/30 text-white'
                    : 'bg-neutral-950/20 border-neutral-800 hover:border-neutral-800/80 hover:bg-neutral-800/20 text-neutral-300'
                }`}
              >
                {!msg.isRead && (
                  <span className="absolute top-4 right-4 w-1.5 h-1.5 rounded-full bg-[#c5a880]" />
                )}

                <div className="flex items-center justify-between gap-2 pr-2">
                  <span className="font-serif text-xs font-semibold truncate max-w-[150px] italic">
                    {msg.name}
                  </span>
                  <span className="font-serif text-[10px] text-neutral-500 italic">
                    {new Date(msg.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                <p className="font-serif text-xs truncate text-neutral-100 italic">
                  {msg.subject}
                </p>

                <div className="flex items-center justify-between mt-1">
                  <span className={`text-[9px] font-serif uppercase tracking-wider px-2 py-0.5 rounded-md ${getDepartmentColor(msg.department)}`}>
                    {getDepartmentLabel(msg.department)}
                  </span>
                  <span className="text-[10px] font-serif text-neutral-500 truncate max-w-[130px] italic">
                    {msg.email}
                  </span>
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Right Detail Pane */}
      <div className="flex-1 bg-neutral-950/20 flex flex-col justify-between">
        {selectedMsg ? (
          <div className="p-6 h-full flex flex-col justify-between overflow-y-auto">
            {/* Detail Header */}
            <div>
              <div className="flex items-start justify-between gap-4 border-b border-neutral-800/80 pb-4 mb-4">
                <div>
                  <h4 className="font-serif font-light text-white text-base italic">
                    {selectedMsg.subject}
                  </h4>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-xs text-neutral-400 font-serif">
                    <span className="font-semibold text-neutral-200">{selectedMsg.name}</span>
                    <span className="text-neutral-500 font-serif text-[11px] italic">&lt;{selectedMsg.email}&gt;</span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    id="delete-msg-btn"
                    onClick={() => handleDelete(selectedMsg.id)}
                    className="p-2 text-neutral-500 hover:text-red-400 hover:bg-neutral-800/50 rounded-lg transition-all"
                    title="Delete permanently"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Msg Content */}
              <div className="bg-neutral-950/40 rounded-xl p-4 border border-[#c5a880]/15 min-h-[120px] max-h-[160px] overflow-y-auto">
                <p className="font-serif text-xs sm:text-sm text-stone-300 leading-relaxed whitespace-pre-wrap lowercase italic">
                  {selectedMsg.content}
                </p>
              </div>

              {/* Auto Reply Templates Panel */}
              <div className="mt-5">
                <h5 className="text-[10px] font-serif uppercase tracking-widest text-[#c5a880] mb-2 italic">
                  Encrypted Dispatch Responses
                </h5>
                <div className="flex flex-wrap gap-2">
                  <button
                    id="reply-template-general"
                    onClick={() => selectReplyTemplate('general')}
                    className="px-2.5 py-1 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 hover:border-neutral-700 text-neutral-400 hover:text-white rounded-lg text-2xs font-serif transition-all italic"
                  >
                    Standard Receipt
                  </button>
                  <button
                    id="reply-template-booking"
                    onClick={() => selectReplyTemplate('booking')}
                    className="px-2.5 py-1 bg-[#c5a880]/10 hover:bg-[#c5a880]/20 border border-[#c5a880]/30 hover:border-[#c5a880]/50 text-[#c5a880] hover:text-[#dfc49c] rounded-lg text-2xs font-serif transition-all italic"
                  >
                    Accept Booking Offer
                  </button>
                  <button
                    id="reply-template-decline"
                    onClick={() => selectReplyTemplate('decline')}
                    className="px-2.5 py-1 bg-neutral-950/20 hover:bg-neutral-900/20 border border-neutral-800 hover:border-neutral-700 text-neutral-400 hover:text-white rounded-lg text-2xs font-serif transition-all italic"
                  >
                    Decline Template
                  </button>
                </div>
              </div>
            </div>

            {/* Reply Input Field */}
            <div className="mt-4 border-t border-neutral-800/80 pt-4">
              <div className="relative">
                <textarea
                  id="admin-reply-textarea"
                  rows={3}
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Draft encrypted email reply payload..."
                  className="w-full px-3.5 py-2.5 bg-neutral-950/60 border border-[#c5a880]/20 rounded-xl text-xs font-serif text-neutral-200 placeholder-neutral-700 focus:outline-none focus:border-[#c5a880]/50 transition-all resize-none lowercase italic"
                />
              </div>

              <div className="flex items-center justify-between mt-3">
                {replySuccess ? (
                  <span className="text-[10px] font-serif text-[#c5a880] flex items-center gap-1 animate-pulse italic">
                    <Check className="w-3.5 h-3.5" />
                    Secure Transmission Outbound Success!
                  </span>
                ) : (
                  <span className="text-[10px] font-serif text-neutral-500 italic">
                    Recipient: {selectedMsg.email}
                  </span>
                )}

                <button
                  id="admin-send-reply-btn"
                  onClick={handleSendReply}
                  disabled={isReplying || !replyText.trim()}
                  className="px-4 py-2 bg-[#c5a880] hover:bg-[#dfc49c] text-black font-serif text-xs font-semibold rounded-lg shadow-md transition-all flex items-center gap-1.5 disabled:opacity-30 disabled:pointer-events-none transform active:scale-95"
                >
                  <CornerDownLeft className="w-3.5 h-3.5 text-black" />
                  Transmit Reply ♩
                </button>
              </div>
            </div>

          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center p-8">
            <div className="w-12 h-12 rounded-full bg-neutral-900 border border-neutral-800/80 flex items-center justify-center text-neutral-500 mb-3">
              <Eye className="w-5 h-5" />
            </div>
            <h4 className="font-serif text-sm font-light text-white italic">
              No Message Selected
            </h4>
            <p className="font-serif text-xs text-neutral-500 max-w-xs mt-1 lowercase italic">
              Select an inquiry transmission from the feed on the left to read full telemetry, delete or dispatch a direct reply.
            </p>
          </div>
        )}
      </div>

    </div>
  );
}
