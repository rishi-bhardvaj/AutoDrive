import React, { useEffect, useState } from 'react';
import { apiClient } from '../../services/api';
import { ServiceRequest, ServiceRequestStatus } from '../../types';
import { formatIndianDate } from '../../config/business';
import { Wrench, CheckCircle2, Clock, AlertCircle } from 'lucide-react';

export const AdminServicesPage: React.FC = () => {
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const res = await apiClient.getAdminServiceRequests();
      if (res.success && res.data) setRequests(res.data);
    } catch (e) {
      console.error('Failed to load service requests:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleUpdateStatus = async (id: string, st: ServiceRequestStatus) => {
    try {
      await apiClient.updateServiceRequest(id, { status: st });
      fetchRequests();
    } catch (e: any) {
      alert(e.message || 'Failed to update status.');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Workshop & Service Appointments</h1>
        <p className="text-xs text-slate-500">Track incoming repair requests, scheduled maintenance, and job completion</p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 border-b border-slate-200 font-bold text-slate-900">
              <tr>
                <th className="p-3">Job Ref</th>
                <th className="p-3">Customer</th>
                <th className="p-3">Vehicle Details</th>
                <th className="p-3">Service Type</th>
                <th className="p-3">Preferred Date</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr><td colSpan={7} className="p-8 text-center text-slate-400">Loading appointments...</td></tr>
              ) : requests.length === 0 ? (
                <tr><td colSpan={7} className="p-8 text-center text-slate-400">No service requests recorded.</td></tr>
              ) : (
                requests.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50/50">
                    <td className="p-3 font-mono font-bold text-slate-900">{r.requestReference}</td>
                    <td className="p-3">
                      <span className="font-semibold text-slate-900 block">{r.customerName}</span>
                      <a href={`tel:${r.customerPhone}`} className="text-slate-500 hover:underline">{r.customerPhone}</a>
                    </td>
                    <td className="p-3 font-medium text-slate-800">{r.vehicleDetails}</td>
                    <td className="p-3">{r.serviceType.replace('_', ' ')}</td>
                    <td className="p-3 text-[11px] text-slate-600">
                      {r.preferredDate ? formatIndianDate(r.preferredDate) : 'Not Specified'}
                    </td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        r.status === ServiceRequestStatus.CONFIRMED ? 'bg-emerald-100 text-emerald-800' :
                        r.status === ServiceRequestStatus.NEW ? 'bg-amber-100 text-amber-800' :
                        r.status === ServiceRequestStatus.COMPLETED ? 'bg-blue-100 text-blue-800' : 'bg-slate-100 text-slate-700'
                      }`}>
                        {r.status}
                      </span>
                    </td>
                    <td className="p-3 text-right space-x-1.5">
                      {r.status === ServiceRequestStatus.NEW && (
                        <button
                          onClick={() => handleUpdateStatus(r.id, ServiceRequestStatus.CONFIRMED)}
                          className="px-2 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[10px] font-bold"
                        >
                          Confirm
                        </button>
                      )}
                      {r.status === ServiceRequestStatus.CONFIRMED && (
                        <button
                          onClick={() => handleUpdateStatus(r.id, ServiceRequestStatus.COMPLETED)}
                          className="px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-[10px] font-bold"
                        >
                          Complete
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
    </div>
  );
};