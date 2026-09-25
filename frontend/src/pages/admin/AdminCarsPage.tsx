import React, { useEffect, useState } from 'react';
import { apiClient } from '../../services/api';
import { Vehicle, VehicleStatus, FuelType, Transmission } from '../../types';
import { formatCurrency } from '../../config/business';
import { Modal } from '../../components/common/Modal';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { Plus, Edit2, Trash2, ShieldAlert, CheckCircle2 } from 'lucide-react';

export const AdminCarsPage: React.FC = () => {
  const [cars, setCars] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);

  // Form modal
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCar, setEditingCar] = useState<Vehicle | null>(null);

  // Delete modal
  const [deleteTarget, setDeleteTarget] = useState<Vehicle | null>(null);

  // Form state
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [registrationNumber, setRegistrationNumber] = useState('');
  const [year, setYear] = useState('2023');
  const [fuelType, setFuelType] = useState<FuelType>(FuelType.DIESEL);
  const [transmission, setTransmission] = useState<Transmission>(Transmission.AUTOMATIC);
  const [seats, setSeats] = useState('5');
  const [dailyRentalPrice, setDailyRentalPrice] = useState('2500');
  const [securityDeposit, setSecurityDeposit] = useState('5000');
  const [description, setDescription] = useState('');
  const [imagesText, setImagesText] = useState('');
  const [status, setStatus] = useState<VehicleStatus>(VehicleStatus.AVAILABLE);
  const [isFeatured, setIsFeatured] = useState(false);

  const fetchCars = async () => {
    try {
      setLoading(true);
      const res = await apiClient.getAdminVehicles();
      if (res.success && res.data) setCars(res.data);
    } catch (e) {
      console.error('Failed to load admin cars:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCars();
  }, []);

  const handleOpenAdd = () => {
    setEditingCar(null);
    setBrand('');
    setModel('');
    setRegistrationNumber('');
    setYear('2023');
    setFuelType(FuelType.DIESEL);
    setTransmission(Transmission.AUTOMATIC);
    setSeats('5');
    setDailyRentalPrice('2500');
    setSecurityDeposit('5000');
    setDescription('');
    setImagesText('https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800&auto=format&fit=crop&q=80');
    setStatus(VehicleStatus.AVAILABLE);
    setIsFeatured(false);
    setModalOpen(true);
  };

  const handleOpenEdit = (c: Vehicle) => {
    setEditingCar(c);
    setBrand(c.brand);
    setModel(c.model);
    setRegistrationNumber(c.registrationNumber);
    setYear(c.year.toString());
    setFuelType(c.fuelType);
    setTransmission(c.transmission);
    setSeats(c.seats.toString());
    setDailyRentalPrice(c.dailyRentalPrice.toString());
    setSecurityDeposit(c.securityDeposit.toString());
    setDescription(c.description || '');
    setImagesText(c.images.join('\n'));
    setStatus(c.status);
    setIsFeatured(c.isFeatured);
    setModalOpen(true);
  };

  const handleSaveCar = async (e: React.FormEvent) => {
    e.preventDefault();
    const images = imagesText.split('\n').map((s) => s.trim()).filter(Boolean);

    try {
      if (editingCar) {
        await apiClient.updateVehicle(editingCar.id, {
          brand,
          model,
          registrationNumber,
          year: parseInt(year, 10),
          fuelType,
          transmission,
          seats: parseInt(seats, 10),
          dailyRentalPrice: parseFloat(dailyRentalPrice),
          securityDeposit: parseFloat(securityDeposit),
          description,
          images,
          status,
          isFeatured,
        });
      } else {
        await apiClient.createVehicle({
          brand,
          model,
          registrationNumber,
          year: parseInt(year, 10),
          fuelType,
          transmission,
          seats: parseInt(seats, 10),
          dailyRentalPrice: parseFloat(dailyRentalPrice),
          securityDeposit: parseFloat(securityDeposit),
          description,
          images,
          status,
          isFeatured,
        });
      }
      setModalOpen(false);
      fetchCars();
    } catch (err: any) {
      alert(err.message || 'Failed to save vehicle.');
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await apiClient.deleteVehicle(deleteTarget.id);
      setDeleteTarget(null);
      fetchCars();
    } catch (e: any) {
      alert(e.message || 'Failed to delete vehicle.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Rental Fleet Management</h1>
          <p className="text-xs text-slate-500">Add, edit vehicle specs, daily rates, and status</p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold shadow"
        >
          <Plus className="w-4 h-4 text-amber-400" /> Add New Vehicle
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 border-b border-slate-200 font-bold text-slate-900">
              <tr>
                <th className="p-3">Vehicle</th>
                <th className="p-3">Reg No</th>
                <th className="p-3">Specs</th>
                <th className="p-3">Daily Rate</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr><td colSpan={6} className="p-8 text-center text-slate-400">Loading fleet...</td></tr>
              ) : cars.length === 0 ? (
                <tr><td colSpan={6} className="p-8 text-center text-slate-400">No cars in fleet.</td></tr>
              ) : (
                cars.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50/50">
                    <td className="p-3 flex items-center gap-3">
                      <img
                        src={c.images[0] || 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=200'}
                        alt={c.model}
                        className="w-12 h-8 rounded object-cover border border-slate-200"
                      />
                      <div>
                        <span className="font-bold text-slate-900 block">{c.brand} {c.model}</span>
                        <span className="text-[11px] text-slate-400">{c.year}</span>
                      </div>
                    </td>
                    <td className="p-3 font-mono font-bold text-slate-800">{c.registrationNumber}</td>
                    <td className="p-3 text-[11px] text-slate-600">
                      {c.transmission} • {c.fuelType} • {c.seats}S
                    </td>
                    <td className="p-3 font-bold text-slate-900">{formatCurrency(c.dailyRentalPrice)}/d</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        c.status === VehicleStatus.AVAILABLE ? 'bg-emerald-100 text-emerald-800' :
                        c.status === VehicleStatus.BOOKED ? 'bg-amber-100 text-amber-800' :
                        c.status === VehicleStatus.UNDER_REPAIR ? 'bg-red-100 text-red-800' : 'bg-slate-100 text-slate-700'
                      }`}>
                        {c.status}
                      </span>
                    </td>
                    <td className="p-3 text-right space-x-2">
                      <button
                        onClick={() => handleOpenEdit(c)}
                        className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded"
                        title="Edit"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeleteTarget(c)}
                        className="p-1.5 text-red-600 hover:text-red-800 hover:bg-red-50 rounded"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingCar ? 'Edit Vehicle' : 'Add New Rental Vehicle'}
        maxWidth="2xl"
      >
        <form onSubmit={handleSaveCar} className="space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold block mb-1">Brand *</label>
              <input type="text" required value={brand} onChange={(e) => setBrand(e.target.value)} className="w-full p-2 border rounded" placeholder="e.g. Hyundai" />
            </div>
            <div>
              <label className="font-semibold block mb-1">Model *</label>
              <input type="text" required value={model} onChange={(e) => setModel(e.target.value)} className="w-full p-2 border rounded" placeholder="e.g. Creta 1.5 SX" />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="font-semibold block mb-1">Reg Number *</label>
              <input type="text" required value={registrationNumber} onChange={(e) => setRegistrationNumber(e.target.value)} className="w-full p-2 border rounded" placeholder="UP 16 XX 0000" />
            </div>
            <div>
              <label className="font-semibold block mb-1">Year *</label>
              <input type="number" required value={year} onChange={(e) => setYear(e.target.value)} className="w-full p-2 border rounded" />
            </div>
            <div>
              <label className="font-semibold block mb-1">Seats *</label>
              <input type="number" required value={seats} onChange={(e) => setSeats(e.target.value)} className="w-full p-2 border rounded" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold block mb-1">Fuel Type *</label>
              <select value={fuelType} onChange={(e) => setFuelType(e.target.value as FuelType)} className="w-full p-2 border rounded">
                <option value={FuelType.PETROL}>Petrol</option>
                <option value={FuelType.DIESEL}>Diesel</option>
                <option value={FuelType.CNG}>CNG</option>
                <option value={FuelType.ELECTRIC}>Electric</option>
              </select>
            </div>
            <div>
              <label className="font-semibold block mb-1">Transmission *</label>
              <select value={transmission} onChange={(e) => setTransmission(e.target.value as Transmission)} className="w-full p-2 border rounded">
                <option value={Transmission.AUTOMATIC}>Automatic</option>
                <option value={Transmission.MANUAL}>Manual</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold block mb-1">Daily Rate (₹) *</label>
              <input type="number" required value={dailyRentalPrice} onChange={(e) => setDailyRentalPrice(e.target.value)} className="w-full p-2 border rounded" />
            </div>
            <div>
              <label className="font-semibold block mb-1">Security Deposit (₹) *</label>
              <input type="number" required value={securityDeposit} onChange={(e) => setSecurityDeposit(e.target.value)} className="w-full p-2 border rounded" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold block mb-1">Status</label>
              <select value={status} onChange={(e) => setStatus(e.target.value as VehicleStatus)} className="w-full p-2 border rounded">
                <option value={VehicleStatus.AVAILABLE}>AVAILABLE</option>
                <option value={VehicleStatus.BOOKED}>BOOKED</option>
                <option value={VehicleStatus.UNDER_REPAIR}>UNDER_REPAIR</option>
                <option value={VehicleStatus.INACTIVE}>INACTIVE</option>
              </select>
            </div>
            <div className="flex items-center pt-5">
              <label className="flex items-center gap-2 cursor-pointer font-semibold">
                <input type="checkbox" checked={isFeatured} onChange={(e) => setIsFeatured(e.target.checked)} className="rounded" />
                <span>Featured on Homepage</span>
              </label>
            </div>
          </div>

          <div>
            <label className="font-semibold block mb-1">Photo URLs (one per line)</label>
            <textarea rows={2} value={imagesText} onChange={(e) => setImagesText(e.target.value)} className="w-full p-2 border rounded font-mono text-[11px]" />
          </div>

          <div>
            <label className="font-semibold block mb-1">Description</label>
            <textarea rows={2} value={description} onChange={(e) => setDescription(e.target.value)} className="w-full p-2 border rounded" />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t">
            <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 border rounded font-bold">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-slate-900 text-white rounded font-bold">Save Vehicle</button>
          </div>
        </form>
      </Modal>

      {/* Delete confirmation */}
      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        title="Delete Vehicle"
        message={`Are you sure you want to remove ${deleteTarget?.brand} ${deleteTarget?.model} (${deleteTarget?.registrationNumber}) from the fleet?`}
        confirmLabel="Delete Vehicle"
        isDestructive={true}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};