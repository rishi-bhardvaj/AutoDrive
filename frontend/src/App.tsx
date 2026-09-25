import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './hooks/useAuth';
import { CustomerLayout } from './layouts/CustomerLayout';
import { AdminLayout } from './layouts/AdminLayout';

import { HomePage } from './pages/HomePage';
import { RentPage } from './pages/RentPage';
import { CarDetailPage } from './pages/CarDetailPage';
import { BuySellPage } from './pages/BuySellPage';
import { ServicePage } from './pages/ServicePage';
import { ContactPage } from './pages/ContactPage';

import { AdminLoginPage } from './pages/admin/AdminLoginPage';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { AdminCarsPage } from './pages/admin/AdminCarsPage';
import { AdminBookingsPage } from './pages/admin/AdminBookingsPage';
import { AdminServicesPage } from './pages/admin/AdminServicesPage';
import { AdminBuySellPage } from './pages/admin/AdminBuySellPage';
import { AdminRepairsPage } from './pages/admin/AdminRepairsPage';
import { AdminSettingsPage } from './pages/admin/AdminSettingsPage';

const ProtectedAdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-xs text-slate-500">Authenticating...</div>;
  }
  return isAuthenticated ? <>{children}</> : <Navigate to="/admin/login" replace />;
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Customer Routes */}
          <Route element={<CustomerLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/rent" element={<RentPage />} />
            <Route path="/rent/:id" element={<CarDetailPage />} />
            <Route path="/buy-sell" element={<BuySellPage />} />
            <Route path="/service" element={<ServicePage />} />
            <Route path="/contact" element={<ContactPage />} />
          </Route>

          {/* Admin Auth */}
          <Route path="/admin/login" element={<AdminLoginPage />} />

          {/* Protected Admin Routes */}
          <Route
            path="/admin"
            element={
              <ProtectedAdminRoute>
                <AdminLayout />
              </ProtectedAdminRoute>
            }
          >
            <Route index element={<AdminDashboardPage />} />
            <Route path="cars" element={<AdminCarsPage />} />
            <Route path="bookings" element={<AdminBookingsPage />} />
            <Route path="services" element={<AdminServicesPage />} />
            <Route path="buy-sell" element={<AdminBuySellPage />} />
            <Route path="repairs" element={<AdminRepairsPage />} />
            <Route path="settings" element={<AdminSettingsPage />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;