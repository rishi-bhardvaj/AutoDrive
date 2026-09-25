import React, { useEffect, useState } from 'react';
import { apiClient } from '../../services/api';
import { RentalBooking, BookingStatus } from '../../types';
import { formatCurrency, formatIndianDate, getWhatsAppRentalUrl } from '../../config/business';
import { Modal } from '../../components/common/Modal';
import { CheckCircle2, XCircle, Clock, MessageCircle, AlertCircle } from 'lucide-react';

export const AdminBookingsPage: React.FC = () => {
  const [bookings, setBookings] = useState<RentalBooking[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [loading, setLoading] = useState(true);

  // Status update modal
  const [selectedBooking, setSelectedBooking] = useState<RentalBooking | null>(null);
  const [targetStatus, setTargetStatus] = useState<BookingStatus>(BookingStatus.APPROVED);
  const [adminNotes, setAdminNotes] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await apiClient.getAdminBookings({
        status: statusFilter ? (statusFilter as BookingStatus) : undefined,
      });
      if (res.success && res.data) setBookings(res.data);
    } catch (e) {
      console.error('Failed to load bookings:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [statusFilter]);

  const handleOpenStatusModal = (b: RentalBooking, st: BookingStatus) => {
    setSelectedBooking(b);
    setTargetStatus(st);
    setAdminNotes(b.adminNotes || '');
    setError(null);
  };

  const handleSaveStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBooking) return;
    setError(null);
    try {
      setSaving(true);
      await apiClient.updateBookingStatus(selectedBooking.id, {
        status: targetStatus,
        adminNotes: adminNotes.trim() || undefined,
      });
      setSelectedBooking(null);
      fetchBookings();
    } catch (err: any) {
      setError(err.message || 'Failed to update booking status.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Rental Bookings & Requests</h1>
          <p className="text-xs text-slate-500">Review requests, approve bookings, and manage customer communications</p>
        </div>
        <div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white"
          >
            <option value="">All Statuses</option>
            <option value={BookingStatus.PENDING}>PENDING Requests</option>
            <option value={BookingStatus.APPROVED}>APPROVED</option>
            <option value={BookingStatus.COMPLETED}>COMPLETED</option>
            <option value={BookingStatus.CANCELLED}>CANCELLED</option>
            <option value={BookingStatus.REJECTED}>REJECTED</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 border-b border-slate-200 font-bold text-slate-900">
              <tr>
                <th className="p-3">Reference</th>
                <th className="p-3">Customer</th>
                <th className="p-3">Vehicle</th>
                <th className="p-3">Rental Dates</th>
                <th className="p-3">Estimated Amount</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr><td colSpan={7} className="p-8 text-center text-slate-400">Loading bookings...</td></tr>
              ) : bookings.length === 0 ? (
                <tr><td colSpan={7} className="p-8 text-center text-slate-400">No bookings match filter.</td></tr>
              ) : (
                bookings.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50/50">
                    <td className="p-3 font-mono font-bold text-slate-900">{b.bookingReference}</td>
                    <td className="p-3">
                      <span className="font-semibold text-slate-900 block">{b.customerName}</span>
                      <a href={`tel:${b.customerPhone}`} className="text-slate-500 hover:underline">{b.customerPhone}</a>
                    </td>
                    <td className="p-3">
                      <span className="font-semibold text-slate-900 block">{b.vehicle?.brand} {b.vehicle?.model}</span>
                      <span className="text-[10px] text-slate-400">{b.vehicle?.registrationNumber}</span>
                    </td>
                    <td className="p-3 text-[11px] text-slate-600">
                      <div>{formatIndianDate(b.pickupDate)} → {formatIndianDate(b.returnDate)}</div>
                      <span className="text-[10px] text-slate-400">({b.totalDays} Days)</span>
                    </td>
                    <td className="p-3 font-bold text-slate-900">
                      {formatCurrency(b.estimatedAmount)}
                    </td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        b.status === BookingStatus.APPROVED ? 'bg-emerald-100 text-emerald-800' :
                        b.status === BookingStatus.PENDING ? 'bg-amber-100 text-amber-800' :
                        b.status === BookingStatus.COMPLETED ? 'bg-blue-100 text-blue-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {b.status}
                      </span>
                    </td>
                    <td className="p-3 text-right space-x-1.5">
                      <a
                        href={getWhatsAppRentalUrl(b.vehicle?.brand + ' ' + b.vehicle?.model, b.pickupDate, b.returnDate)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 text-emerald-700 hover:bg-emerald-50 rounded inline-block"
                        title="Chat on WhatsApp"
                      >
                        <MessageCircle className="w-4 h-4" />
                      </a>
                      {b.status === BookingStatus.PENDING && (
                        <>
                          <button
                            onClick={() => handleOpenStatusModal(b, BookingStatus.APPROVED)}
                            className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[10px] font-bold"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleOpenStatusModal(b, BookingStatus.REJECTED)}
                            className="px-2.5 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-[10px] font-bold"
                          >
                            Reject
                          </button>
                        </>
                      )}
                      {b.status === BookingStatus.APPROVED && (
                        <button
                          onClick={() => handleOpenStatusModal(b, BookingStatus.COMPLETED)}
                          className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-[10px] font-bold"
                        >
                          Mark Completed
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

      {/* Status modal */}
      <Modal
        isOpen={Boolean(selectedBooking)}
        onClose={() => setSelectedBooking(null)}
        title={`Update Booking ${selectedBooking?.bookingReference}`}
      >
        <form onSubmit={handleSaveStatus} className="space-y-4 text-xs">
          {error && (
            <div className="p-2.5 bg-red-50 text-red-700 border border-red-200 rounded text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="font-semibold block mb-1">Set Booking Status</label>
            <select
              value={targetStatus}
              onChange={(e) => setTargetStatus(e.target.value as BookingStatus)}
              className="w-full p-2 border rounded"
            >
              <option value={BookingStatus.PENDING}>PENDING</option>
              <option value={BookingStatus.APPROVED}>APPROVED</option>
              <option value={BookingStatus.COMPLETED}>COMPLETED</option>
              <option value={BookingStatus.CANCELLED}>CANCELLED</option>
              <option value={BookingStatus.REJECTED}>REJECTED</option>
            </select>
          </div>

          <div>
            <label className="font-semibold block mb-1">Internal Admin Notes</label>
            <textarea
              rows={3}
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              placeholder="e.g. Aadhaar verified, security deposit collected in cash..."
              className="w-full p-2 border rounded"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t">
            <button type="button" onClick={() => setSelectedBooking(null)} className="px-4 py-2 border rounded font-bold">Cancel</button>
            <button type="submit" disabled={saving} className="px-4 py-2 bg-slate-900 text-white rounded font-bold">
              {saving ? 'Updating...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};