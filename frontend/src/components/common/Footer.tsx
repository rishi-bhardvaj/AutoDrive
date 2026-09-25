import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, MessageCircle, ShieldCheck, Clock } from 'lucide-react';
import {
  BUSINESS_NAME,
  BUSINESS_TAGLINE,
  BUSINESS_PHONE,
  BUSINESS_EMAIL,
  BUSINESS_ADDRESS,
  BUSINESS_HOURS,
  GOOGLE_MAPS_URL,
  getWhatsAppUrl,
} from '../../config/business';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-950 text-slate-400 text-sm border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Col 1: Brand info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-white text-slate-950 rounded flex items-center justify-center font-bold text-lg">
                <span className="text-amber-500">A</span>D
              </div>
              <span className="text-lg font-bold text-white tracking-tight">{BUSINESS_NAME}</span>
            </div>
            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
              {BUSINESS_TAGLINE}. We provide well-maintained self-drive and chauffeur rental cars, certified pre-owned car sales, and dedicated multi-brand workshop services in Noida and Delhi NCR.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href={getWhatsAppUrl('Hi, I need assistance.')}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-400 bg-emerald-950/50 border border-emerald-800 rounded hover:bg-emerald-900/60"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                WhatsApp Us
              </a>
              <a
                href={`tel:${BUSINESS_PHONE}`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-300 bg-slate-900 border border-slate-700 rounded hover:bg-slate-800"
              >
                <Phone className="w-3.5 h-3.5 text-amber-400" />
                Call Desk
              </a>
            </div>
          </div>

          {/* Col 2: Services */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">Our Services</h4>
            <ul className="space-y-2.5">
              <li><Link to="/rent" className="hover:text-white transition-colors">Daily & Weekly Car Rental</Link></li>
              <li><Link to="/rent" className="hover:text-white transition-colors">Outstation & Highway Travel</Link></li>
              <li><Link to="/buy-sell" className="hover:text-white transition-colors">Buy Certified Used Cars</Link></li>
              <li><Link to="/buy-sell" className="hover:text-white transition-colors">Sell Your Used Car (Instant Valuation)</Link></li>
              <li><Link to="/service" className="hover:text-white transition-colors">Periodic Workshop Maintenance</Link></li>
              <li><Link to="/service" className="hover:text-white transition-colors">Accident Repair & Painting</Link></li>
            </ul>
          </div>

          {/* Col 3: Key Terms & Rental Info */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">Rental Policies</h4>
            <ul className="space-y-2 text-xs leading-relaxed">
              <li className="flex items-start gap-1.5">
                <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>Original Aadhaar Card and valid Indian Driving Licence required upon vehicle handover.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>Refundable security deposit is collected before trip and returned post inspection.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <Clock className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>Standard 24-hour billing cycle. Extra hours charged at standard hourly rates.</span>
              </li>
            </ul>
          </div>

          {/* Col 4: Contact & Workshop Location */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">Visit Our Hub</h4>
            <div className="space-y-3 text-xs sm:text-sm">
              <p className="flex items-start gap-2 text-slate-300">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>{BUSINESS_ADDRESS}</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                <a href={`tel:${BUSINESS_PHONE}`} className="hover:text-white">{BUSINESS_PHONE}</a>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                <a href={`mailto:${BUSINESS_EMAIL}`} className="hover:text-white">{BUSINESS_EMAIL}</a>
              </p>
              <p className="flex items-center gap-2 text-xs text-slate-400">
                <Clock className="w-4 h-4 text-slate-400 shrink-0" />
                <span>{BUSINESS_HOURS}</span>
              </p>
              <div className="pt-1">
                <a
                  href={GOOGLE_MAPS_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-amber-400 hover:text-amber-300 underline font-medium"
                >
                  View on Google Maps →
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-slate-900 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} {BUSINESS_NAME}. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link to="/contact" className="hover:text-slate-400">Privacy & Terms</Link>
            <span>•</span>
            <Link to="/contact" className="hover:text-slate-400">Location Map</Link>
            <span>•</span>
            <Link to="/admin/login" className="text-slate-600 hover:text-slate-400 font-mono">Staff Portal</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};