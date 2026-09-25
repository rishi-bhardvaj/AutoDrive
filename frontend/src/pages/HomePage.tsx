import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Car, ShieldCheck, Wrench, ArrowRight, Phone, MessageCircle, CheckCircle2, Clock } from 'lucide-react';
import { Vehicle } from '../types';
import { apiClient } from '../services/api';
import { CarCard } from '../components/cars/CarCard';
import { BUSINESS_NAME, BUSINESS_PHONE, getWhatsAppUrl } from '../config/business';

export const HomePage: React.FC = () => {
  const [featuredCars, setFeaturedCars] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient.getVehicles({ isFeatured: true })
      .then((res) => {
        if (res.success && res.data) {
          setFeaturedCars(res.data.slice(0, 4));
        }
      })
      .catch((err) => console.error('Failed to load featured cars:', err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-16 lg:space-y-24 pb-16">
      {/* Real Automotive Hero Section */}
      <section className="relative bg-slate-900 text-white overflow-hidden border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-28 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-6 text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-xs font-semibold text-amber-400">
                <ShieldCheck className="w-3.5 h-3.5" /> Trusted Local Car Rental & Workshop Hub • Noida / Delhi NCR
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight text-white">
                Reliable Cars. <br />
                <span className="text-slate-300">Simple Rentals & Services.</span>
              </h1>
              <p className="text-slate-300 text-base sm:text-lg leading-relaxed max-w-xl">
                Comfortable, sanitized and well-maintained self-drive and chauffeur cars for city commutes, business trips, weddings and outstation journeys. Direct offline coordination with genuine rates.
              </p>
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  to="/rent"
                  className="inline-flex items-center gap-2 px-6 py-3.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm rounded-lg shadow transition-colors"
                >
                  <Car className="w-4 h-4" />
                  <span>Browse Rental Cars</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <a
                  href={getWhatsAppUrl('Hi, I want to rent a car.')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-3.5 bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-slate-700 font-semibold text-sm rounded-lg transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Talk on WhatsApp</span>
                </a>
              </div>

              {/* Trust markers */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-800 text-xs text-slate-400">
                <div>
                  <strong className="block text-white text-sm font-bold">100% Inspected</strong>
                  <span>Every car workshop verified</span>
                </div>
                <div>
                  <strong className="block text-white text-sm font-bold">Transparent Fare</strong>
                  <span>Zero hidden surcharges</span>
                </div>
                <div>
                  <strong className="block text-white text-sm font-bold">24/7 Breakdown</strong>
                  <span>Roadside assistance support</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 relative">
              <div className="rounded-2xl overflow-hidden border border-slate-700 bg-slate-800 shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=1000&auto=format&fit=crop&q=80"
                  alt="Modern SUV Rental"
                  className="w-full h-80 sm:h-96 object-cover"
                />
                <div className="p-4 bg-slate-950/90 flex justify-between items-center text-xs">
                  <div>
                    <span className="text-slate-400 block">Popular Choice</span>
                    <span className="text-white font-bold text-sm">Hyundai Creta • Diesel AT</span>
                  </div>
                  <Link to="/rent" className="text-amber-400 hover:underline font-semibold">
                    Rent @ ₹2,800/day →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4 Core Business Pillars */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">Complete Automotive Solutions</h2>
          <p className="text-slate-600 text-sm mt-2">
            One trusted local destination in Noida for all your personal and commercial car requirements.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1 */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:border-slate-400 transition-colors flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-10 h-10 bg-slate-900 text-amber-400 rounded-lg flex items-center justify-center">
                <Car className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-lg">Car Rentals</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Hatchbacks, Sedans and 7-Seater SUVs for daily local use, Delhi NCR commutes, or Agra/Jaipur trips.
              </p>
            </div>
            <Link to="/rent" className="mt-5 text-xs font-bold text-slate-900 hover:text-amber-600 inline-flex items-center gap-1">
              Browse Fleet →
            </Link>
          </div>

          {/* Card 2 */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:border-slate-400 transition-colors flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-10 h-10 bg-slate-900 text-amber-400 rounded-lg flex items-center justify-center">
                <Wrench className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-lg">Car Workshop & Service</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Multi-brand periodic servicing, AC repair, brake overhaul, denting & painting with genuine parts.
              </p>
            </div>
            <Link to="/service" className="mt-5 text-xs font-bold text-slate-900 hover:text-amber-600 inline-flex items-center gap-1">
              Book Service →
            </Link>
          </div>

          {/* Card 3 */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:border-slate-400 transition-colors flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-10 h-10 bg-slate-900 text-amber-400 rounded-lg flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-lg">Certified Used Cars</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                120-point inspected second-hand cars with clean RC transfer assistance and guaranteed titles.
              </p>
            </div>
            <Link to="/buy-sell" className="mt-5 text-xs font-bold text-slate-900 hover:text-amber-600 inline-flex items-center gap-1">
              View Cars for Sale →
            </Link>
          </div>

          {/* Card 4 */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:border-slate-400 transition-colors flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-10 h-10 bg-slate-900 text-amber-400 rounded-lg flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-lg">Sell Your Car</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Get an honest doorstep evaluation and immediate payment for your used car in Noida/Delhi NCR.
              </p>
            </div>
            <Link to="/buy-sell" className="mt-5 text-xs font-bold text-slate-900 hover:text-amber-600 inline-flex items-center gap-1">
              Get Valuation →
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Fleet Preview */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">Featured Rental Fleet</h2>
            <p className="text-slate-600 text-sm mt-1">Available for self-drive and outstation travel from Noida</p>
          </div>
          <Link
            to="/rent"
            className="inline-flex items-center gap-1 text-sm font-bold text-slate-900 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 px-4 py-2 rounded-lg transition-colors"
          >
            <span>View All Cars</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="h-80 bg-slate-200 animate-pulse rounded-xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredCars.map((car) => (
              <CarCard key={car.id} vehicle={car} />
            ))}
          </div>
        )}
      </section>

      {/* Transparent Process Section */}
      <section className="bg-slate-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold">How Renting Works</h2>
            <p className="text-slate-400 text-sm mt-2">Simple, zero-hassle 3-step offline verification process</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="p-6 bg-slate-800/50 rounded-xl border border-slate-800 space-y-3">
              <div className="w-10 h-10 bg-amber-400 text-slate-950 rounded-full flex items-center justify-center font-bold mx-auto text-base">
                1
              </div>
              <h3 className="font-bold text-white text-base">Select Car & Dates</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Choose your preferred car and dates. Submit the simple enquiry form or chat directly with our desk.
              </p>
            </div>

            <div className="p-6 bg-slate-800/50 rounded-xl border border-slate-800 space-y-3">
              <div className="w-10 h-10 bg-amber-400 text-slate-950 rounded-full flex items-center justify-center font-bold mx-auto text-base">
                2
              </div>
              <h3 className="font-bold text-white text-base">Quick Document Check</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                We verify your original Aadhaar and Driving Licence over WhatsApp or at our Sector 63 workshop.
              </p>
            </div>

            <div className="p-6 bg-slate-800/50 rounded-xl border border-slate-800 space-y-3">
              <div className="w-10 h-10 bg-amber-400 text-slate-950 rounded-full flex items-center justify-center font-bold mx-auto text-base">
                3
              </div>
              <h3 className="font-bold text-white text-base">Handover & Drive</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Pick up the keys from our hub or opt for doorstep delivery in Noida/Delhi. Return clean and get your deposit back.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Fast Contact / Direct Call Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-amber-500 rounded-2xl p-8 sm:p-12 text-slate-950 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="text-2xl sm:text-3xl font-extrabold">Need a car urgently or customized quote?</h3>
            <p className="text-sm font-medium text-slate-900 max-w-xl">
              Call our manager directly or message us on WhatsApp for instant confirmation.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3 shrink-0">
            <a
              href={`tel:${BUSINESS_PHONE}`}
              className="px-5 py-3 bg-slate-950 hover:bg-slate-800 text-white font-bold text-sm rounded-lg flex items-center gap-2 shadow"
            >
              <Phone className="w-4 h-4 text-amber-400" />
              Call {BUSINESS_PHONE}
            </a>
            <a
              href={getWhatsAppUrl('Hi, I need immediate booking assistance.')}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-3 bg-white hover:bg-slate-100 text-emerald-800 font-bold text-sm rounded-lg flex items-center gap-2 border border-emerald-300 shadow"
            >
              <MessageCircle className="w-4 h-4 text-emerald-600" />
              WhatsApp Direct
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};