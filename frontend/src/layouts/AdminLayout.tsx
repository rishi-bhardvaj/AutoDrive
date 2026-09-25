import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import {
  LayoutDashboard,
  Car,
  CalendarCheck2,
  Wrench,
  ShoppingBag,
  Bell,
  LogOut,
  Menu,
  X,
  ShieldAlert,
} from 'lucide-react';
import { BUSINESS_NAME } from '../config/business';
import { pushNotificationService } from '../services/pushNotification';

export const AdminLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [pushStatus, setPushStatus] = useState<string | null>(null);

  const navItems = [
    { label: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { label: 'Rental Fleet', path: '/admin/cars', icon: Car },
    { label: 'Bookings', path: '/admin/bookings', icon: CalendarCheck2 },
    { label: 'Workshop / Service', path: '/admin/services', icon: Wrench },
    { label: 'Buy & Sell Enquiries', path: '/admin/buy-sell', icon: ShoppingBag },
    { label: 'Fleet Maintenance', path: '/admin/repairs', icon: ShieldAlert },
  ];

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const handleEnablePush = async () => {
    try {
      const sub = await pushNotificationService.subscribeToPush();
      if (sub) {
        setPushStatus('Enabled');
        setTimeout(() => setPushStatus(null), 3000);
      }
    } catch (e) {
      alert('Could not subscribe to push notifications. Check browser permissions.');
    }
  };

  const isActive = (p: string) => location.pathname === p;

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row">
      {/* Mobile Header */}
      <div className="md:hidden bg-slate-900 text-white p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-amber-500 text-slate-950 font-bold rounded flex items-center justify-center">
            AD
          </div>
          <span className="font-bold text-sm">{BUSINESS_NAME} Admin</span>
        </div>
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-1">
          {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-slate-300 flex flex-col transform transition-transform duration-200 md:static md:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-0 hidden md:flex'
        }`}
      >
        {/* Brand */}
        <div className="p-6 border-b border-slate-800 flex items-center gap-3">
          <div className="w-9 h-9 bg-amber-500 text-slate-950 font-bold rounded-lg flex items-center justify-center text-lg">
            AD
          </div>
          <div>
            <h2 className="font-bold text-white text-sm tracking-tight">{BUSINESS_NAME}</h2>
            <p className="text-[11px] text-slate-400">Operations Control</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  active
                    ? 'bg-amber-500 text-slate-950 font-bold'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Push Notification Switch & User info */}
        <div className="p-4 border-t border-slate-800 space-y-3">
          <button
            onClick={handleEnablePush}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700 transition-colors"
          >
            <Bell className="w-3.5 h-3.5 text-amber-400" />
            <span>{pushStatus ? 'Notifications Active' : 'Enable Web Push Alerts'}</span>
          </button>

          <div className="pt-2 flex items-center justify-between text-xs text-slate-400">
            <div>
              <p className="text-white font-medium truncate max-w-[120px]">{user?.name || 'Admin User'}</p>
              <p className="text-[10px] text-slate-400">{user?.role || 'Manager'}</p>
            </div>
            <button
              onClick={handleLogout}
              className="p-1.5 text-red-400 hover:text-red-300 hover:bg-slate-800 rounded transition-colors"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-screen">
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          <Outlet />
        </main>
      </div>
    </div>
  );
};