import { PrismaClient, Role, FuelType, Transmission, VehicleStatus, SaleVehicleStatus, BookingStatus, ServiceStatus, RepairStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database with realistic Indian automotive business data...');

  // 1. Admin User
  const passwordHash = await bcrypt.hash('admin123', 10);
  await prisma.adminUser.upsert({
    where: { email: 'admin@carzz.com' },
    update: {},
    create: {
      email: 'admin@carzz.com',
      passwordHash,
      name: 'Rajinder Singh (Owner)',
      role: Role.ADMIN,
    },
  });
  console.log('Admin user seeded: admin@carzz.com / admin123');

  // 2. Rental Fleet
  const rentalVehicles = [
    {
      brand: 'Hyundai',
      model: 'Creta 1.5 SX(O)',
      slug: 'hyundai-creta-sx-o-2023',
      registrationNumber: 'UP 16 DX 4421',
      year: 2023,
      fuelType: FuelType.DIESEL,
      transmission: Transmission.AUTOMATIC,
      seats: 5,
      dailyRentalPrice: 2800,
      securityDeposit: 5000,
      description: 'Top-spec premium compact SUV with panoramic sunroof, ventilated front seats, Bose sound system, and smooth automatic transmission. Ideal for Delhi-Agra or Delhi-Jaipur highway drives.',
      features: ['Automatic AC', 'Sunroof', 'Touchscreen Infotainment', 'Cruise Control', 'Reverse Camera', 'Fastag Active'],
      images: [
        'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=1000&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=1000&auto=format&fit=crop&q=80',
      ],
      status: VehicleStatus.AVAILABLE,
      isFeatured: true,
    },
    {
      brand: 'Kia',
      model: 'Seltos HTX Plus',
      slug: 'kia-seltos-htx-plus-2023',
      registrationNumber: 'UP 16 CY 8892',
      year: 2023,
      fuelType: FuelType.DIESEL,
      transmission: Transmission.AUTOMATIC,
      seats: 5,
      dailyRentalPrice: 2900,
      securityDeposit: 5000,
      description: 'Modern sporty SUV equipped with high ground clearance, connected LED taillamps, rear reclining seats, and spacious boot space for outstation family trips.',
      features: ['Air Purifier', 'LED Headlamps', 'Wireless Charger', 'Fastag Active', 'Rear Sunshades'],
      images: [
        'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=1000&auto=format&fit=crop&q=80',
      ],
      status: VehicleStatus.AVAILABLE,
      isFeatured: true,
    },
    {
      brand: 'Maruti Suzuki',
      model: 'Ertiga ZXi Plus',
      slug: 'maruti-ertiga-zxi-plus-2022',
      registrationNumber: 'DL 8C AB 1234',
      year: 2022,
      fuelType: FuelType.CNG,
      transmission: Transmission.MANUAL,
      seats: 7,
      dailyRentalPrice: 2400,
      securityDeposit: 4000,
      description: 'Economical and super comfortable 7-seater MPV with dual factory-fitted CNG kit. Outstanding mileage for local group travel and pilgrimage tours to Haridwar/Vrindavan.',
      features: ['7 Seats', 'Dual Airbags', 'Smart Hybrid', 'Rear AC Vents', 'Factory CNG'],
      images: [
        'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=1000&auto=format&fit=crop&q=80',
      ],
      status: VehicleStatus.AVAILABLE,
      isFeatured: true,
    },
    {
      brand: 'Toyota',
      model: 'Innova Crysta 2.4 ZX',
      slug: 'toyota-innova-crysta-zx-2021',
      registrationNumber: 'HR 26 DQ 5501',
      year: 2021,
      fuelType: FuelType.DIESEL,
      transmission: Transmission.MANUAL,
      seats: 7,
      dailyRentalPrice: 4200,
      securityDeposit: 8000,
      description: 'The undisputed king of long-distance comfort in India. Captain seats, chilled automatic climate control, immense luggage room, and unmatched highway stability.',
      features: ['Captain Seats', 'Leather Upholstery', 'Dual Zone Climate', 'Rear Armrests', 'Heavy-Duty Suspension'],
      images: [
        'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1000&auto=format&fit=crop&q=80',
      ],
      status: VehicleStatus.AVAILABLE,
      isFeatured: true,
    },
    {
      brand: 'Maruti Suzuki',
      model: 'Swift ZXi',
      slug: 'maruti-swift-zxi-2023',
      registrationNumber: 'UP 16 FZ 9012',
      year: 2023,
      fuelType: FuelType.PETROL,
      transmission: Transmission.MANUAL,
      seats: 5,
      dailyRentalPrice: 1600,
      securityDeposit: 3000,
      description: 'Compact, punchy, and effortless to park in bustling Delhi NCR traffic. Great fuel efficiency with modern push-button start and touchscreen infotainment.',
      features: ['Touchscreen', 'Keyless Entry', 'Fog Lamps', 'Alloy Wheels', 'Power Steering'],
      images: [
        'https://images.unsplash.com/photo-1590362891991-f776e747a588?w=1000&auto=format&fit=crop&q=80',
      ],
      status: VehicleStatus.AVAILABLE,
      isFeatured: false,
    },
    {
      brand: 'Tata',
      model: 'Nexon EV Empowered',
      slug: 'tata-nexon-ev-empowered-2023',
      registrationNumber: 'DL 1E AA 7788',
      year: 2023,
      fuelType: FuelType.ELECTRIC,
      transmission: Transmission.AUTOMATIC,
      seats: 5,
      dailyRentalPrice: 2600,
      securityDeposit: 5000,
      description: 'Clean zero-emission driving with 320+ km realistic range. Ultra quiet drive with instant torque and complimentary fast charging at our Noida hub.',
      features: ['Full Digital Cockpit', 'Fast Charging Cable Included', 'Sunroof', 'Regenerative Braking', 'Silent Ride'],
      images: [
        'https://images.unsplash.com/photo-1563720223185-11003d516935?w=1000&auto=format&fit=crop&q=80',
      ],
      status: VehicleStatus.AVAILABLE,
      isFeatured: false,
    },
    {
      brand: 'Honda',
      model: 'City 1.5 VX',
      slug: 'honda-city-vx-2022',
      registrationNumber: 'UP 16 EQ 3410',
      year: 2022,
      fuelType: FuelType.PETROL,
      transmission: Transmission.AUTOMATIC,
      seats: 5,
      dailyRentalPrice: 2500,
      securityDeposit: 5000,
      description: 'Executive sedan with ultra-smooth CVT automatic gearbox, plush rear seat legroom, and refined i-VTEC engine. Perfect for corporate travel and weddings.',
      features: ['Sunroof', 'CVT Gearbox', 'Paddle Shifters', 'Rear Sunshade', 'Cruise Control'],
      images: [
        'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=1000&auto=format&fit=crop&q=80',
      ],
      status: VehicleStatus.AVAILABLE,
      isFeatured: false,
    },
    {
      brand: 'Mahindra',
      model: 'Scorpio-N Z8L 4WD',
      slug: 'mahindra-scorpio-n-z8l-2023',
      registrationNumber: 'HR 26 EX 1122',
      year: 2023,
      fuelType: FuelType.DIESEL,
      transmission: Transmission.AUTOMATIC,
      seats: 7,
      dailyRentalPrice: 3800,
      securityDeposit: 7000,
      description: 'Commanding road presence with true 4x4 offroad capability. Built for mountain journeys to Shimla, Manali, and Rishikesh with Sony 3D surround sound.',
      features: ['4x4 Terrain Modes', 'Sony 12-Speaker Sound', 'Sunroof', 'Captain Seats', 'Heavy-Duty Ground Clearance'],
      images: [
        'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=1000&auto=format&fit=crop&q=80',
      ],
      status: VehicleStatus.AVAILABLE,
      isFeatured: false,
    },
  ];

  for (const v of rentalVehicles) {
    await prisma.vehicle.upsert({
      where: { registrationNumber: v.registrationNumber },
      update: {},
      create: v,
    });
  }
  console.log('Seeded 8 rental fleet vehicles');

  // 3. Certified Pre-Owned Cars for Sale
  const saleVehicles = [
    {
      brand: 'Hyundai',
      model: 'Venue 1.0 Turbo SX+ DCT',
      slug: 'hyundai-venue-sx-dct-2021',
      year: 2021,
      registrationYear: 2021,
      kilometres: 38000,
      fuelType: FuelType.PETROL,
      transmission: Transmission.AUTOMATIC,
      ownership: 1,
      price: 845000,
      location: 'Noida Hub (Sector 63)',
      insuranceValidity: 'Comprehensive valid till Dec 2026',
      description: 'Single-owner, non-accidental Hyundai Venue in immaculate condition. Fully serviced at authorized Hyundai workshop with digital service history. New tyres installed at 35,000 km.',
      features: ['Sunroof', 'Dual Tone Roof', 'Wireless Charger', 'Paddle Shifters', 'Clean Service Records'],
      images: [
        'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800&auto=format&fit=crop&q=80',
      ],
      status: SaleVehicleStatus.AVAILABLE,
    },
    {
      brand: 'Honda',
      model: 'Amaze 1.2 VX Petrol MT',
      slug: 'honda-amaze-vx-2020',
      year: 2020,
      registrationYear: 2020,
      kilometres: 42000,
      fuelType: FuelType.PETROL,
      transmission: Transmission.MANUAL,
      ownership: 1,
      price: 590000,
      location: 'Noida Hub (Sector 63)',
      insuranceValidity: 'Zero Dep insurance valid till Nov 2026',
      description: 'Reliable family compact sedan with roomy 420-litre boot and excellent city mileage. 120-point mechanical inspection passed with 100% score on engine compression.',
      features: ['Touchscreen', 'Alloy Wheels', 'Rear Camera', 'Fog Lamps', 'Push Button Start'],
      images: [
        'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=800&auto=format&fit=crop&q=80',
      ],
      status: SaleVehicleStatus.AVAILABLE,
    },
    {
      brand: 'Kia',
      model: 'Sonet 1.5 HTX Diesel AT',
      slug: 'kia-sonet-htx-diesel-at-2022',
      year: 2022,
      registrationYear: 2022,
      kilometres: 29000,
      fuelType: FuelType.DIESEL,
      transmission: Transmission.AUTOMATIC,
      ownership: 1,
      price: 1075000,
      location: 'Noida Hub (Sector 63)',
      insuranceValidity: 'Valid till March 2027',
      description: 'High performance 1.5 CRDi diesel automatic delivering 19 kmpl on highways. Extended warranty valid until 2027. Showroom condition paint and interior.',
      features: ['Ventilated Seats', 'Sunroof', 'LED DRLs', 'Cruise Control', 'Traction Control'],
      images: [
        'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=800&auto=format&fit=crop&q=80',
      ],
      status: SaleVehicleStatus.AVAILABLE,
    },
  ];

  for (const s of saleVehicles) {
    await prisma.saleVehicle.upsert({
      where: { slug: s.slug },
      update: {},
      create: s,
    });
  }
  console.log('Seeded 3 certified used cars for sale');
}

main()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });