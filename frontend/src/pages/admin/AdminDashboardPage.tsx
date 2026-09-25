import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiClient } from '../../services/api';
import { DashboardStats, RentalBooking, ServiceRequest, SellEnquiry } from '../../types';
import { formatCurrency, formatIndianDate } from '../../config/business';
import { Car, CalendarCheck2, Wrench, ShoppingBag, ShieldAlert, ArrowRight, CheckCircle2, Clock } from 'lucide-react';

export const AdminDashboardPage: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentBookings, setRecentBookings] = useState<RentalBooking[]>([]);
  const [recentServices, setRecentServices] = useState<ServiceRequest[]>([]);
  const [recentSellEnquiries, setRecentSellEnquiries] = useState<SellEnquiry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      apiClient.getDashboardStats(),
      apiClient.getAdminBookings({ limit: 5 }),
      apiClient.getAdminServiceRequests({ limit: 5 }),
      apiClient.getAdminSellEnquiries({ limit: 5 }),
    ])
      .then(([statsRes, bookRes, srvRes, sellRes]) => {
        if (statsRes.success) setStats(statsRes.data);
        if (bookRes.success) setRecentBookings(bookRes.data.slice(0, 5));
        if (srvRes.success) setRecentServices(srvRes.data.slice(0, 5));
        if (sellRes.success) setRecentSellEnquiries(sellRes.data.slice(0, 5));
      })
      .catch((e) => console.error('Dashboard load error:', e))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="p-8 text-center text-xs text-slate-500">Loading Dashboard Metrics...</div>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Operations Control Center</h1>
        <p className="text-xs text-slate-500 mt-0.5">Live fleet status, upcoming bookings, and workshop activity</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-medium">Rental Fleet</span>
            <Car className="w-4 h-4 text-slate-400" />
          </div>
          <div className="mt-2 text-2xl font-extrabold text-slate-900">{stats?.totalCars || 0}</div>
          <div className="text-[11px] text-emerald-600 mt-1 font-medium">{stats?.availableCars || 0} Available for rent</div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-medium">Pending Bookings</span>
            <CalendarCheck2 className="w-4 h-4 text-amber-500" />
          </div>
          <div className="mt-2 text-2xl font-extrabold text-slate-900">{stats?.pendingBookings || 0}</div>
          <div className="text-[11px] text-amber-600 mt-1 font-medium">{stats?.approvedBookings || 0} Approved active</div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-medium">Workshop Jobs</span>
            <Wrench className="w-4 h-4 text-blue-500" />
          </div>
          <div className="mt-2 text-2xl font-extrabold text-slate-900">{stats?.pendingServiceRequests || 0}</div>
          <div className="text-[11px] text-slate-500 mt-1">Pending appointments</div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-medium">Sell Enquiries</span>
            <ShoppingBag className="w-4 h-4 text-purple-500" />
          </div>
          <div className="mt-2 text-2xl font-extrabold text-slate-900">{stats?.newSellEnquiries || 0}</div>
          <div className="text-[11px] text-slate-500 mt-1">Awaiting car valuation</div>
        </div>
      </div>

      {/* Grid: Recent Bookings & Workshop requests */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Bookings */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
            <h3 className="font-bold text-sm text-slate-900">Latest Rental Bookings</h3>
            <Link to="/admin/bookings" className="text-xs text-slate-600 hover:text-slate-900 font-semibold inline-flex items-center gap-1">
              View All <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="divide-y divide-slate-100">
            {recentBookings.length === 0 ? (
              <p className="p-4 text-xs text-slate-500 text-center">No bookings recorded.</p>
            ) : (
              recentBookings.map((b) => (
                <div key={b.id} className="p-4 flex items-center justify-between gap-3 text-xs">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-slate-900">{b.bookingReference}</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        b.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-800' :
                        b.status === 'PENDING' ? 'bg-amber-100 text-amber-800' :
                        b.status === 'COMPLETED' ? 'bg-blue-100 text-blue-800' : 'bg-slate-100 text-slate-700'
                      }`}>
                        {b.status}
                      </span>
                    </div>
                    <p className="text-slate-700 mt-0.5 font-medium">{b.customerName} • {b.customerPhone}</p>
                    <p className="text-slate-400 text-[11px]">
                      {b.vehicle?.brand} {b.vehicle?.model} • {formatIndianDate(b.pickupDate)} → {formatIndianDate(b.returnDate)}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="font-bold text-slate-900 block">{formatCurrency(b.estimatedAmount)}</span>
                    <span className="text-[10px] text-slate-400">{b.totalDays} Days</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Service Requests */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
            <h3 className="font-bold text-sm text-slate-900">Latest Workshop Service Requests</h3>
            <Link to="/admin/services" className="text-xs text-slate-600 hover:text-slate-900 font-semibold inline-flex items-center gap-1">
              View All <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="divide-y divide-slate-100">
            {recentServices.length === 0 ? (
              <p className="p-4 text-xs text-slate-500 text-center">No service requests recorded.</p>
            ) : (
              recentServices.map((s) => (
                <div key={s.id} className="p-4 flex items-center justify-between gap-3 text-xs">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-slate-900">{s.requestReference}</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-800">
                        {s.serviceType.replace('_', ' ')}
                      </span>
                    </div>
                    <p className="text-slate-700 mt-0.5 font-medium">{s.customerName} ({s.customerPhone})</p>
                    <p className="text-slate-500 text-[11px]">{s.vehicleDetails}</p>
                  </div>
                  <div className="text-right shrink-0 text-[11px] text-slate-500">
                    {s.preferredDate ? formatIndianDate(s.preferredDate) : 'Flexible Slot'}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};