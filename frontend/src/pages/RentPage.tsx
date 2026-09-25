import React, { useEffect, useState } from 'react';
import { Vehicle } from '../types';
import { apiClient } from '../services/api';
import { CarCard } from '../components/cars/CarCard';
import { CarFilters } from '../components/cars/CarFilters';

export const RentPage: React.FC = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [fuel, setFuel] = useState('');
  const [transmission, setTransmission] = useState('');
  const [seats, setSeats] = useState('');

  const fetchCars = async () => {
    try {
      setLoading(true);
      const res = await apiClient.getVehicles({
        search: search || undefined,
        fuel: fuel || undefined,
        transmission: transmission || undefined,
        seats: seats ? parseInt(seats, 10) : undefined,
      });
      if (res.success && res.data) {
        setVehicles(res.data);
      }
    } catch (e) {
      console.error('Failed to fetch vehicles:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCars();
  }, [search, fuel, transmission, seats]);

  const handleReset = () => {
    setSearch('');
    setFuel('');
    setTransmission('');
    setSeats('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Rental Cars Fleet</h1>
        <p className="text-sm text-slate-600 mt-1">
          Explore our maintained fleet of hatchbacks, sedans, and SUVs in Noida. Request a booking online and our team will confirm.
        </p>
      </div>

      {/* Filter Toolbar */}
      <CarFilters
        search={search}
        setSearch={setSearch}
        fuel={fuel}
        setFuel={setFuel}
        transmission={transmission}
        setTransmission={setTransmission}
        seats={seats}
        setSeats={setSeats}
        onReset={handleReset}
      />

      {/* Cars Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
            <div key={n} className="h-80 bg-slate-200 animate-pulse rounded-xl" />
          ))}
        </div>
      ) : vehicles.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center space-y-3">
          <p className="text-slate-600 text-sm font-medium">No cars match your chosen filter criteria.</p>
          <button
            onClick={handleReset}
            className="px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-bold"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {vehicles.map((car) => (
            <CarCard key={car.id} vehicle={car} />
          ))}
        </div>
      )}
    </div>
  );
};