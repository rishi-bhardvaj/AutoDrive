import React, { useEffect, useState } from 'react';
import { apiClient } from '../../services/api';
import { SellEnquiry, SellEnquiryStatus } from '../../types';
import { formatCurrency, formatIndianDate, formatIndianKm } from '../../config/business';

export const AdminBuySellPage: React.FC = () => {
  const [sellEnquiries, setSellEnquiries] = useState<SellEnquiry[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchEnquiries = async () => {
    try {
      setLoading(true);
      const res = await apiClient.getAdminSellEnquiries();
      if (res.success && res.data) setSellEnquiries(res.data);
    } catch (e) {
      console.error('Failed to load sell enquiries:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnquiries();
  }, []);

  const handleUpdateStatus = async (id: string, st: SellEnquiryStatus) => {
    try {
      await apiClient.updateSellEnquiry(id, { status: st });
      fetchEnquiries();
    } catch (e: any) {
      alert(e.message || 'Failed to update status.');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Sell Your Car Enquiries</h1>
        <p className="text-xs text-slate-500">Customer valuation requests, doorstep inspection status, and purchases</p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 border-b border-slate-200 font-bold text-slate-900">
              <tr>
                <th className="p-3">Ref</th>
                <th className="p-3">Customer</th>
                <th className="p-3">Car Model & Year</th>
                <th className="p-3">Usage & Fuel</th>
                <th className="p-3">Expected Price</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr><td colSpan={7} className="p-8 text-center text-slate-400">Loading enquiries...</td></tr>
              ) : sellEnquiries.length === 0 ? (
                <tr><td colSpan={7} className="p-8 text-center text-slate-400">No sell enquiries recorded.</td></tr>
              ) : (
                sellEnquiries.map((e) => (
                  <tr key={e.id} className="hover:bg-slate-50/50">
                    <td className="p-3 font-mono font-bold text-slate-900">{e.enquiryReference}</td>
                    <td className="p-3">
                      <span className="font-semibold text-slate-900 block">{e.customerName}</span>
                      <a href={`tel:${e.customerPhone}`} className="text-slate-500 hover:underline">{e.customerPhone}</a>
                    </td>
                    <td className="p-3">
                      <span className="font-bold text-slate-900 block">{e.carMakeModel}</span>
                      <span className="text-[11px] text-slate-400">{e.registrationYear} • {e.registrationState || 'Noida'}</span>
                    </td>
                    <td className="p-3 text-[11px] text-slate-600">
                      {formatIndianKm(e.kilometres)} • {e.fuelType}
                    </td>
                    <td className="p-3 font-bold text-slate-900">{formatCurrency(e.expectedPrice)}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        e.status === SellEnquiryStatus.INSPECTED ? 'bg-emerald-100 text-emerald-800' :
                        e.status === SellEnquiryStatus.NEW ? 'bg-amber-100 text-amber-800' :
                        e.status === SellEnquiryStatus.PURCHASED ? 'bg-blue-100 text-blue-800' : 'bg-slate-100 text-slate-700'
                      }`}>
                        {e.status}
                      </span>
                    </td>
                    <td className="p-3 text-right space-x-1.5">
                      {e.status === SellEnquiryStatus.NEW && (
                        <button
                          onClick={() => handleUpdateStatus(e.id, SellEnquiryStatus.CONTACTED)}
                          className="px-2 py-1 bg-slate-900 hover:bg-slate-800 text-white rounded text-[10px] font-bold"
                        >
                          Mark Contacted
                        </button>
                      )}
                      {e.status === SellEnquiryStatus.CONTACTED && (
                        <button
                          onClick={() => handleUpdateStatus(e.id, SellEnquiryStatus.INSPECTED)}
                          className="px-2 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[10px] font-bold"
                        >
                          Inspected
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