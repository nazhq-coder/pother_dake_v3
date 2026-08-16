/**
 * Central type definitions for Pother Dake Mobile
 */

export interface Location {
  name: string;
  latitude: number;
  longitude: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  role: 'PASSENGER' | 'DRIVER' | 'ADMIN';
  rating?: number;
  completedRides?: number;
  joinedDate?: string;
}

export interface Driver extends User {
  vehicleType?: string;
  vehicleColor?: string;
  vehicleNumber?: string;
  licenseNumber?: string;
  totalTrips?: number;
}

export interface Passenger extends User {
  preferredPaymentMethod?: string;
  totalBookings?: number;
}

export interface Trip {
  id: string;
  driverId: string;
  driver: Driver;
  origin: Location;
  destination: Location;
  departureDate: string; // YYYY-MM-DD
  departureTime: string; // HH:MM
  estimatedArrivalTime?: string; // HH:MM
  totalSeats: number;
  availableSeats: number;
  pricePerSeat: number;
  status: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  description?: string;
  vehicleType?: string;
  preferences?: {
    ac?: boolean;
    music?: boolean;
    luggage?: boolean;
    pets?: boolean;
    smoking?: boolean;
    helmet?: boolean;
    womenOnly?: boolean;
    maxLuggageWeight?: number;
  };
  createdAt: string;
  passengers: Booking[];
}

export interface Booking {
  id: string;
  tripId: string;
  passengerId: string;
  passenger?: Passenger;
  seatsBooked: number;
  status: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';
  bookingDate: string;
  paymentStatus?: 'PENDING' | 'PAID' | 'FAILED';
}

export interface AuthState {
  user: User | null;
  token: string | null;
  tokenLoaded: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
