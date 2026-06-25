import React, { useState } from 'react';
import { MapPin, Calendar, Search, CheckCircle, Ticket } from 'lucide-react';
import { TourDate } from '../types';

interface TourDatesProps {
  dates: TourDate[];
}

export default function TourDates({ dates }: TourDatesProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedShow, setSelectedShow] = useState<TourDate | null>(null);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [attendeeName, setAttendeeName] = useState('');
  const [attendeeEmail, setAttendeeEmail] = useState('');
  const [ticketQuantity, setTicketQuantity] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filter tour dates based on city or country search
  const filteredDates = dates.filter((show) =>
    show.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
    show.venue.toLowerCase().includes(searchTerm.toLowerCase()) ||
    show.country.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleBookTicket = (show: TourDate) => {
    if (show.ticketStatus === 'sold_out') return;
    setSelectedShow(show);
    setBookingSuccess(false);
    setAttendeeName('');
    setAttendeeEmail('');
    setTicketQuantity(1);
  };

  const submitBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!attendeeName.trim() || !attendeeEmail.trim()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setBookingSuccess(true);
    }, 1000);
  };

  const getStatusBadge = (status: TourDate['ticketStatus']) => {
    switch (status) {
      case 'sold_out':
        return (
          <span className="px-2.5 py-1 text-[10px] font-serif font-semibold lowercase tracking-wider bg-red-500/10 text-red-400 border border-red-500/20 rounded-md italic">
            sold out
          </span>
        );
      case 'low_tickets':
        return (
          <span className="px-2.5 py-1 text-[10px] font-serif font-semibold lowercase tracking-wider bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-md animate-pulse italic">
            low tickets
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 text-[10px] font-serif font-semibold lowercase tracking-wider bg-[#c5a880]/10 text-[#c5a880] border border-[#c5a880]/20 rounded-md italic">
            available
          </span>
        );
    }
  };

  return (
    <div id="tour-dates-container" className="rounded-2xl p-6 md:p-8 relative z-10 bg-neutral-900/40 border border-[#c5a880]/10 backdrop-blur-md">
      
      {/* Tour Search Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-[#c5a880]/15 pb-6 mb-6">
        <div>
          <h3 className="font-serif font-light text-xl text-white tracking-widest uppercase flex items-center gap-2">
            <Calendar className="w-5 h-5 text-[#c5a880]" />
            <span className="font-serif text-lg tracking-wider text-white lowercase">live concert schedule ♩</span>
          </h3>
          <p className="font-serif text-xs text-neutral-400 mt-1.5 font-light italic lowercase">
            experience expressive improvisational jazz sessions, raw trumpet solos, and cozy acoustic sets live in concert.
          </p>
        </div>

        {/* Search Box */}
        <div className="relative w-full md:w-72">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-neutral-500">
            <Search className="w-4 h-4 text-[#c5a880]/60" />
          </span>
          <input
            id="tour-search-input"
            type="text"
            placeholder="filter by city, venue..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-neutral-950/60 border border-[#c5a880]/20 rounded-xl text-xs font-serif text-neutral-300 placeholder-neutral-500 focus:outline-none focus:border-[#c5a880]/50 transition-all font-light lowercase"
          />
        </div>
      </div>

      {/* Dates Rows */}
      <div className="space-y-3">
        {filteredDates.length === 0 ? (
          <div className="text-center py-12">
            <p className="font-serif text-sm text-neutral-500 italic">No concerts found matching "{searchTerm}".</p>
          </div>
        ) : (
          filteredDates.map((show) => (
            <div
              id={`tour-date-row-${show.id}`}
              key={show.id}
              className="p-4 rounded-xl border border-white/5 bg-neutral-950/20 hover:border-[#c5a880]/20 hover:bg-[#c5a880]/5 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4 group"
            >
              {/* Date Card */}
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-lg bg-neutral-950 border border-[#c5a880]/20 flex flex-col items-center justify-center text-center font-serif select-none flex-shrink-0 group-hover:border-[#c5a880]/40 transition-colors">
                  <span className="text-[10px] text-[#c5a880] uppercase tracking-wider font-semibold italic">
                    {show.date.split(' ')[0]}
                  </span>
                  <span className="text-sm text-white font-bold leading-none mt-0.5">
                    {show.date.split(' ')[1]}
                  </span>
                </div>

                <div>
                  <h4 className="font-serif font-semibold text-white text-sm md:text-base tracking-tight flex items-center gap-1.5 lowercase">
                    {show.venue}
                  </h4>
                  <div className="flex items-center gap-1.5 text-xs text-neutral-400 mt-1 font-serif lowercase">
                    <MapPin className="w-3.5 h-3.5 text-[#c5a880]" />
                    <span>{show.city}, {show.country}</span>
                  </div>
                </div>
              </div>

              {/* Status and Action */}
              <div className="flex items-center justify-between md:justify-end gap-6 w-full md:w-auto border-t md:border-t-0 border-white/5 pt-3 md:pt-0">
                <div className="flex items-center gap-4">
                  <span className="font-serif text-xs text-neutral-500 hidden sm:inline italic">
                    From {show.ticketPrice}
                  </span>
                  {getStatusBadge(show.ticketStatus)}
                </div>

                <button
                  id={`tour-book-btn-${show.id}`}
                  onClick={() => handleBookTicket(show)}
                  disabled={show.ticketStatus === 'sold_out'}
                  className={`px-4 py-2 font-serif text-[11px] font-semibold rounded-lg transition-all flex items-center gap-1 cursor-pointer italic ${
                    show.ticketStatus === 'sold_out'
                      ? 'bg-neutral-900 text-neutral-600 border border-white/5 cursor-not-allowed'
                      : 'bg-[#c5a880] hover:bg-[#dfc49c] text-neutral-950 active:scale-95 shadow-md'
                  }`}
                >
                  <Ticket className="w-3.5 h-3.5" />
                  {show.ticketStatus === 'sold_out' ? 'sold out' : 'reserve pass'}
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Ticket Booking Simulator Modal */}
      {selectedShow && (
        <div id="booking-modal-overlay" className="fixed inset-0 bg-neutral-950/90 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div 
            id="booking-modal-content"
            className="rounded-2xl w-full max-w-md p-6 md:p-8 shadow-2xl relative overflow-hidden bg-neutral-950 border border-[#c5a880]/30"
          >
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#c5a880]/10 rounded-full blur-2xl" />

            {bookingSuccess ? (
              <div className="text-center py-6">
                <div className="w-14 h-14 bg-[#c5a880]/15 border border-[#c5a880]/30 text-[#c5a880] flex items-center justify-center rounded-full mx-auto mb-4 animate-bounce">
                  <CheckCircle className="w-7 h-7" />
                </div>
                <h4 className="font-serif text-xl font-bold text-white mb-2 lowercase italic">simulated booking success!</h4>
                <p className="font-serif text-xs text-neutral-400 max-w-sm mx-auto mb-6 lowercase italic">
                  pass holder details registered under **{attendeeEmail}**. present this digital pass confirmation on show day.
                </p>

                {/* Simulated Pass Graphic */}
                <div className="bg-neutral-900 border border-[#c5a880]/20 rounded-xl p-4 text-left font-serif relative overflow-hidden mb-6">
                  <div className="absolute right-4 top-4 border border-dashed border-[#c5a880]/30 text-[#c5a880]/40 text-[9px] uppercase tracking-widest font-bold px-2 py-1 rotate-12 rounded italic">
                    pass verified ♩
                  </div>
                  <p className="text-[10px] text-neutral-500 uppercase font-serif tracking-widest">OFFICIAL RECITAL PASS</p>
                  <p className="text-sm text-white font-bold mt-1 truncate lowercase">{selectedShow.venue}</p>
                  <p className="text-[11px] text-[#c5a880] mt-0.5 lowercase">{selectedShow.city}, {selectedShow.country}</p>
                  
                  <div className="border-t border-dashed border-[#c5a880]/10 my-3" />
                  
                  <div className="grid grid-cols-2 gap-2 text-[10px] text-neutral-400">
                    <div>
                      <span className="block text-neutral-600 font-serif lowercase italic">pass holder</span>
                      <span className="font-semibold text-neutral-200 truncate block lowercase">{attendeeName}</span>
                    </div>
                    <div>
                      <span className="block text-neutral-600 font-serif lowercase italic">quantity</span>
                      <span className="font-semibold text-neutral-200 lowercase">{ticketQuantity}x concert entry</span>
                    </div>
                  </div>
                </div>

                <button
                  id="close-booking-modal-btn"
                  onClick={() => setSelectedShow(null)}
                  className="px-5 py-2.5 bg-neutral-900 hover:bg-[#c5a880]/10 text-white rounded-lg border border-[#c5a880]/20 hover:border-[#c5a880]/40 transition-colors font-serif text-[11px] font-semibold tracking-widest uppercase cursor-pointer italic"
                >
                  Close Pass Details
                </button>
              </div>
            ) : (
              <form onSubmit={submitBooking} className="space-y-4">
                <div>
                  <h4 className="font-serif font-light tracking-widest uppercase text-base text-white lowercase">simulated concert seat request</h4>
                  <p className="font-serif text-xs text-neutral-400 mt-1 font-light lowercase italic">
                    request tickets for {selectedShow.venue} in {selectedShow.city}.
                  </p>
                </div>

                <div className="bg-neutral-900 rounded-xl p-3 border border-[#c5a880]/20 text-xs text-neutral-300 font-serif lowercase">
                  <p className="font-semibold text-white italic">Event Details:</p>
                  <p className="mt-1 text-neutral-400 italic">Location: {selectedShow.city}, {selectedShow.country}</p>
                  <p className="text-[#c5a880] mt-0.5 italic">Ticket Tier Price: {selectedShow.ticketPrice}</p>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[10px] font-serif text-[#c5a880] uppercase tracking-wider font-semibold italic">Your Full Name</label>
                  <input
                    id="booking-input-name"
                    type="text"
                    required
                    value={attendeeName}
                    onChange={(e) => setAttendeeName(e.target.value)}
                    placeholder="enter your full name"
                    className="w-full px-3 py-2 bg-neutral-900 border border-[#c5a880]/20 rounded-lg text-xs font-serif text-neutral-300 focus:outline-none focus:border-[#c5a880]/50 lowercase"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[10px] font-serif text-[#c5a880] uppercase tracking-wider font-semibold italic">Your Email</label>
                  <input
                    id="booking-input-email"
                    type="email"
                    required
                    value={attendeeEmail}
                    onChange={(e) => setAttendeeEmail(e.target.value)}
                    placeholder="yourname@example.com"
                    className="w-full px-3 py-2 bg-neutral-900 border border-[#c5a880]/20 rounded-lg text-xs font-serif text-neutral-300 focus:outline-none focus:border-[#c5a880]/50 lowercase"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[10px] font-serif text-[#c5a880] uppercase tracking-wider font-semibold italic">Ticket Quantity</label>
                  <select
                    id="booking-select-qty"
                    value={ticketQuantity}
                    onChange={(e) => setTicketQuantity(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-neutral-900 border border-[#c5a880]/20 rounded-lg text-xs font-serif text-neutral-300 focus:outline-none cursor-pointer lowercase"
                  >
                    {[1, 2, 4, 6].map((q) => (
                      <option key={q} value={q} className="bg-neutral-950 text-white">{q} Ticket{q > 1 ? 's' : ''}</option>
                    ))}
                  </select>
                </div>

                <div className="pt-4 flex items-center justify-end gap-3 border-t border-[#c5a880]/15">
                  <button
                    id="cancel-booking-btn"
                    type="button"
                    onClick={() => setSelectedShow(null)}
                    className="px-4 py-2 bg-transparent hover:bg-white/5 text-neutral-400 hover:text-white rounded-lg text-xs font-serif font-semibold transition-all cursor-pointer italic"
                  >
                    Cancel
                  </button>
                  <button
                    id="confirm-booking-btn"
                    type="submit"
                    disabled={isSubmitting}
                    className="px-5 py-2.5 bg-[#c5a880] hover:bg-[#dfc49c] text-black rounded-lg text-[11px] font-serif font-bold uppercase tracking-widest transition-all shadow-md active:scale-95 disabled:opacity-50 flex items-center gap-1 cursor-pointer italic"
                  >
                    {isSubmitting ? 'booking seat...' : 'confirm pass seat'}
                  </button>
                </div>
              </form>
            )}

          </div>
        </div>
      )}

    </div>
  );
}
