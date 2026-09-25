import React, { useEffect, useState } from 'react';
import { apiClient } from '../../services/api';
import { RepairRecord, RepairStatus, Vehicle } from '../../types';
import { formatCurrency, formatIndianDate } from '../../config/business';
import { Modal } from '../../components/common/Modal';
import { Plus, ShieldAlert } from 'lucide-react';

export const AdminRepairsPage: React.FC = () => {
  const [repairs, setRepairs] = useState<RepairRecord[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);

  // New repair modal
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedVehicleId, setSelectedVehicleId] = useState('');
  const [issueDescription, setIssueDescription] = useState('');
  const [estimatedCost, setEstimatedCost] = useState('2000');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [repRes, vehRes] = await Promise.all([
        apiClient.getAdminRepairs(),
        apiClient.getAdminVehicles(),
      ]);
      if (repRes.success && repRes.data) setRepairs(repRes.data);
      if (vehRes.success && vehRes.data) setVehicles(vehRes.data);
    } catch (e) {
      console.error('Failed to load repair records:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateRepair = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiClient.createRepair({
        vehicleId: selectedVehicleId,
        issueDescription,
        estimatedCost: parseFloat(estimatedCost),
        startDate,
      });
      setModalOpen(false);
      loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to create repair job.');
    }
  };

  const handleCompleteRepair = async (id: string) => {
    try {
      await apiClient.updateRepair(id, {
        status: RepairStatus.COMPLETED,
        endDate: new Date().toISOString().split('T')[0],
      });
      loadData();
    } catch (e: any) {
      alert(e.message || 'Failed to complete repair.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Fleet Maintenance & Repairs</h1>
          <p className="text-xs text-slate-500">Vehicles in workshop are automatically marked UNDER_REPAIR</p>
        </div>
        <button
          onClick={() => {
            if (vehicles.length > 0) setSelectedVehicleId(vehicles[0].id);
            setModalOpen(true);
          }}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-bold"
        >
          <Plus className="w-4 h-4 text-amber-400" /> Log Maintenance Job
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 border-b border-slate-200 font-bold text-slate-900">
              <tr>
                <th className="p-3">Ref</th>
                <th className="p-3">Vehicle</th>
                <th className="p-3">Issue / Work Required</th>
                <th className="p-3">Est Cost</th>
                <th className="p-3">Start Date</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr><td colSpan={7} className="p-8 text-center text-slate-400">Loading repairs...</td></tr>
              ) : repairs.length === 0 ? (
                <tr><td colSpan={7} className="p-8 text-center text-slate-400">No active maintenance jobs.</td></tr>
              ) : (
                repairs.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50/50">
                    <td className="p-3 font-mono font-bold text-slate-900">{r.repairReference}</td>
                    <td className="p-3">
                      <span className="font-bold text-slate-900 block">{r.vehicle?.brand} {r.vehicle?.model}</span>
                      <span className="text-[10px] text-slate-400">{r.vehicle?.registrationNumber}</span>
                    </td>
                    <td className="p-3 max-w-xs truncate">{r.issueDescription}</td>
                    <td className="p-3 font-bold text-slate-900">{r.estimatedCost ? formatCurrency(r.estimatedCost) : '—'}</td>
                    <td className="p-3 text-[11px] text-slate-600">{formatIndianDate(r.startDate)}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        r.status === RepairStatus.IN_PROGRESS ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {r.status}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      {r.status === RepairStatus.IN_PROGRESS && (
                        <button
                          onClick={() => handleCompleteRepair(r.id)}
                          className="px-2.5 py-1 bg-emerald-600 text-white rounded text-[10px] font-bold"
                        >
                          Mark Done & Restore Car
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Log Vehicle Maintenance Job">
        <form onSubmit={handleCreateRepair} className="space-y-4 text-xs">
          <div>
            <label className="font-semibold block mb-1">Select Fleet Vehicle *</label>
            <select
              value={selectedVehicleId}
              onChange={(e) => setSelectedVehicleId(e.target.value)}
              className="w-full p-2 border rounded"
              required
            >
              {vehicles.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.brand} {v.model} ({v.registrationNumber}) - {v.status}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="font-semibold block mb-1">Issue / Maintenance Work *</label>
            <textarea
              rows={3}
              required
              placeholder="e.g. Brake pads replacement and 50,000 km oil service..."
              value={issueDescription}
              onChange={(e) => setIssueDescription(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold block mb-1">Estimated Cost (₹)</label>
              <input
                type="number"
                value={estimatedCost}
                onChange={(e) => setEstimatedCost(e.target.value)}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="font-semibold block mb-1">Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full p-2 border rounded"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t">
            <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 border rounded font-bold">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-slate-900 text-white rounded font-bold">Start Maintenance</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};