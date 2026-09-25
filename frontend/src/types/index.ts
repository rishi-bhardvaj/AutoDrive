export const FuelType = {
  PETROL: 'PETROL',
  DIESEL: 'DIESEL',
  CNG: 'CNG',
  ELECTRIC: 'ELECTRIC',
  HYBRID: 'HYBRID',
} as const;
export type FuelType = typeof FuelType[keyof typeof FuelType];

export const Transmission = {
  MANUAL: 'MANUAL',
  AUTOMATIC: 'AUTOMATIC',
} as const;
export type Transmission = typeof Transmission[keyof typeof Transmission];

export const VehicleStatus = {
  AVAILABLE: 'AVAILABLE',
  BOOKED: 'BOOKED',
  RENTED: 'RENTED',
  UNDER_REPAIR: 'UNDER_REPAIR',
  INACTIVE: 'INACTIVE',
} as const;
export type VehicleStatus = typeof VehicleStatus[keyof typeof VehicleStatus];

export const BookingStatus = {
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
  CANCELLED: 'CANCELLED',
  COMPLETED: 'COMPLETED',
} as const;
export type BookingStatus = typeof BookingStatus[keyof typeof BookingStatus];

export const ServiceType = {
  PERIODIC_MAINTENANCE: 'PERIODIC_MAINTENANCE',
  OIL_CHANGE: 'OIL_CHANGE',
  BRAKE_SERVICE: 'BRAKE_SERVICE',
  AC_SERVICE: 'AC_SERVICE',
  BATTERY_ELECTRICAL: 'BATTERY_ELECTRICAL',
  TYRES_WHEELS: 'TYRES_WHEELS',
  DENTING_PAINTING: 'DENTING_PAINTING',
  GENERAL_REPAIR: 'GENERAL_REPAIR',
} as const;
export type ServiceType = typeof ServiceType[keyof typeof ServiceType];

export const ServiceRequestStatus = {
  NEW: 'NEW',
  CONTACTED: 'CONTACTED',
  CONFIRMED: 'CONFIRMED',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
} as const;
export type ServiceRequestStatus = typeof ServiceRequestStatus[keyof typeof ServiceRequestStatus];

export const RepairStatus = {
  OPEN: 'OPEN',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
} as const;
export type RepairStatus = typeof RepairStatus[keyof typeof RepairStatus];

export const SaleVehicleStatus = {
  AVAILABLE: 'AVAILABLE',
  BOOKED: 'BOOKED',
  SOLD: 'SOLD',
  INACTIVE: 'INACTIVE',
} as const;
export type SaleVehicleStatus = typeof SaleVehicleStatus[keyof typeof SaleVehicleStatus];

export const PurchaseEnquiryStatus = {
  NEW: 'NEW',
  CONTACTED: 'CONTACTED',
  TEST_DRIVE: 'TEST_DRIVE',
  NEGOTIATION: 'NEGOTIATION',
  CLOSED_WON: 'CLOSED_WON',
  CLOSED_LOST: 'CLOSED_LOST',
} as const;
export type PurchaseEnquiryStatus = typeof PurchaseEnquiryStatus[keyof typeof PurchaseEnquiryStatus];

export const SellEnquiryStatus = {
  NEW: 'NEW',
  CONTACTED: 'CONTACTED',
  INSPECTED: 'INSPECTED',
  PURCHASED: 'PURCHASED',
  CLOSED: 'CLOSED',
  REJECTED: 'REJECTED',
} as const;
export type SellEnquiryStatus = typeof SellEnquiryStatus[keyof typeof SellEnquiryStatus];

export interface Vehicle {
  id: string;
  brand: string;
  model: string;
  slug: string;
  registrationNumber: string;
  year: number;
  fuelType: FuelType;
  transmission: Transmission;
  seats: number;
  dailyRentalPrice: number;
  securityDeposit: number;
  description?: string | null;
  features: string[];
  images: string[];
  status: VehicleStatus;
  isFeatured: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface RentalBooking {
  id: string;
  bookingReference: string;
  vehicleId: string;
  vehicle?: Vehicle;
  customerName: string;
  customerPhone: string;
  customerEmail?: string | null;
  pickupDate: string;
  returnDate: string;
  pickupLocation: string;
  totalDays: number;
  estimatedAmount: number;
  securityDeposit: number;
  notes?: string | null;
  status: BookingStatus;
  adminNotes?: string | null;
  createdAt: string;
  updatedAt?: string;
}

export interface ServiceRequest {
  id: string;
  requestReference: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string | null;
  vehicleDetails: string;
  serviceType: string;
  preferredDate?: string | null;
  pickupDropRequired: boolean;
  pickupAddress?: string | null;
  description?: string | null;
  status: ServiceRequestStatus;
  estimatedCost?: number | null;
  adminNotes?: string | null;
  createdAt: string;
}

export interface RepairRecord {
  id: string;
  repairReference: string;
  vehicleId: string;
  vehicle?: Vehicle;
  issueDescription: string;
  estimatedCost?: number | null;
  actualCost?: number | null;
  startDate: string;
  endDate?: string | null;
  status: RepairStatus;
  notes?: string | null;
  createdAt: string;
}

export interface SaleVehicle {
  id: string;
  brand: string;
  model: string;
  slug: string;
  year: number;
  registrationYear: number;
  kilometres: number;
  fuelType: FuelType;
  transmission: Transmission;
  ownership: number;
  price: number;
  location: string;
  insuranceValidity?: string | null;
  description: string;
  features: string[];
  images: string[];
  status: SaleVehicleStatus;
  createdAt: string;
}

export interface PurchaseEnquiry {
  id: string;
  saleVehicleId: string;
  saleVehicle?: SaleVehicle;
  customerName: string;
  customerPhone: string;
  customerEmail?: string | null;
  message?: string | null;
  offeredPrice?: number | null;
  status: PurchaseEnquiryStatus;
  adminNotes?: string | null;
  createdAt: string;
}

export interface SellEnquiry {
  id: string;
  enquiryReference: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string | null;
  carMakeModel: string;
  registrationYear: number;
  registrationState?: string | null;
  kilometres: number;
  fuelType: FuelType;
  expectedPrice: number;
  description?: string | null;
  photos: string[];
  status: SellEnquiryStatus;
  adminNotes?: string | null;
  createdAt: string;
}

export interface DashboardStats {
  totalCars: number;
  availableCars: number;
  bookedCars: number;
  carsInRepair: number;
  pendingBookings: number;
  approvedBookings: number;
  pendingServiceRequests: number;
  newSellEnquiries: number;
  activeRepairs: number;
}

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: string;
}