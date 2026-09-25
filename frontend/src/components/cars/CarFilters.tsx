import React from 'react';
import { FuelType, Transmission } from '../../types';
import { Search, RotateCcw } from 'lucide-react';

interface CarFiltersProps {
  search: string;
  setSearch: (v: string) => void;
  fuel: string;
  setFuel: (v: string) => void;
  transmission: string;
  setTransmission: (v: string) => void;
  seats: string;
  setSeats: (v: string) => void;
  onReset: () => void;
}

export const CarFilters: React.FC<CarFiltersProps> = ({
  search,
  setSearch,
  fuel,
  setFuel,
  transmission,
  setTransmission,
  seats,
  setSeats,
  onReset,
}) => {
  return (
    <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-sm mb-6 space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {/* Search */}
        <div className="relative sm:col-span-2 lg:col-span-2">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search by brand or model (e.g. Creta, Swift, Ertiga)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent"
          />
        </div>

        {/* Fuel filter */}
        <div>
          <select
            value={fuel}
            onChange={(e) => setFuel(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
          >
            <option value="">All Fuel Types</option>
            <option value={FuelType.PETROL}>Petrol</option>
            <option value={FuelType.DIESEL}>Diesel</option>
            <option value={FuelType.CNG}>CNG</option>
            <option value={FuelType.ELECTRIC}>Electric</option>
          </select>
        </div>

        {/* Transmission filter */}
        <div>
          <select
            value={transmission}
            onChange={(e) => setTransmission(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
          >
            <option value="">All Transmissions</option>
            <option value={Transmission.MANUAL}>Manual</option>
            <option value={Transmission.AUTOMATIC}>Automatic</option>
          </select>
        </div>

        {/* Seats filter */}
        <div>
          <select
            value={seats}
            onChange={(e) => setSeats(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
          >
            <option value="">All Seating</option>
            <option value="5">5 Seats (Hatchback/Sedan/SUV)</option>
            <option value="7">7 Seats (MPV/MUV)</option>
            <option value="8">8+ Seats</option>
          </select>
        </div>
      </div>

      {/* Reset link */}
      {(search || fuel || transmission || seats) && (
        <div className="flex justify-end">
          <button
            onClick={onReset}
            className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
          >
            <RotateCcw className="w-3 h-3" /> Clear all filters
          </button>
        </div>
      )}
    </div>
  );
};