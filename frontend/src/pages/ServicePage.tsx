import React, { useState } from 'react';
import { ServiceType } from '../types';
import { apiClient } from '../services/api';
import { Wrench, ShieldCheck, CheckCircle2, Phone, Calendar, Car, MessageCircle, AlertCircle } from 'lucide-react';
import { BUSINESS_NAME, BUSINESS_PHONE, getWhatsAppUrl } from '../config/business';

export const ServicePage: React.FC = () => {
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [vehicleDetails, setVehicleDetails] = useState('');
  const [serviceType, setServiceType] = useState<ServiceType>(ServiceType.PERIODIC_MAINTENANCE);
  const [preferredDate, setPreferredDate] = useState('');
  const [pickupDropRequired, setPickupDropRequired] = useState(false);
  const [pickupAddress, setPickupAddress] = useState('');
  const [description, setDescription] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      setSubmitting(true);
      const res = await apiClient.createServiceRequest({
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        customerEmail: customerEmail.trim() || undefined,
        vehicleDetails: vehicleDetails.trim(),
        serviceType,
        preferredDate: preferredDate || undefined,
        pickupDropRequired,
        pickupAddress: pickupAddress.trim() || undefined,
        description: description.trim() || undefined,
      });
      if (res.success && res.data) {
        setResult(res.data);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to submit service request. Please check fields.');
    } finally {
      setSubmitting(false);
    }
  };

  const services = [
    { title: 'Periodic Maintenance', desc: 'Engine oil change, oil filter, air filter, spark plugs, 40-point checkup.' },
    { title: 'Brakes & Suspension', desc: 'Brake pads replacement, disc resurfacing, shock absorber overhaul.' },
    { title: 'AC Service & Gas Top-up', desc: 'AC cooling coil cleaning, compressor check, condenser washing, gas recharge.' },
    { title: 'Denting & Painting', desc: 'Accident repair, scratch removal, paint booth high-gloss finish.' },
    { title: 'Battery & Electricals', desc: 'Battery testing, alternator repair, wiring harness troubleshooting.' },
    { title: 'Clutch & Transmission', desc: 'Clutch plate replacement, flywheel machining, gear oil change.' },
  ];

  const todayStr = new Date().toISOString().split('T')[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-16">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Multi-Brand Car Service & Repair</h1>
        <p className="text-sm text-slate-600 mt-1">
          Professional workshop in Sector 63 Noida. Genuine spares, transparent job estimates, and optional doorstep pickup.
        </p>
      </div>

      {/* Services Catalog */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((s, i) => (
          <div key={i} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-2">
            <div className="w-8 h-8 bg-slate-900 text-amber-400 rounded-lg flex items-center justify-center">
              <Wrench className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm">{s.title}</h3>
            <p className="text-xs text-slate-600 leading-relaxed">{s.desc}</p>
          </div>
        ))}
      </section>

      {/* Booking Form and Workshop Assurance */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Left: Info */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-slate-900 text-white rounded-xl p-6 space-y-4">
            <h3 className="text-lg font-bold">Why Service With Us?</h3>
            <div className="space-y-3 text-xs text-slate-300">
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span><strong>Genuine OEM Spares:</strong> Bosch, Mobil, Maruti Genuine, Hyundai MOBIS.</span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span><strong>No Surprise Billing:</strong> Estimate approved over WhatsApp before work starts.</span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span><strong>Doorstep Pickup & Drop:</strong> Available across Noida and Indirapuram.</span>
              </div>
            </div>
            <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
              <span>Direct Workshop Helpline:</span>
              <a href={`tel:${BUSINESS_PHONE}`} className="text-amber-400 font-bold">{BUSINESS_PHONE}</a>
            </div>
          </div>
        </div>

        {/* Right: Request Appointment Form */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-sm">
          {result ? (
            <div className="text-center py-8 space-y-4">
              <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
              <div>
                <span className="text-xs font-bold text-emerald-800 uppercase">Service Request Submitted</span>
                <h3 className="text-xl font-bold text-slate-900 mt-1">
                  Job Reference: <span className="font-mono text-emerald-700">{result.requestReference}</span>
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
                Thank you, <strong>{result.customerName}</strong>. Our service manager will review your request for <strong>{result.vehicleDetails}</strong> and call you to confirm appointment slot.
              </p>
              <button
                onClick={() => setResult(null)}
                className="px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-lg"
              >
                Submit Another Request
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-base font-bold text-slate-900">Book Workshop Appointment</h3>
                <p className="text-xs text-slate-500">Fill in your car details. We will contact you with estimate.</p>
              </div>

              {error && (
                <div className="p-2.5 bg-red-50 text-red-700 border border-red-200 rounded text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Your Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ankit Sharma"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full p-2.5 text-xs border border-slate-300 rounded-lg focus:ring-1 focus:ring-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Mobile Number (WhatsApp) *</label>
                  <input
                    type="tel"
                    required
                    placeholder="10-digit mobile"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full p-2.5 text-xs border border-slate-300 rounded-lg focus:ring-1 focus:ring-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Vehicle Make & Model *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Hyundai i20 2019 Petrol"
                    value={vehicleDetails}
                    onChange={(e) => setVehicleDetails(e.target.value)}
                    className="w-full p-2.5 text-xs border border-slate-300 rounded-lg focus:ring-1 focus:ring-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Service Type *</label>
                  <select
                    value={serviceType}
                    onChange={(e) => setServiceType(e.target.value as ServiceType)}
                    className="w-full p-2.5 text-xs border border-slate-300 rounded-lg focus:ring-1 focus:ring-slate-900"
                  >
                    <option value={ServiceType.PERIODIC_MAINTENANCE}>Periodic Maintenance</option>
                    <option value={ServiceType.OIL_CHANGE}>Oil & Filter Change</option>
                    <option value={ServiceType.BRAKE_SERVICE}>Brakes & Suspension</option>
                    <option value={ServiceType.AC_SERVICE}>AC Service & Gas</option>
                    <option value={ServiceType.DENTING_PAINTING}>Denting & Painting</option>
                    <option value={ServiceType.GENERAL_REPAIR}>General Mechanical Repair</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Preferred Date</label>
                <input
                  type="date"
                  min={todayStr}
                  value={preferredDate}
                  onChange={(e) => setPreferredDate(e.target.value)}
                  className="w-full p-2.5 text-xs border border-slate-300 rounded-lg focus:ring-1 focus:ring-slate-900"
                />
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-800">
                  <input
                    type="checkbox"
                    checked={pickupDropRequired}
                    onChange={(e) => setPickupDropRequired(e.target.checked)}
                    className="rounded text-slate-900 focus:ring-slate-900"
                  />
                  <span>Need Doorstep Pickup & Drop (Noida / NCR)?</span>
                </label>
                {pickupDropRequired && (
                  <input
                    type="text"
                    placeholder="Enter complete pickup address..."
                    value={pickupAddress}
                    onChange={(e) => setPickupAddress(e.target.value)}
                    className="w-full p-2 text-xs border border-slate-300 rounded bg-white"
                  />
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Describe Symptoms or Specific Issues</label>
                <textarea
                  rows={3}
                  placeholder="e.g. Squeaking noise from front right brake, AC not cooling in traffic..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-2.5 text-xs border border-slate-300 rounded-lg focus:ring-1 focus:ring-slate-900"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-lg transition-colors"
              >
                {submitting ? 'Submitting Appointment...' : 'Submit Service Request'}
              </button>
            </form>
          )}
        </div>
      </section>
    </div>
  );
};