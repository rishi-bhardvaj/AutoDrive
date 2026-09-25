import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Vehicle, VehicleStatus } from '../types';
import { apiClient } from '../services/api';
import { BookingForm } from '../components/cars/BookingForm';
import { formatCurrency, getWhatsAppRentalUrl } from '../config/business';
import {
  Users,
  Fuel,
  Settings2,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Phone,
  ArrowLeft,
  AlertCircle,
  MessageCircle,
} from 'lucide-react';

export const CarDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    apiClient.getVehicleByIdentifier(id)
      .then((res) => {
        if (res.success && res.data) {
          setVehicle(res.data);
          setSelectedImage(res.data.images[0] || '');
        } else {
          setError('Vehicle not found.');
        }
      })
      .catch(() => setError('Failed to load vehicle details.'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <div className="w-10 h-10 border-4 border-slate-900 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="mt-4 text-xs text-slate-500">Loading car details...</p>
      </div>
    );
  }

  if (error || !vehicle) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto" />
        <h2 className="text-xl font-bold text-slate-900">{error || 'Car not found'}</h2>
        <Link to="/rent" className="inline-flex items-center gap-1 text-sm font-bold text-slate-900 underline">
          <ArrowLeft className="w-4 h-4" /> Back to Fleet
        </Link>
      </div>
    );
  }

  const isAvailable = vehicle.status === VehicleStatus.AVAILABLE;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Breadcrumb */}
      <div className="mb-6">
        <Link to="/rent" className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to all rental cars
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* Left Column: Gallery & Specifications */}
        <div className="lg:col-span-7 space-y-6">
          {/* Main Hero Photo */}
          <div className="aspect-[16/10] bg-slate-100 rounded-2xl overflow-hidden border border-slate-200">
            <img
              src={selectedImage || vehicle.images[0]}
              alt={`${vehicle.brand} ${vehicle.model}`}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Thumbnails */}
          {vehicle.images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {vehicle.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(img)}
                  className={`w-20 h-14 rounded-lg overflow-hidden border-2 shrink-0 transition-all ${
                    selectedImage === img ? 'border-slate-900 scale-105' : 'border-slate-200 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Title and Specs Badge */}
          <div className="border-b border-slate-200 pb-6 space-y-2">
            <div className="flex items-center justify-between gap-4">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                {vehicle.brand} {vehicle.model}
              </h1>
              <span className="text-sm font-bold bg-slate-100 text-slate-800 px-3 py-1 rounded-md">
                {vehicle.year}
              </span>
            </div>
            <p className="text-xs text-slate-500">Self-drive & Chauffeur Available • Fastag Equipped • Sanitized</p>
          </div>

          {/* Key Specifications Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-white p-4 rounded-xl border border-slate-200 text-xs text-slate-700">
            <div className="space-y-1">
              <span className="text-slate-400 block font-medium">Transmission</span>
              <div className="font-bold flex items-center gap-1.5">
                <Settings2 className="w-4 h-4 text-slate-500" />
                <span>{vehicle.transmission}</span>
              </div>
            </div>
            <div className="space-y-1">
              <span className="text-slate-400 block font-medium">Fuel Type</span>
              <div className="font-bold flex items-center gap-1.5">
                <Fuel className="w-4 h-4 text-slate-500" />
                <span>{vehicle.fuelType}</span>
              </div>
            </div>
            <div className="space-y-1">
              <span className="text-slate-400 block font-medium">Seating Capacity</span>
              <div className="font-bold flex items-center gap-1.5">
                <Users className="w-4 h-4 text-slate-500" />
                <span>{vehicle.seats} Passengers</span>
              </div>
            </div>
            <div className="space-y-1">
              <span className="text-slate-400 block font-medium">Availability</span>
              <div className="font-bold flex items-center gap-1.5">
                {isAvailable ? (
                  <span className="text-emerald-700 flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" /> Available
                  </span>
                ) : (
                  <span className="text-amber-700">Check Dates</span>
                )}
              </div>
            </div>
          </div>

          {/* Description */}
          {vehicle.description && (
            <div className="space-y-2">
              <h3 className="font-bold text-slate-900 text-sm">Vehicle Description</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                {vehicle.description}
              </p>
            </div>
          )}

          {/* Included Features */}
          {vehicle.features && vehicle.features.length > 0 && (
            <div className="space-y-2">
              <h3 className="font-bold text-slate-900 text-sm">Features & Equipment</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs text-slate-700">
                {vehicle.features.map((f, i) => (
                  <div key={i} className="flex items-center gap-2 p-2 bg-slate-100 rounded-lg">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>{f}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Rental Terms */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 space-y-2">
            <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">Rental Terms & Requirements</h4>
            <ul className="list-disc pl-4 space-y-1">
              <li>Original Indian Driving Licence and Aadhaar card verification during handover.</li>
              <li>Refundable security deposit of {formatCurrency(vehicle.securityDeposit)} returned post trip.</li>
              <li>Fuel policy: Same-to-same (return with the same fuel level as provided).</li>
              <li>Free cancellation up to 6 hours before scheduled pickup.</li>
            </ul>
          </div>
        </div>

        {/* Right Column: Pricing & Booking Form */}
        <div className="lg:col-span-5 space-y-6">
          <BookingForm vehicle={vehicle} />
        </div>
      </div>
    </div>
  );
};