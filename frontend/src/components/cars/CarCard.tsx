import React from 'react';
import { Link } from 'react-router-dom';
import { Users, Fuel, Settings2, Shield, CheckCircle2, AlertCircle } from 'lucide-react';
import { Vehicle, VehicleStatus } from '../../types';
import { formatCurrency, getWhatsAppRentalUrl } from '../../config/business';

interface CarCardProps {
  vehicle: Vehicle;
}

export const CarCard: React.FC<CarCardProps> = ({ vehicle }) => {
  const isAvailable = vehicle.status === VehicleStatus.AVAILABLE;
  const isBooked = vehicle.status === VehicleStatus.BOOKED;

  const mainImage = vehicle.images && vehicle.images.length > 0
    ? vehicle.images[0]
    : 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800&auto=format&fit=crop&q=80';

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col">
      {/* Image container */}
      <div className="relative aspect-[16/10] bg-slate-100 overflow-hidden group">
        <img
          src={mainImage}
          alt={`${vehicle.brand} ${vehicle.model}`}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        {/* Status Badge */}
        <div className="absolute top-3 left-3 flex gap-2">
          {isAvailable && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-600 text-white shadow">
              <CheckCircle2 className="w-3 h-3" /> Available
            </span>
          )}
          {isBooked && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-600 text-white shadow">
              <AlertCircle className="w-3 h-3" /> Booked On Dates
            </span>
          )}
          {vehicle.isFeatured && (
            <span className="px-2 py-0.5 rounded text-xs font-bold bg-amber-400 text-slate-900 shadow">
              Featured
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-baseline justify-between gap-2">
            <h3 className="font-bold text-slate-900 text-base leading-tight">
              {vehicle.brand} {vehicle.model}
            </h3>
            <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
              {vehicle.year}
            </span>
          </div>

          {/* Quick Specs */}
          <div className="grid grid-cols-3 gap-2 my-4 py-2.5 border-y border-slate-100 text-xs text-slate-600">
            <div className="flex items-center gap-1.5">
              <Settings2 className="w-3.5 h-3.5 text-slate-400" />
              <span className="truncate">{vehicle.transmission}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Fuel className="w-3.5 h-3.5 text-slate-400" />
              <span className="truncate">{vehicle.fuelType}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-slate-400" />
              <span>{vehicle.seats} Seats</span>
            </div>
          </div>
        </div>

        {/* Pricing and Action */}
        <div className="pt-2 flex items-center justify-between gap-3">
          <div>
            <span className="text-xs text-slate-500 block">Daily Rental</span>
            <div className="text-lg font-bold text-slate-900">
              {formatCurrency(vehicle.dailyRentalPrice)}
              <span className="text-xs font-normal text-slate-500"> /day</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={getWhatsAppRentalUrl(vehicle.brand + ' ' + vehicle.model)}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg border border-emerald-200 transition-colors"
              title="Enquire on WhatsApp"
            >
              💬
            </a>
            <Link
              to={`/rent/${vehicle.slug || vehicle.id}`}
              className="px-3.5 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors"
            >
              View Details
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};