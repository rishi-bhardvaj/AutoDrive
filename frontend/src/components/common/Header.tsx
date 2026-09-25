import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Phone, MessageCircle, Menu, X, Car, Shield, Wrench, ArrowRight } from 'lucide-react';
import { BUSINESS_NAME, BUSINESS_PHONE, getWhatsAppUrl } from '../../config/business';

export const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: 'Rent a Car', path: '/rent' },
    { name: 'Buy & Sell', path: '/buy-sell' },
    { name: 'Car Service', path: '/service' },
    { name: 'Contact & Location', path: '/contact' },
  ];

  const isActive = (p: string) => location.pathname === p;

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-sm">
      {/* Top micro-bar for quick local contact */}
      <div className="bg-slate-900 text-slate-300 text-xs py-1.5 px-4 hidden md:block">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-6">
            <span>📍 Sector 63, Noida, Uttar Pradesh 201301</span>
            <span>⏰ Mon - Sun: 8:00 AM - 9:00 PM</span>
          </div>
          <div className="flex items-center gap-4">
            <a href={`tel:${BUSINESS_PHONE}`} className="hover:text-white flex items-center gap-1">
              <Phone className="w-3 h-3 text-amber-400" />
              <span>{BUSINESS_PHONE}</span>
            </a>
            <span className="text-slate-600">|</span>
            <Link to="/admin" className="text-slate-400 hover:text-white">Admin Login</Link>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-10 h-10 bg-slate-900 text-white rounded-lg flex items-center justify-center font-bold text-xl tracking-wider shadow-inner">
              <span className="text-amber-400">A</span>D
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-slate-900 block leading-tight">
                {BUSINESS_NAME}
              </span>
              <span className="text-[11px] font-medium text-slate-500 tracking-wider uppercase">
                Rentals • Sales • Workshop
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors ${
                  isActive(link.path)
                    ? 'text-slate-900 bg-slate-100 font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Desktop CTAs */}
          <div className="hidden lg:flex items-center gap-3">
            <a
              href={getWhatsAppUrl('Hi, I would like to enquire about your car services.')}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-sm font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-lg hover:bg-emerald-100 transition-colors"
            >
              <MessageCircle className="w-4 h-4 text-emerald-600" />
              <span>WhatsApp</span>
            </a>
            <Link
              to="/rent"
              className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-sm transition-colors"
            >
              <span>Book a Car</span>
              <ArrowRight className="w-4 h-4 text-amber-400" />
            </Link>
          </div>

          {/* Mobile hamburger button */}
          <div className="flex lg:hidden items-center gap-2">
            <a
              href={getWhatsAppUrl('Hi, I need assistance.')}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-emerald-700 hover:bg-emerald-50 rounded-lg"
              title="WhatsApp"
            >
              <MessageCircle className="w-5 h-5" />
            </a>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-700 hover:bg-slate-100 rounded-lg focus:outline-none"
              aria-label="Toggle Navigation"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-2 pb-6 space-y-2 shadow-lg">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-3 py-2.5 rounded-lg text-base font-medium ${
                isActive(link.path)
                  ? 'bg-slate-900 text-white font-bold'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              {link.name}
            </Link>
          ))}
          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
            <a
              href={`tel:${BUSINESS_PHONE}`}
              className="flex items-center justify-center gap-2 w-full py-2.5 bg-slate-100 text-slate-800 rounded-lg font-semibold text-sm"
            >
              <Phone className="w-4 h-4 text-amber-500" />
              Call {BUSINESS_PHONE}
            </a>
            <Link
              to="/rent"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 w-full py-2.5 bg-slate-900 text-white rounded-lg font-semibold text-sm"
            >
              <span>Explore Rental Fleet</span>
              <ArrowRight className="w-4 h-4 text-amber-400" />
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};