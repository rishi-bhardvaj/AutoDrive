import {
  Vehicle,
  RentalBooking,
  ServiceRequest,
  RepairRecord,
  SaleVehicle,
  PurchaseEnquiry,
  SellEnquiry,
  DashboardStats,
  AdminUser,
  BookingStatus,
  ServiceRequestStatus,
  SellEnquiryStatus,
  RepairStatus,
} from '../types';

const API_BASE = '/api';

class ApiClient {
  private getToken(): string | null {
    return localStorage.getItem('carzz_admin_token');
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...((options.headers as Record<string, string>) || {}),
    };

    const token = this.getToken();
    if (token) {
      headers['Authorization'] = 'Bearer ' + token;
    }

    const response = await fetch(API_BASE + endpoint, {
      ...options,
      headers,
    });

    const data = await response.json().catch(() => ({ success: false, message: 'Invalid response from server' }));

    if (!response.ok) {
      throw new Error(data.message || 'Request failed with status ' + response.status);
    }

    return data;
  }

  // Auth
  async login(email: string, password: string): Promise<{ success: boolean; data: { token: string; user: AdminUser } }> {
    return this.request('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) });
  }

  async getMe(): Promise<{ success: boolean; data: { user: AdminUser } }> {
    return this.request('/auth/me');
  }

  // Public Fleet
  async getVehicles(params?: Record<string, any>): Promise<{ success: boolean; count: number; data: Vehicle[] }> {
    const cleanParams: Record<string, string> = {};
    if (params) {
      Object.keys(params).forEach(k => {
        if (params[k] !== undefined && params[k] !== null && params[k] !== '') {
          cleanParams[k] = String(params[k]);
        }
      });
    }
    const query = Object.keys(cleanParams).length ? '?' + new URLSearchParams(cleanParams).toString() : '';
    return this.request('/cars' + query);
  }

  async getVehicleByIdentifier(identifier: string): Promise<{ success: boolean; data: Vehicle }> {
    return this.request('/cars/' + identifier);
  }

  // Rental Bookings
  async createBooking(payload: any): Promise<{ success: boolean; data: RentalBooking }> {
    return this.request('/bookings', { method: 'POST', body: JSON.stringify(payload) });
  }

  // Workshop / Service
  async createServiceRequest(payload: any): Promise<{ success: boolean; data: ServiceRequest }> {
    return this.request('/service-requests', { method: 'POST', body: JSON.stringify(payload) });
  }

  // Sell Used Car
  async createSellEnquiry(payload: any): Promise<{ success: boolean; data: SellEnquiry }> {
    return this.request('/sell-enquiries', { method: 'POST', body: JSON.stringify(payload) });
  }

  // Buy Used Car
  async getSaleVehicles(params?: Record<string, any>): Promise<{ success: boolean; count: number; data: SaleVehicle[] }> {
    const query = params ? '?' + new URLSearchParams(params).toString() : '';
    return this.request('/sale-cars' + query);
  }

  async submitPurchaseEnquiry(payload: any): Promise<{ success: boolean; data: PurchaseEnquiry }> {
    return this.request('/sale-cars/enquire', { method: 'POST', body: JSON.stringify(payload) });
  }

  // Admin Dashboard
  async getDashboardStats(): Promise<{ success: boolean; data: DashboardStats }> {
    return this.request('/dashboard/stats');
  }

  // Admin Cars
  async getAdminVehicles(): Promise<{ success: boolean; count: number; data: Vehicle[] }> {
    return this.request('/cars/admin/all');
  }

  async createVehicle(payload: any): Promise<{ success: boolean; data: Vehicle }> {
    return this.request('/cars/admin', { method: 'POST', body: JSON.stringify(payload) });
  }

  async updateVehicle(id: string, payload: any): Promise<{ success: boolean; data: Vehicle }> {
    return this.request('/cars/admin/' + id, { method: 'PATCH', body: JSON.stringify(payload) });
  }

  async deleteVehicle(id: string): Promise<{ success: boolean; message: string }> {
    return this.request('/cars/admin/' + id, { method: 'DELETE' });
  }

  // Admin Bookings
  async getAdminBookings(params?: Record<string, any>): Promise<{ success: boolean; count: number; data: RentalBooking[] }> {
    const cleanParams: Record<string, string> = {};
    if (params) {
      Object.keys(params).forEach(k => {
        if (params[k] !== undefined && params[k] !== null && params[k] !== '') {
          cleanParams[k] = String(params[k]);
        }
      });
    }
    const query = Object.keys(cleanParams).length ? '?' + new URLSearchParams(cleanParams).toString() : '';
    return this.request('/bookings/admin/all' + query);
  }

  async updateBookingStatus(id: string, payload: { status: BookingStatus; adminNotes?: string }): Promise<{ success: boolean; data: RentalBooking }> {
    return this.request('/bookings/admin/' + id + '/status', { method: 'PATCH', body: JSON.stringify(payload) });
  }

  // Admin Service Requests
  async getAdminServiceRequests(params?: Record<string, any>): Promise<{ success: boolean; count: number; data: ServiceRequest[] }> {
    const query = params ? '?' + new URLSearchParams(params).toString() : '';
    return this.request('/service-requests/admin/all' + query);
  }

  async updateServiceRequest(id: string, payload: { status?: ServiceRequestStatus; adminNotes?: string }): Promise<{ success: boolean; data: ServiceRequest }> {
    return this.request('/service-requests/admin/' + id, { method: 'PATCH', body: JSON.stringify(payload) });
  }

  // Admin Sell Enquiries
  async getAdminSellEnquiries(params?: Record<string, any>): Promise<{ success: boolean; count: number; data: SellEnquiry[] }> {
    const query = params ? '?' + new URLSearchParams(params).toString() : '';
    return this.request('/sell-enquiries/admin/all' + query);
  }

  async updateSellEnquiry(id: string, payload: { status?: SellEnquiryStatus; adminNotes?: string }): Promise<{ success: boolean; data: SellEnquiry }> {
    return this.request('/sell-enquiries/admin/' + id, { method: 'PATCH', body: JSON.stringify(payload) });
  }

  // Admin Repairs
  async getAdminRepairs(): Promise<{ success: boolean; count: number; data: RepairRecord[] }> {
    return this.request('/repairs/all');
  }

  async createRepair(payload: any): Promise<{ success: boolean; data: RepairRecord }> {
    return this.request('/repairs', { method: 'POST', body: JSON.stringify(payload) });
  }

  async updateRepair(id: string, payload: { status?: RepairStatus; actualCost?: number; endDate?: string; notes?: string }): Promise<{ success: boolean; data: RepairRecord }> {
    return this.request('/repairs/' + id, { method: 'PATCH', body: JSON.stringify(payload) });
  }

  // Push Notifications
  async getVapidPublicKey(): Promise<{ success: boolean; data: { publicKey: string } }> {
    return this.request('/notifications/vapid-public-key');
  }

  async subscribePush(subscription: any, userRole: string = 'admin'): Promise<{ success: boolean; message: string }> {
    return this.request('/notifications/subscribe', {
      method: 'POST',
      body: JSON.stringify({ subscription, userRole }),
    });
  }

  async testPush(title: string, message: string): Promise<{ success: boolean }> {
    return this.request('/notifications/test-broadcast', {
      method: 'POST',
      body: JSON.stringify({ title, message }),
    });
  }
}

export const apiClient = new ApiClient();
export default apiClient;