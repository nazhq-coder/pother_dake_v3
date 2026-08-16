// Mock data module — replaces live API calls in this frontend demo.
// In production these are served from the Node/Express backend with Prisma + PostgreSQL.
// For details: Shahriyar Sumon (LinkedIn: linkedin.com/in/shahriyarsumon)

// Supported intercity departure cities across Bangladesh
export const bangladeshCities = [
  "Dhaka", "Chittagong", "Sylhet", "Rajshahi", "Khulna",
  "Barisal", "Rangpur", "Mymensingh", "Comilla", "Cox's Bazar",
  "Narayanganj", "Gazipur", "Jessore", "Bogra", "Dinajpur",
  "Tangail", "Feni", "Noakhali", "Brahmanbaria", "Habiganj"
];

// High-traffic corridors shown on the landing page — ranked by booking volume
export const popularRoutes = [
  { from: "Dhaka", to: "Chittagong", price: 350, duration: "4h 30m", trips: 145, km: 264 },
  { from: "Dhaka", to: "Sylhet", price: 280, duration: "4h", trips: 98, km: 240 },
  { from: "Dhaka", to: "Rajshahi", price: 320, duration: "5h", trips: 76, km: 290 },
  { from: "Chittagong", to: "Cox's Bazar", price: 200, duration: "3h", trips: 112, km: 152 },
  { from: "Dhaka", to: "Khulna", price: 400, duration: "6h", trips: 54, km: 330 },
  { from: "Dhaka", to: "Barisal", price: 350, duration: "5h", trips: 43, km: 260 },
];

// --- Type Definitions ---
// Proprietary source — keep in sync with the Prisma schema on the backend

export type VehicleType = "bike" | "car" | "microbus";

export interface Driver {
  id: string;
  name: string;
  photo: string;
  rating: number;
  reviews: number;
  totalTrips: number;
  verified: boolean;
  joinYear: number;
  bio: string;
  vehicle: {
    type: VehicleType;
    model: string;
    color: string;
    plate: string;
    year: number;
  };
  badges: string[];
  ratings: {
    safety: number;
    cleanliness: number;
    driving: number;
    communication: number;
    punctuality: number;
  };
}

export interface Trip {
  id: string;
  driver: Driver;
  from: string;
  to: string;
  stops: string[];
  date: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  pricePerSeat: number;
  seatsAvailable: number;
  totalSeats: number;
  vehicleType: VehicleType;
  amenities: {
    ac: boolean;
    music: boolean;
    smoking: boolean;
    pets: boolean;
    luggage: boolean;
    helmet: boolean;
    womenOnly: boolean;
  };
  instantBooking: boolean;
  description: string;
  status: "active" | "completed" | "cancelled";
  distance: string;
}

// Booking ties a passenger request to a specific trip + payment record
export interface Booking {
  id: string;
  tripId: string;
  from: string;
  to: string;
  date: string;
  driverName: string;
  driverPhoto: string;
  vehicleType: VehicleType;
  price: number;
  seats: number;
  status: "upcoming" | "completed" | "cancelled";
  qrCode?: string;
  paymentMethod: string;
}

/* Seed driver profiles — mix of bike, car, and microbus drivers.
   Avatars via DiceBear so no external image hosting is needed in dev. */
export const mockDrivers: Driver[] = [
  {
    id: "d1",
    name: "Rafiqul Islam",
    photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rafiqul&backgroundColor=b6e3f4",
    rating: 4.8,
    reviews: 234,
    totalTrips: 456,
    verified: true,
    joinYear: 2022,
    bio: "Professional driver with 5+ years intercity experience. Safety and punctuality are my top priorities.",
    vehicle: { type: "car", model: "Toyota Allion 2019", color: "Silver", plate: "ঢাকা মেট্রো-গ ১১-২৩৪৫", year: 2019 },
    badges: ["Top Rated", "Super Punctual", "5-Star Driver"],
    ratings: { safety: 4.9, cleanliness: 4.7, driving: 4.8, communication: 4.9, punctuality: 4.8 },
  },
  {
    id: "d2",
    name: "Mahbubur Rahman",
    photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mahbubur&backgroundColor=c0aede",
    rating: 4.6,
    reviews: 128,
    totalTrips: 213,
    verified: true,
    joinYear: 2023,
    bio: "Experienced biker covering Dhaka-Sylhet regularly. Your comfort is my responsibility.",
    vehicle: { type: "bike", model: "Honda CB Hornet 160R", color: "Red", plate: "ঢাকা মেট্রো-ক ৫-৭৮৯০", year: 2021 },
    badges: ["Biker Pro", "Helmet Always"],
    ratings: { safety: 4.7, cleanliness: 4.5, driving: 4.6, communication: 4.7, punctuality: 4.5 },
  },
  {
    id: "d3",
    name: "Sadia Akter",
    photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sadia&backgroundColor=ffd5dc",
    rating: 4.9,
    reviews: 312,
    totalTrips: 589,
    verified: true,
    joinYear: 2021,
    bio: "Female driver offering women-only rides. Making intercity travel safe and comfortable for women.",
    vehicle: { type: "car", model: "Toyota Vios 2020", color: "White", plate: "ঢাকা মেট্রো-চ ৩-১১২২", year: 2020 },
    badges: ["Women Only", "Top Rated", "Super Safe"],
    ratings: { safety: 5.0, cleanliness: 4.9, driving: 4.8, communication: 4.9, punctuality: 4.9 },
  },
  {
    id: "d4",
    name: "Kamal Hossain",
    photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=Kamal&backgroundColor=d1f4d1",
    rating: 4.5,
    reviews: 89,
    totalTrips: 134,
    verified: true,
    joinYear: 2023,
    bio: "Microbus driver for group travel. Perfect for families and groups of friends.",
    vehicle: { type: "microbus", model: "Toyota HiAce 2018", color: "White", plate: "চট্টগ্রাম মেট্রো-খ ৭-৩৩৪৫", year: 2018 },
    badges: ["Group Friendly", "Spacious Ride"],
    ratings: { safety: 4.5, cleanliness: 4.4, driving: 4.6, communication: 4.5, punctuality: 4.4 },
  },
  {
    id: "d5",
    name: "Tanvir Ahmed",
    photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=Tanvir&backgroundColor=ffeacc",
    rating: 4.7,
    reviews: 176,
    totalTrips: 298,
    verified: true,
    joinYear: 2022,
    bio: "Regular Dhaka-Chittagong traveler. I listen to what you want and make the journey enjoyable.",
    vehicle: { type: "car", model: "Honda Civic 2020", color: "Black", plate: "ঢাকা মেট্রো-ত ৯-৫৫৬৭", year: 2020 },
    badges: ["Music Lover", "AC Guaranteed", "Non-Smoker"],
    ratings: { safety: 4.8, cleanliness: 4.7, driving: 4.7, communication: 4.6, punctuality: 4.8 },
  },
];

// Sample trips covering major Bangladesh intercity corridors.
// Each trip references a driver from mockDrivers by object reference (not just ID).
export const mockTrips: Trip[] = [
  {
    id: "t1",
    driver: mockDrivers[0],
    from: "Dhaka",
    to: "Chittagong",
    stops: ["Comilla"],
    date: "2026-07-26",
    departureTime: "07:00 AM",
    arrivalTime: "11:30 AM",
    duration: "4h 30m",
    pricePerSeat: 350,
    seatsAvailable: 3,
    totalSeats: 4,
    vehicleType: "car",
    amenities: { ac: true, music: true, smoking: false, pets: false, luggage: true, helmet: false, womenOnly: false },
    instantBooking: true,
    description: "Comfortable AC ride. I stop at Comilla for 15 minutes for tea break.",
    status: "active",
    distance: "264 km",
  },
  {
    id: "t2",
    driver: mockDrivers[1],
    from: "Dhaka",
    to: "Sylhet",
    stops: [],
    date: "2026-07-26",
    departureTime: "08:30 AM",
    arrivalTime: "12:30 PM",
    duration: "4h",
    pricePerSeat: 280,
    seatsAvailable: 1,
    totalSeats: 1,
    vehicleType: "bike",
    amenities: { ac: false, music: false, smoking: false, pets: false, luggage: false, helmet: true, womenOnly: false },
    instantBooking: false,
    description: "Helmet provided. Experience the scenic Dhaka-Sylhet highway on a bike.",
    status: "active",
    distance: "240 km",
  },
  {
    id: "t3",
    driver: mockDrivers[2],
    from: "Dhaka",
    to: "Rajshahi",
    stops: ["Tangail"],
    date: "2026-07-27",
    departureTime: "06:00 AM",
    arrivalTime: "11:00 AM",
    duration: "5h",
    pricePerSeat: 320,
    seatsAvailable: 2,
    totalSeats: 4,
    vehicleType: "car",
    amenities: { ac: true, music: true, smoking: false, pets: false, luggage: true, helmet: false, womenOnly: true },
    instantBooking: true,
    description: "Women-only ride. Safe, comfortable, and enjoyable journey.",
    status: "active",
    distance: "290 km",
  },
  {
    id: "t4",
    driver: mockDrivers[3],
    from: "Chittagong",
    to: "Cox's Bazar",
    stops: [],
    date: "2026-07-26",
    departureTime: "09:00 AM",
    arrivalTime: "12:00 PM",
    duration: "3h",
    pricePerSeat: 200,
    seatsAvailable: 8,
    totalSeats: 10,
    vehicleType: "microbus",
    amenities: { ac: true, music: true, smoking: false, pets: false, luggage: true, helmet: false, womenOnly: false },
    instantBooking: true,
    description: "Group microbus trip to Cox's Bazar. Great for families and friend groups.",
    status: "active",
    distance: "152 km",
  },
  {
    id: "t5",
    driver: mockDrivers[4],
    from: "Dhaka",
    to: "Chittagong",
    stops: [],
    date: "2026-07-26",
    departureTime: "11:00 AM",
    arrivalTime: "03:30 PM",
    duration: "4h 30m",
    pricePerSeat: 400,
    seatsAvailable: 2,
    totalSeats: 3,
    vehicleType: "car",
    amenities: { ac: true, music: true, smoking: false, pets: false, luggage: true, helmet: false, womenOnly: false },
    instantBooking: false,
    description: "Premium ride with great music and conversation. Non-smoker friendly.",
    status: "active",
    distance: "264 km",
  },
  {
    id: "t6",
    driver: mockDrivers[0],
    from: "Dhaka",
    to: "Khulna",
    stops: ["Jessore"],
    date: "2026-07-28",
    departureTime: "07:30 AM",
    arrivalTime: "01:30 PM",
    duration: "6h",
    pricePerSeat: 450,
    seatsAvailable: 1,
    totalSeats: 4,
    vehicleType: "car",
    amenities: { ac: true, music: false, smoking: false, pets: true, luggage: true, helmet: false, womenOnly: false },
    instantBooking: true,
    description: "Pet-friendly ride to Khulna via Jessore. Spacious trunk for luggage.",
    status: "active",
    distance: "330 km",
  },
];

// Passenger-side booking history — status drives UI state in the dashboard
export const mockBookings: Booking[] = [
  {
    id: "b1",
    tripId: "t1",
    from: "Dhaka",
    to: "Chittagong",
    date: "2026-07-26",
    driverName: "Rafiqul Islam",
    driverPhoto: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rafiqul&backgroundColor=b6e3f4",
    vehicleType: "car",
    price: 350,
    seats: 1,
    status: "upcoming",
    paymentMethod: "bKash",
  },
  {
    id: "b2",
    tripId: "t3",
    from: "Dhaka",
    to: "Sylhet",
    date: "2026-07-10",
    driverName: "Sadia Akter",
    driverPhoto: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sadia&backgroundColor=ffd5dc",
    vehicleType: "car",
    price: 280,
    seats: 2,
    status: "completed",
    paymentMethod: "Nagad",
  },
  {
    id: "b3",
    tripId: "t2",
    from: "Dhaka",
    to: "Rajshahi",
    date: "2026-06-22",
    driverName: "Mahbubur Rahman",
    driverPhoto: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mahbubur&backgroundColor=c0aede",
    vehicleType: "bike",
    price: 320,
    seats: 1,
    status: "completed",
    paymentMethod: "bKash",
  },
];

// --- Admin Analytics Data ---
// These aggregate numbers feed the recharts dashboards.
// Internal implementation — real values pulled from a PostgreSQL aggregation query.
export const adminStats = {
  totalUsers: 48520,
  verifiedUsers: 41230,
  totalDrivers: 3842,
  activeDrivers: 1230,
  totalTrips: 128450,
  completedTrips: 119200,
  cancelledTrips: 9250,
  todayRevenue: 284500,
  monthlyRevenue: 8420000,
  totalRevenue: 96500000,
  platformCommission: 9650000,
  onlineUsers: 3420,
  pendingVerifications: 124,
  openComplaints: 38,
};

// Monthly revenue breakdown — used by AreaChart and BarChart in AdminDashboard
export const revenueData = [
  { month: "Jan", revenue: 5800000, commission: 580000, trips: 8900 },
  { month: "Feb", revenue: 6200000, commission: 620000, trips: 9500 },
  { month: "Mar", revenue: 7100000, commission: 710000, trips: 11200 },
  { month: "Apr", revenue: 6800000, commission: 680000, trips: 10400 },
  { month: "May", revenue: 7600000, commission: 760000, trips: 11900 },
  { month: "Jun", revenue: 8100000, commission: 810000, trips: 12800 },
  { month: "Jul", revenue: 8420000, commission: 842000, trips: 13400 },
];

// User + driver growth over time — rendered as a dual LineChart
export const userGrowthData = [
  { month: "Jan", users: 28000, drivers: 2100 },
  { month: "Feb", users: 31500, drivers: 2400 },
  { month: "Mar", users: 35200, drivers: 2700 },
  { month: "Apr", users: 38100, drivers: 3000 },
  { month: "May", users: 41000, drivers: 3300 },
  { month: "Jun", users: 44800, drivers: 3600 },
  { month: "Jul", users: 48520, drivers: 3842 },
];

// Flat user records for the admin table — searchable by name/phone/email
export const mockAdminUsers = [
  { id: "u1", name: "Rahim Uddin", phone: "+880 1711-234567", email: "rahim@email.com", status: "verified", trips: 23, joined: "Jan 2024", location: "Dhaka" },
  { id: "u2", name: "Nasrin Begum", phone: "+880 1722-345678", email: "nasrin@email.com", status: "verified", trips: 15, joined: "Mar 2024", location: "Chittagong" },
  { id: "u3", name: "Jamal Haque", phone: "+880 1733-456789", email: "jamal@email.com", status: "pending", trips: 0, joined: "Jul 2026", location: "Sylhet" },
  { id: "u4", name: "Fariha Islam", phone: "+880 1744-567890", email: "fariha@email.com", status: "suspended", trips: 8, joined: "Feb 2024", location: "Rajshahi" },
  { id: "u5", name: "Arif Khan", phone: "+880 1755-678901", email: "arif@email.com", status: "verified", trips: 41, joined: "Nov 2023", location: "Khulna" },
  { id: "u6", name: "Sumaiya Akter", phone: "+880 1766-789012", email: "sumaiya@email.com", status: "verified", trips: 19, joined: "Apr 2024", location: "Dhaka" },
];

// Driver records with verification status — pending ones surface in the approval queue
export const mockAdminDrivers = [
  { id: "d1", name: "Rafiqul Islam", phone: "+880 1712-345678", vehicle: "Toyota Allion", type: "Car", status: "approved", rating: 4.8, trips: 456, joined: "Jan 2022", earnings: 185000 },
  { id: "d2", name: "Mahbubur Rahman", phone: "+880 1722-456789", vehicle: "Honda CB Hornet", type: "Bike", status: "approved", rating: 4.6, trips: 213, joined: "Mar 2023", earnings: 72000 },
  { id: "d3", name: "Sadia Akter", phone: "+880 1733-567890", vehicle: "Toyota Vios", type: "Car", status: "approved", rating: 4.9, trips: 589, joined: "Feb 2021", earnings: 238000 },
  { id: "d4", name: "Kamal Hossain", phone: "+880 1744-678901", vehicle: "Toyota HiAce", type: "Microbus", status: "pending", rating: 0, trips: 0, joined: "Jul 2026", earnings: 0 },
  { id: "d5", name: "Tanvir Ahmed", phone: "+880 1755-789012", vehicle: "Honda Civic", type: "Car", status: "approved", rating: 4.7, trips: 298, joined: "Jun 2022", earnings: 134000 },
  { id: "d6", name: "Ruhul Amin", phone: "+880 1766-890123", vehicle: "Bajaj Pulsar", type: "Bike", status: "rejected", rating: 0, trips: 0, joined: "Jun 2026", earnings: 0 },
];

// Passenger reviews shown on the trip details page — limited to 4 for the preview
export const mockReviews = [
  { id: "r1", reviewer: "Nasrin B.", photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=Nasrin", rating: 5, comment: "Excellent driver! Very safe and punctual. The car was clean and AC was perfect. Will definitely book again.", date: "Jul 20, 2026" },
  { id: "r2", reviewer: "Arif K.", photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=Arif", rating: 5, comment: "Best intercity ride I have had. Driver was friendly and the journey was smooth. Highly recommended!", date: "Jul 15, 2026" },
  { id: "r3", reviewer: "Sumaiya A.", photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sumaiya", rating: 4, comment: "Good ride overall. The stop at Comilla was nice. Would prefer slightly more luggage space.", date: "Jul 10, 2026" },
  { id: "r4", reviewer: "Karim M.", photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=Karim", rating: 5, comment: "Driver was very professional. Arrived on time and the music was great. 10/10 experience!", date: "Jul 5, 2026" },
];
