import React, { useState, useId } from 'react';
import { Vehicle } from '../../types';
import { apiClient } from '../../services/api';
import { formatCurrency, formatIndianDate, getWhatsAppRentalUrl } from '../../config/business';
import { Calendar, User, Phone, Mail, MapPin, CheckCircle2, AlertCircle, MessageCircle } from 'lucide-react';

interface BookingFormProps {
  vehicle: Vehicle;
}

export const BookingForm: React.FC<BookingFormProps> = ({ vehicle }) => {
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [pickupDate, setPickupDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [pickupLocation, setPickupLocation] = useState('Hub Pickup - Sector 63 Noida');
  const [notes, setNotes] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submittedBooking, setSubmittedBooking] = useState<any | null>(null);

  const calculateDays = () => {
    if (!pickupDate || !returnDate) return 1;
    const start = new Date(pickupDate);
    const end = new Date(returnDate);
    const diff = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 1;
  };

  const totalDays = calculateDays();
  const estimatedAmount = totalDays * vehicle.dailyRentalPrice;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!customerName || !customerPhone || !pickupDate || !returnDate) {
      setError('Please fill in all mandatory fields.');
      return;
    }

    if (new Date(returnDate) <= new Date(pickupDate)) {
      setError('Return date must be after pickup date.');
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await apiClient.createBooking({
        vehicleId: vehicle.id,
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        customerEmail: customerEmail.trim() || undefined,
        pickupDate,
        returnDate,
        pickupLocation,
        totalDays,
        estimatedAmount,
        securityDeposit: vehicle.securityDeposit,
        notes: notes.trim() || undefined,
      });

      if (res.success && res.data) {
        setSubmittedBooking(res.data);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to submit booking request. Please check details or contact us directly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submittedBooking) {
    return (
      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6 text-center space-y-4">
        <div className="w-12 h-12 bg-emerald-600 text-white rounded-full flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-6 h-6" />
        </div>
        <div>
          <span className="text-xs font-semibold text-emerald-800 uppercase tracking-wider">Request Received</span>
          <h3 className="text-xl font-bold text-slate-900 mt-1">
            Booking Reference: <span className="font-mono text-emerald-700">{submittedBooking.bookingReference}</span>
          </h3>
        </div>
        <p className="text-sm text-slate-700 max-w-md mx-auto leading-relaxed">
          Thank you, <strong>{submittedBooking.customerName}</strong>. Your request to rent <strong>{vehicle.brand} {vehicle.model}</strong> from <strong>{formatIndianDate(pickupDate)}</strong> to <strong>{formatIndianDate(returnDate)}</strong> ({totalDays} days) has been sent to our desk.
        </p>
        <div className="p-4 bg-white rounded-lg border border-emerald-200 text-xs text-slate-600 text-left space-y-1 max-w-md mx-auto">
          <p>• We will verify availability and call you within 15–30 minutes.</p>
          <p>• Estimated Rental: <strong>{formatCurrency(submittedBooking.estimatedAmount)}</strong></p>
          <p>• Refundable Deposit: <strong>{formatCurrency(submittedBooking.securityDeposit)}</strong></p>
        </div>
        <div className="pt-2 flex flex-col sm:flex-row justify-center gap-3">
          <a
            href={getWhatsAppRentalUrl(vehicle.brand + ' ' + vehicle.model, pickupDate, returnDate)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm rounded-lg shadow-sm"
          >
            <MessageCircle className="w-4 h-4" /> Connect with Desk on WhatsApp
          </a>
        </div>
      </div>
    );
  }

  const todayStr = new Date().toISOString().split('T')[0];

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-5">
      <div className="border-b border-slate-100 pb-3">
        <h3 className="text-lg font-bold text-slate-900">Request Rental Booking</h3>
        <p className="text-xs text-slate-500">No advance payment required online. We confirm and verify offline.</p>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* Date selectors */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Pickup Date *</label>
          <div className="relative">
            <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="date"
              min={todayStr}
              value={pickupDate}
              onChange={(e) => setPickupDate(e.target.value)}
              required
              className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Return Date *</label>
          <div className="relative">
            <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="date"
              min={pickupDate || todayStr}
              value={returnDate}
              onChange={(e) => setReturnDate(e.target.value)}
              required
              className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Contact details */}
      <div className="space-y-3">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name *</label>
          <div className="relative">
            <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="e.g. Rajesh Kumar"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              required
              className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Mobile Number (WhatsApp) *</label>
            <div className="relative">
              <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="tel"
                placeholder="10-digit mobile number"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                required
                className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address (Optional)</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="email"
                placeholder="rajesh@example.com"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:outline-none"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Pickup / Delivery Location</label>
          <select
            value={pickupLocation}
            onChange={(e) => setPickupLocation(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:outline-none"
          >
            <option value="Hub Pickup - Sector 63 Noida">Hub Self-Pickup (Sector 63, Noida)</option>
            <option value="Home Delivery - Noida / Greater Noida">Doorstep Delivery - Noida / Greater Noida (+₹300)</option>
            <option value="Doorstep Delivery - Delhi NCR">Doorstep Delivery - Delhi / Gurgaon (+₹500)</option>
            <option value="IGI Airport T3 Terminal">IGI Airport Terminal 3 Delivery (+₹800)</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Special Instructions / Remarks</label>
          <textarea
            rows={2}
            placeholder="e.g. Need baby seat, outstation trip to Jaipur, need early morning pickup..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full p-2.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:outline-none"
          />
        </div>
      </div>

      {/* Fare Estimate Breakdown */}
      <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 text-xs space-y-2">
        <div className="flex justify-between text-slate-600">
          <span>Daily Rate ({vehicle.brand} {vehicle.model})</span>
          <span>{formatCurrency(vehicle.dailyRentalPrice)} /day</span>
        </div>
        <div className="flex justify-between text-slate-600">
          <span>Duration</span>
          <span>{totalDays} Day{totalDays > 1 ? 's' : ''}</span>
        </div>
        <div className="flex justify-between text-slate-600">
          <span>Refundable Security Deposit</span>
          <span>{formatCurrency(vehicle.securityDeposit)}</span>
        </div>
        <div className="pt-2 border-t border-slate-200 flex justify-between font-bold text-sm text-slate-900">
          <span>Estimated Rental Amount</span>
          <span>{formatCurrency(estimatedAmount)}</span>
        </div>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-3 px-4 bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm rounded-lg shadow transition-colors disabled:bg-slate-400"
      >
        {isSubmitting ? 'Submitting Request...' : 'Submit Booking Request'}
      </button>
    </form>
  );
};