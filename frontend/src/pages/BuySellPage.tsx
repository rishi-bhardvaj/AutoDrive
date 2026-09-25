import React, { useEffect, useState } from 'react';
import { SaleVehicle, FuelType, Transmission } from '../types';
import { apiClient } from '../services/api';
import { formatCurrency, formatIndianKm, getWhatsAppBuyCarUrl, getWhatsAppSellCarUrl } from '../config/business';
import { ShieldCheck, Fuel, Settings2, MapPin, CheckCircle2, MessageCircle, AlertCircle } from 'lucide-react';

export const BuySellPage: React.FC = () => {
  const [saleCars, setSaleCars] = useState<SaleVehicle[]>([]);
  const [loading, setLoading] = useState(true);

  // Sell form state
  const [sellName, setSellName] = useState('');
  const [sellPhone, setSellPhone] = useState('');
  const [sellEmail, setSellEmail] = useState('');
  const [sellMakeModel, setSellMakeModel] = useState('');
  const [sellYear, setSellYear] = useState('2020');
  const [sellState, setSellState] = useState('UP-16 (Noida)');
  const [sellFuel, setSellFuel] = useState<FuelType>(FuelType.PETROL);
  const [sellKm, setSellKm] = useState('45000');
  const [sellPrice, setSellPrice] = useState('');
  const [sellDesc, setSellDesc] = useState('');
  const [sellSubmitting, setSellSubmitting] = useState(false);
  const [sellResult, setSellResult] = useState<any | null>(null);
  const [sellError, setSellError] = useState<string | null>(null);

  useEffect(() => {
    apiClient.getSaleVehicles()
      .then((res) => {
        if (res.success && res.data) setSaleCars(res.data);
      })
      .catch((e) => console.error('Failed to load sale cars:', e))
      .finally(() => setLoading(false));
  }, []);

  const handleSellSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSellError(null);
    try {
      setSellSubmitting(true);
      const res = await apiClient.createSellEnquiry({
        customerName: sellName.trim(),
        customerPhone: sellPhone.trim(),
        customerEmail: sellEmail.trim() || undefined,
        carMakeModel: sellMakeModel.trim(),
        registrationYear: parseInt(sellYear, 10),
        registrationState: sellState.trim() || undefined,
        kilometres: parseInt(sellKm, 10),
        fuelType: sellFuel,
        expectedPrice: parseFloat(sellPrice),
        description: sellDesc.trim() || undefined,
      });
      if (res.success && res.data) {
        setSellResult(res.data);
      }
    } catch (err: any) {
      setSellError(err.message || 'Failed to submit valuation request. Please check fields.');
    } finally {
      setSellSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-16">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Buy & Sell Used Cars</h1>
        <p className="text-sm text-slate-600 mt-1">
          Certified pre-owned cars with verified history, and instant doorstep evaluation for selling your existing car.
        </p>
      </div>

      {/* Section 1: Certified Cars for Sale */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Certified Pre-Owned Cars For Sale</h2>
            <p className="text-xs text-slate-500">Each vehicle tested across 120 inspection parameters</p>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-80 bg-slate-200 animate-pulse rounded-xl" />
            ))}
          </div>
        ) : saleCars.length === 0 ? (
          <div className="bg-white p-8 rounded-xl border border-slate-200 text-center text-slate-500 text-sm">
            No cars currently listed for sale. Please check back shortly or enquire with our sales desk.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {saleCars.map((car) => (
              <div key={car.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm flex flex-col justify-between">
                <div>
                  <div className="aspect-[16/10] bg-slate-100 overflow-hidden relative">
                    <img src={car.images[0]} alt={`${car.brand} ${car.model}`} className="w-full h-full object-cover" />
                    <div className="absolute top-3 left-3 bg-slate-950/80 text-white text-[11px] font-bold px-2 py-0.5 rounded">
                      {car.ownership}st Owner
                    </div>
                  </div>

                  <div className="p-5 space-y-3">
                    <div className="flex justify-between items-baseline">
                      <h3 className="font-bold text-slate-900 text-base">{car.brand} {car.model}</h3>
                      <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">{car.year}</span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 py-2 border-y border-slate-100 text-xs text-slate-600">
                      <div className="flex items-center gap-1"><Settings2 className="w-3.5 h-3.5" /><span>{car.transmission}</span></div>
                      <div className="flex items-center gap-1"><Fuel className="w-3.5 h-3.5" /><span>{car.fuelType}</span></div>
                      <div className="flex items-center gap-1"><span>{formatIndianKm(car.kilometres)}</span></div>
                    </div>

                    <p className="text-xs text-slate-600 line-clamp-2">{car.description}</p>
                  </div>
                </div>

                <div className="p-5 pt-0 border-t border-slate-100 mt-2 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] text-slate-500 block">Asking Price</span>
                    <span className="text-lg font-bold text-slate-900">{formatCurrency(car.price)}</span>
                  </div>
                  <a
                    href={getWhatsAppBuyCarUrl(car.brand + ' ' + car.model, car.price)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-lg hover:bg-emerald-100"
                  >
                    <MessageCircle className="w-4 h-4 text-emerald-600" />
                    <span>Enquire</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Section 2: Sell Your Car Form */}
      <section className="bg-slate-900 text-white rounded-2xl p-6 sm:p-10 lg:p-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          <div className="lg:col-span-5 space-y-4">
            <span className="px-3 py-1 bg-amber-400 text-slate-950 font-bold text-xs rounded-full inline-block">
              Instant Valuation
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold">Sell Your Car in Noida / NCR</h2>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              Get an honest market price for your used car with zero listing fees, free doorstep evaluation, and immediate bank transfer.
            </p>
            <div className="space-y-2 pt-4 text-xs text-slate-300">
              <p className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-amber-400" /> Same day inspection and instant quote</p>
              <p className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-amber-400" /> Hassle-free RC transfer assistance</p>
              <p className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-amber-400" /> Transparent pricing based on true condition</p>
            </div>
          </div>

          <div className="lg:col-span-7 bg-white text-slate-900 rounded-xl p-6 shadow-xl">
            {sellResult ? (
              <div className="text-center py-6 space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                <h3 className="font-bold text-lg">Enquiry Received! Ref: <span className="font-mono text-emerald-700">{sellResult.enquiryReference}</span></h3>
                <p className="text-xs text-slate-600 max-w-sm mx-auto">
                  Thank you, <strong>{sellResult.customerName}</strong>. Our valuation evaluator will review your <strong>{sellResult.carMakeModel}</strong> details and call you shortly.
                </p>
                <button
                  onClick={() => setSellResult(null)}
                  className="mt-4 px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-lg"
                >
                  Submit Another Enquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSellSubmit} className="space-y-4">
                <h3 className="font-bold text-base text-slate-900 border-b border-slate-100 pb-2">Submit Car Details</h3>
                {sellError && (
                  <div className="p-2.5 bg-red-50 text-red-700 border border-red-200 rounded text-xs">
                    {sellError}
                  </div>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Your Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Vikas Gupta"
                      value={sellName}
                      onChange={(e) => setSellName(e.target.value)}
                      className="w-full p-2 text-xs border border-slate-300 rounded focus:ring-1 focus:ring-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Mobile Number (WhatsApp) *</label>
                    <input
                      type="tel"
                      required
                      placeholder="10-digit mobile"
                      value={sellPhone}
                      onChange={(e) => setSellPhone(e.target.value)}
                      className="w-full p-2 text-xs border border-slate-300 rounded focus:ring-1 focus:ring-slate-900"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Car Make & Model *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Honda City VX / Maruti Swift VXI"
                      value={sellMakeModel}
                      onChange={(e) => setSellMakeModel(e.target.value)}
                      className="w-full p-2 text-xs border border-slate-300 rounded focus:ring-1 focus:ring-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Registration Year *</label>
                    <input
                      type="number"
                      required
                      min={2000}
                      max={2030}
                      value={sellYear}
                      onChange={(e) => setSellYear(e.target.value)}
                      className="w-full p-2 text-xs border border-slate-300 rounded focus:ring-1 focus:ring-slate-900"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Kilometres Driven *</label>
                    <input
                      type="number"
                      required
                      value={sellKm}
                      onChange={(e) => setSellKm(e.target.value)}
                      className="w-full p-2 text-xs border border-slate-300 rounded focus:ring-1 focus:ring-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Fuel Type *</label>
                    <select
                      value={sellFuel}
                      onChange={(e) => setSellFuel(e.target.value as FuelType)}
                      className="w-full p-2 text-xs border border-slate-300 rounded focus:ring-1 focus:ring-slate-900"
                    >
                      <option value={FuelType.PETROL}>Petrol</option>
                      <option value={FuelType.DIESEL}>Diesel</option>
                      <option value={FuelType.CNG}>CNG</option>
                      <option value={FuelType.ELECTRIC}>Electric</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Expected Price (₹) *</label>
                    <input
                      type="number"
                      required
                      placeholder="e.g. 550000"
                      value={sellPrice}
                      onChange={(e) => setSellPrice(e.target.value)}
                      className="w-full p-2 text-xs border border-slate-300 rounded focus:ring-1 focus:ring-slate-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Condition Remarks & Service History</label>
                  <textarea
                    rows={2}
                    placeholder="e.g. First owner, Noida registered, valid comprehensive insurance..."
                    value={sellDesc}
                    onChange={(e) => setSellDesc(e.target.value)}
                    className="w-full p-2 text-xs border border-slate-300 rounded focus:ring-1 focus:ring-slate-900"
                  />
                </div>

                <button
                  type="submit"
                  disabled={sellSubmitting}
                  className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded transition-colors"
                >
                  {sellSubmitting ? 'Submitting...' : 'Request Valuation & Inspection'}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};