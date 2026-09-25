import React from 'react';
import {
  BUSINESS_NAME,
  BUSINESS_PHONE,
  BUSINESS_EMAIL,
  BUSINESS_ADDRESS,
  BUSINESS_HOURS,
  GOOGLE_MAPS_URL,
  getWhatsAppUrl,
} from '../config/business';
import { MapPin, Phone, Mail, Clock, MessageCircle, Navigation } from 'lucide-react';

export const ContactPage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Contact & Workshop Location</h1>
        <p className="text-sm text-slate-600 mt-1">
          Visit our rental desk and multi-brand workshop in Sector 63 Noida or connect with us directly.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* Contact Info Cards */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-bold text-base text-slate-900">Business Details</h3>
            <div className="space-y-3 text-xs sm:text-sm text-slate-700">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-slate-900">Main Office & Fleet Hub:</strong>
                  <span>{BUSINESS_ADDRESS}</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-slate-500 shrink-0" />
                <div>
                  <strong className="block text-slate-900">Phone:</strong>
                  <a href={`tel:${BUSINESS_PHONE}`} className="hover:underline">{BUSINESS_PHONE}</a>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-slate-500 shrink-0" />
                <div>
                  <strong className="block text-slate-900">Email:</strong>
                  <a href={`mailto:${BUSINESS_EMAIL}`} className="hover:underline">{BUSINESS_EMAIL}</a>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-slate-500 shrink-0" />
                <div>
                  <strong className="block text-slate-900">Working Hours:</strong>
                  <span>{BUSINESS_HOURS}</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row gap-3">
              <a
                href={getWhatsAppUrl('Hi, I need assistance.')}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-sm"
              >
                <MessageCircle className="w-4 h-4" /> WhatsApp Us
              </a>
              <a
                href={GOOGLE_MAPS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold shadow-sm"
              >
                <Navigation className="w-4 h-4 text-amber-400" /> Get Directions
              </a>
            </div>
          </div>
        </div>

        {/* Map Box */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm flex flex-col h-96">
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center text-xs">
            <span className="font-bold text-slate-800">Workshop Location Map</span>
            <span className="text-slate-500">Sector 63, Noida</span>
          </div>
          <iframe
            title="Google Maps Location"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14008.38475253818!2d77.3734002!3d28.6276856!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390cfb32a764d291%3A0x6b8bc277dc6efef3!2sSector%2063%2C%20Noida%2C%20Uttar%20Pradesh!5e0!3m2!1sen!2sin!4v1700000000000"
            className="w-full flex-1 border-0"
            loading="lazy"
          />
        </div>
      </div>
    </div>
  );
};