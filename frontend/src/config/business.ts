export const BUSINESS_NAME = 'AutoDrive Rentals & Services';
export const BUSINESS_TAGLINE = 'Reliable Cars. Simple Rentals.';
export const BUSINESS_PHONE = '+91 98112 34567';
export const BUSINESS_PHONE_RAW = '9811234567';
export const WHATSAPP_NUMBER = '919811234567';
export const BUSINESS_EMAIL = 'contact@autodrivecars.in';
export const BUSINESS_ADDRESS = 'Plot 42, Auto Hub Complex, Sector 63, Noida, Uttar Pradesh 201301';
export const GOOGLE_MAPS_URL = 'https://maps.google.com/?q=Sector+63+Noida+Uttar+Pradesh';
export const BUSINESS_HOURS = 'Monday – Sunday: 8:00 AM – 9:00 PM';

export const BUSINESS_CONFIG = {
  name: BUSINESS_NAME,
  tagline: BUSINESS_TAGLINE,
  phone: BUSINESS_PHONE,
  phoneRaw: BUSINESS_PHONE_RAW,
  whatsappNumber: WHATSAPP_NUMBER,
  email: BUSINESS_EMAIL,
  address: BUSINESS_ADDRESS,
  googleMapsUrl: GOOGLE_MAPS_URL,
  workingHours: BUSINESS_HOURS,
};

export function getWhatsAppUrl(message: string): string {
  return 'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(message);
}

export function getWhatsAppRentalUrl(carName: string, pickupDate?: string, returnDate?: string): string {
  if (pickupDate && returnDate) {
    return getWhatsAppUrl('Hello, I would like to enquire about renting the ' + carName + ' from ' + pickupDate + ' to ' + returnDate + '. Is it available?');
  }
  return getWhatsAppUrl('Hello, I would like to check availability and rental rates for the ' + carName + '.');
}

export function getWhatsAppBuyCarUrl(carName: string, price?: number): string {
  return getWhatsAppUrl('Hello, I am interested in purchasing the certified ' + carName + (price ? ' listed for ' + formatCurrency(price) : '') + '. Can I schedule an inspection / test drive?');
}

export function getWhatsAppSellCarUrl(carModel: string): string {
  return getWhatsAppUrl('Hello, I would like to sell my ' + carModel + '. Can you provide an inspection and valuation estimate?');
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatINR(amount: number): string {
  return formatCurrency(amount);
}

export function formatIndianKm(km: number): string {
  return new Intl.NumberFormat('en-IN').format(km) + ' km';
}

export function formatIndianDate(dateStr: string | Date): string {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}