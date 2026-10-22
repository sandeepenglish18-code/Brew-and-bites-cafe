import React, { useState, useMemo } from 'react';
import { Calendar as CalendarIcon, Clock, Users, CheckCircle2, MessageCircle, Search, ShieldCheck } from 'lucide-react';
import { CafeSettings, TableReservation } from '../types';
import { CafeStore } from '../services/store';

interface ReservationSectionProps {
  settings: CafeSettings;
  language: 'en' | 'hi';
}

export const ReservationSection: React.FC<ReservationSectionProps> = ({ settings, language }) => {
  const [activeTab, setActiveTab] = useState<'book' | 'check'>('book');

  // Booking Form State
  const todayStr = new Date().toISOString().split('T')[0];
  const maxDateStr = new Date(Date.now() + 60 * 86400000).toISOString().split('T')[0];

  const [date, setDate] = useState(todayStr);
  const [time, setTime] = useState('');
  const [guests, setGuests] = useState(2);
  const [seatingPreference, setSeatingPreference] = useState('Indoor Cozy Lounge');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [note, setNote] = useState('');
  const [submittedReservation, setSubmittedReservation] = useState<TableReservation | null>(null);
  const [bookingError, setBookingError] = useState('');

  // Lookup state
  const [lookupCode, setLookupCode] = useState('');
  const [lookupResult, setLookupResult] = useState<TableReservation | null>(null);
  const [lookupError, setLookupError] = useState('');

  // Generate 15-minute time slots between slotStart and slotEnd
  const timeSlots = useMemo(() => {
    const [startH, startM] = (settings.slotStart || '10:00').split(':').map(Number);
    const [endH, endM] = (settings.slotEnd || '23:00').split(':').map(Number);
    const slots: string[] = [];

    const now = new Date();
    const currentMins = now.getHours() * 60 + now.getMinutes();
    const isToday = date === todayStr;

    for (let m = startH * 60 + (startM || 0); m <= endH * 60 + (endM || 0); m += 15) {
      if (isToday && m <= currentMins + 30) continue; // Must be at least 30 mins in advance
      const h = Math.floor(m / 60);
      const min = m % 60;
      const hh = String(h).padStart(2, '0');
      const mm = String(min).padStart(2, '0');
      const period = h < 12 ? 'AM' : 'PM';
      const displayH = h % 12 || 12;
      slots.push(`${hh}:${mm}`);
    }
    return slots;
  }, [settings.slotStart, settings.slotEnd, date, todayStr]);

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setBookingError('');

    const cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.length !== 10) {
      setBookingError('Please enter a valid 10-digit Indian mobile number.');
      return;
    }

    if (!time) {
      setBookingError('Please choose a reservation time slot.');
      return;
    }

    // Generate clean alphanumeric 4-char code
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let codeSeq = '';
    for (let i = 0; i < 4; i++) {
      codeSeq += chars[Math.floor(Math.random() * chars.length)];
    }
    const bookingCode = `BB-${codeSeq}`;

    const newRes: TableReservation = {
      id: 'res-' + Date.now(),
      code: bookingCode,
      name: name.trim(),
      phone: cleanPhone,
      date,
      time,
      guests,
      seatingPreference,
      note: note.trim() || undefined,
      status: 'Pending',
      createdAt: Date.now(),
    };

    CafeStore.createReservation(newRes);
    setSubmittedReservation(newRes);
  };

  const handleLookup = (e: React.FormEvent) => {
    e.preventDefault();
    setLookupError('');
    const clean = lookupCode.trim().toUpperCase();
    if (!clean) return;

    const all = CafeStore.getReservations();
    const found = all.find((r) => r.code.toUpperCase() === clean || r.phone.includes(clean));
    if (found) {
      setLookupResult(found);
    } else {
      setLookupError('No booking found with this code or phone number.');
      setLookupResult(null);
    }
  };

  const openWhatsAppBooking = (res: TableReservation) => {
    const cleanPhone = settings.phone.replace(/\D/g, '');
    const msg = `Table booking request\nCode: ${res.code}\nName: ${res.name}\nPhone: ${res.phone}\nDate: ${res.date}\nTime: ${res.time}\nGuests: ${res.guests}\nSeating: ${res.seatingPreference}\nNote: ${res.note || '-'}`;
    window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <section id="reservations" className="py-16 md:py-24 bg-[#FAF7F2] border-t border-[#241A15]/10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <p className="text-xs uppercase tracking-widest text-[#C07A3A] font-semibold mb-2">
            {language === 'en' ? 'Warm Hospitality' : 'आतिथ्य और सुकून'}
          </p>
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#241A15] tracking-tight">
            {language === 'en' ? 'Reserve Your Table' : 'टेबल बुक करें'}
          </h2>
          <p className="text-sm text-[#241A15]/70 mt-2">
            {language === 'en'
              ? 'Enjoy cozy corner booths, artisanal coffees, and great conversations. Reserve in advance to ensure instant seating.'
              : 'विशेष अवसरों, पारिवारिक डिनर या दोस्तों के साथ सुकून भरे पलों के लिए टेबल बुक करें।'}
          </p>

          {/* Mode Switcher Tabs */}
          <div className="flex justify-center mt-6">
            <div className="flex p-1 bg-[#241A15]/5 rounded-xl border border-[#241A15]/10">
              <button
                onClick={() => setActiveTab('book')}
                className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  activeTab === 'book'
                    ? 'bg-white text-[#241A15] shadow-xs'
                    : 'text-[#241A15]/70 hover:text-[#241A15]'
                }`}
              >
                {language === 'en' ? 'New Reservation' : 'नई बुकिंग'}
              </button>
              <button
                onClick={() => setActiveTab('check')}
                className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  activeTab === 'check'
                    ? 'bg-white text-[#241A15] shadow-xs'
                    : 'text-[#241A15]/70 hover:text-[#241A15]'
                }`}
              >
                {language === 'en' ? 'Check Booking Status' : 'बुकिंग स्थिति जांचें'}
              </button>
            </div>
          </div>
        </div>

        {/* Tab 1: Book Table */}
        {activeTab === 'book' && (
          <div className="bg-white rounded-2xl border border-[#241A15]/10 p-6 md:p-8 shadow-sm">
            {submittedReservation ? (
              <div className="text-center space-y-5 py-4">
                <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-inner">
                  <CheckCircle2 className="w-8 h-8" />
                </div>

                <div className="space-y-1">
                  <h3 className="text-xl font-serif font-bold text-[#241A15]">
                    Booking Request Sent!
                  </h3>
                  <p className="text-xs text-[#241A15]/70">
                    Your table request is registered. Status: <strong>Waiting for café confirmation</strong>.
                  </p>
                  <div className="pt-2">
                    <span className="font-mono text-xl font-bold bg-[#FAF7F2] text-[#241A15] px-5 py-2 rounded-xl border border-[#241A15]/15 inline-block tracking-wider">
                      {submittedReservation.code}
                    </span>
                  </div>
                </div>

                <div className="bg-[#FAF7F2] p-4 rounded-xl border border-[#241A15]/10 max-w-sm mx-auto text-xs text-left space-y-1 text-[#241A15]/80">
                  <p><strong>Guest:</strong> {submittedReservation.name}</p>
                  <p><strong>Date &amp; Time:</strong> {submittedReservation.date} at {submittedReservation.time}</p>
                  <p><strong>Party Size:</strong> {submittedReservation.guests} Guests ({submittedReservation.seatingPreference})</p>
                  <p><strong>Contact:</strong> {submittedReservation.phone}</p>
                </div>

                <p className="text-xs text-[#241A15]/60 max-w-md mx-auto">
                  You will receive a confirmation message on <strong>{submittedReservation.phone}</strong>. Your table is held for 15 minutes past the scheduled arrival time.
                </p>

                <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                  <button
                    onClick={() => openWhatsAppBooking(submittedReservation)}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 bg-[#25D366] hover:bg-[#20ba5a] text-white rounded-xl text-xs font-semibold shadow-xs transition-colors"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Open WhatsApp for Instant Confirmation</span>
                  </button>

                  <button
                    onClick={() => {
                      setSubmittedReservation(null);
                      setName('');
                      setPhone('');
                      setNote('');
                    }}
                    className="w-full sm:w-auto px-5 py-3 bg-white border border-[#241A15]/15 text-[#241A15] text-xs font-semibold rounded-xl hover:bg-[#241A15]/5"
                  >
                    Make Another Booking
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleBookingSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Date */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#241A15]/60 mb-1.5">
                      Reservation Date *
                    </label>
                    <div className="relative">
                      <input
                        type="date"
                        required
                        min={todayStr}
                        max={maxDateStr}
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="w-full px-3.5 py-2.5 text-xs bg-[#FAF7F2] rounded-xl border border-[#241A15]/15 focus:outline-none focus:border-[#C07A3A]"
                      />
                    </div>
                  </div>

                  {/* Time slot */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#241A15]/60 mb-1.5">
                      Available Time (15-min slots) *
                    </label>
                    <select
                      required
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs bg-[#FAF7F2] rounded-xl border border-[#241A15]/15 focus:outline-none focus:border-[#C07A3A]"
                    >
                      <option value="">Select Time Slot</option>
                      {timeSlots.map((slot) => {
                        const [hh, mm] = slot.split(':').map(Number);
                        const displayH = hh % 12 || 12;
                        const period = hh < 12 ? 'AM' : 'PM';
                        return (
                          <option key={slot} value={slot}>
                            {displayH}:{String(mm).padStart(2, '0')} {period}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Number of guests */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#241A15]/60 mb-1.5">
                      Number of Guests *
                    </label>
                    <div className="flex items-center gap-2">
                      <select
                        value={guests}
                        onChange={(e) => setGuests(Number(e.target.value))}
                        className="w-full px-3.5 py-2.5 text-xs bg-[#FAF7F2] rounded-xl border border-[#241A15]/15 focus:outline-none focus:border-[#C07A3A]"
                      >
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((num) => (
                          <option key={num} value={num}>
                            {num} {num === 1 ? 'Guest' : 'Guests'}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Seating Preference */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#241A15]/60 mb-1.5">
                      Seating Preference
                    </label>
                    <select
                      value={seatingPreference}
                      onChange={(e) => setSeatingPreference(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs bg-[#FAF7F2] rounded-xl border border-[#241A15]/15 focus:outline-none focus:border-[#C07A3A]"
                    >
                      <option value="Indoor Cozy Lounge">Indoor Cozy Lounge</option>
                      <option value="Window Street View">Window Street View</option>
                      <option value="Quiet Corner Booth">Quiet Corner Booth</option>
                      <option value="Outdoor Terrace">Outdoor Terrace</option>
                    </select>
                  </div>
                </div>

                {/* Customer Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#241A15]/60 mb-1.5">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Vikram Singh"
                      className="w-full px-3.5 py-2.5 text-xs bg-[#FAF7F2] rounded-xl border border-[#241A15]/15 focus:outline-none focus:border-[#C07A3A]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#241A15]/60 mb-1.5">
                      10-Digit Mobile Number *
                    </label>
                    <input
                      type="tel"
                      required
                      maxLength={10}
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="e.g. 9828011223"
                      className="w-full px-3.5 py-2.5 text-xs font-mono bg-[#FAF7F2] rounded-xl border border-[#241A15]/15 focus:outline-none focus:border-[#C07A3A]"
                    />
                  </div>
                </div>

                {/* Special Request */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#241A15]/60 mb-1.5">
                    Special Occasion or Request (Optional)
                  </label>
                  <textarea
                    rows={2}
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="e.g. Birthday celebration, anniversary cake, quiet corner for reading..."
                    className="w-full px-3.5 py-2.5 text-xs bg-[#FAF7F2] rounded-xl border border-[#241A15]/15 focus:outline-none focus:border-[#C07A3A]"
                  />
                </div>

                {bookingError && (
                  <p className="text-xs text-red-600 bg-red-50 p-2.5 rounded-xl font-medium">
                    {bookingError}
                  </p>
                )}

                <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <p className="text-[11px] text-[#241A15]/60">
                    ℹ️ You receive a booking code. The café confirms availability shortly.
                  </p>
                  <button
                    type="submit"
                    className="w-full sm:w-auto px-6 py-3 bg-[#C07A3A] hover:bg-[#A86427] text-white rounded-xl text-xs sm:text-sm font-semibold transition-all shadow-md active:scale-95"
                  >
                    Request Table Reservation
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* Tab 2: Check Booking Status */}
        {activeTab === 'check' && (
          <div className="bg-white rounded-2xl border border-[#241A15]/10 p-6 md:p-8 shadow-sm space-y-6">
            <form onSubmit={handleLookup} className="flex gap-2 max-w-md mx-auto">
              <input
                type="text"
                required
                value={lookupCode}
                onChange={(e) => setLookupCode(e.target.value)}
                placeholder="Enter Booking Code (e.g. BB-98K2) or Phone"
                className="flex-1 px-3.5 py-2 text-xs bg-[#FAF7F2] rounded-xl border border-[#241A15]/15 focus:outline-none focus:border-[#C07A3A] uppercase font-mono"
              />
              <button
                type="submit"
                className="px-5 py-2 bg-[#241A15] hover:bg-[#382820] text-[#FAF7F2] rounded-xl text-xs font-semibold"
              >
                Search
              </button>
            </form>

            {lookupError && (
              <p className="text-center text-xs text-red-600 bg-red-50 p-2.5 rounded-xl max-w-md mx-auto">
                {lookupError}
              </p>
            )}

            {lookupResult && (
              <div className="max-w-md mx-auto bg-[#FAF7F2] p-5 rounded-2xl border border-[#241A15]/10 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-base font-bold text-[#241A15]">
                    {lookupResult.code}
                  </span>
                  <span
                    className={`px-3 py-1 text-xs font-semibold rounded-lg ${
                      lookupResult.status === 'Confirmed'
                        ? 'bg-emerald-100 text-emerald-800'
                        : lookupResult.status === 'Declined'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {lookupResult.status}
                  </span>
                </div>

                <div className="text-xs space-y-1 text-[#241A15]/80">
                  <p><strong>Guest Name:</strong> {lookupResult.name}</p>
                  <p><strong>Date &amp; Time:</strong> {lookupResult.date} at {lookupResult.time}</p>
                  <p><strong>Party Size:</strong> {lookupResult.guests} Guests</p>
                  {lookupResult.tableNumber && (
                    <p className="text-emerald-800 font-semibold">
                      <strong>Assigned:</strong> {lookupResult.tableNumber}
                    </p>
                  )}
                  {lookupResult.adminNote && (
                    <p className="italic text-[#241A15]/70">Note: {lookupResult.adminNote}</p>
                  )}
                </div>

                {lookupResult.status === 'Confirmed' && (
                  <p className="text-[11px] text-emerald-800 bg-emerald-50 p-2 rounded-lg">
                    ✓ Your table is confirmed! Please show this code on arrival at Brew &amp; Bites.
                  </p>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};
