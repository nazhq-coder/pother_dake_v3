/**
 * Mock Data Source Implementation
 * Provides all data operations using in-memory mock data
 * No network calls, suitable for offline development/testing
 */

import { Trip, Booking, User, Driver, Passenger } from '../types';
import { IDataSource } from './Repository';
import mockDataStore from '../services/mockDataStore';

// In-memory storage for state changes during session
let mockTrips = JSON.parse(JSON.stringify(mockDataStore.trips));
let mockBookings: Booking[] = [];
let mockUsers = JSON.parse(JSON.stringify(mockDataStore.passengers));

class MockDataSource implements IDataSource {
  async fetchTrips(): Promise<Trip[]> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return JSON.parse(JSON.stringify(mockTrips));
  }

  async fetchTripById(id: string): Promise<Trip | null> {
    await new Promise(resolve => setTimeout(resolve, 300));
    const trip = mockTrips.find((t: Trip) => t.id === id);
    return trip ? JSON.parse(JSON.stringify(trip)) : null;
  }

  async createTrip(tripData: Omit<Trip, 'id' | 'createdAt'>): Promise<Trip> {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const newTrip: Trip = {
      ...tripData,
      id: `trip-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };

    mockTrips.push(newTrip);
    return JSON.parse(JSON.stringify(newTrip));
  }

  async updateTrip(id: string, updates: Partial<Trip>): Promise<Trip> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const index = mockTrips.findIndex((t: Trip) => t.id === id);
    if (index === -1) throw new Error('Trip not found');

    mockTrips[index] = { ...mockTrips[index], ...updates };
    return JSON.parse(JSON.stringify(mockTrips[index]));
  }

  async deleteTrip(id: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const index = mockTrips.findIndex((t: Trip) => t.id === id);
    if (index === -1) throw new Error('Trip not found');
    
    mockTrips.splice(index, 1);
  }

  async bookTrip(tripId: string, passengerId: string, seatsBooked: number): Promise<Booking> {
    await new Promise(resolve => setTimeout(resolve, 400));

    const trip = mockTrips.find((t: Trip) => t.id === tripId);
    if (!trip) throw new Error('Trip not found');

    if (trip.availableSeats < seatsBooked) {
      throw new Error('Not enough seats available');
    }

    // Check if passenger already booked
    const existing = trip.passengers.find(b => b.passengerId === passengerId);
    if (existing) {
      throw new Error('Passenger already booked on this trip');
    }

    const booking: Booking = {
      id: `booking-${Date.now()}`,
      tripId,
      passengerId,
      seatsBooked,
      status: 'CONFIRMED',
      bookingDate: new Date().toISOString(),
      paymentStatus: 'PAID',
    };

    // Update trip availability
    trip.availableSeats -= seatsBooked;
    trip.passengers.push(booking);
    
    mockBookings.push(booking);
    return JSON.parse(JSON.stringify(booking));
  }

  async getBookings(passengerId?: string): Promise<Booking[]> {
    await new Promise(resolve => setTimeout(resolve, 300));

    let bookings = mockBookings;
    if (passengerId) {
      bookings = bookings.filter(b => b.passengerId === passengerId);
    }
    
    return JSON.parse(JSON.stringify(bookings));
  }

  async cancelBooking(bookingId: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 300));

    const bookingIndex = mockBookings.findIndex(b => b.id === bookingId);
    if (bookingIndex === -1) throw new Error('Booking not found');

    const booking = mockBookings[bookingIndex];
    const trip = mockTrips.find((t: Trip) => t.id === booking.tripId);
    
    if (trip) {
      trip.availableSeats += booking.seatsBooked;
      const tripBookingIndex = trip.passengers.findIndex(b => b.id === bookingId);
      if (tripBookingIndex !== -1) {
        trip.passengers.splice(tripBookingIndex, 1);
      }
    }

    mockBookings.splice(bookingIndex, 1);
  }

  async getUser(id: string): Promise<User | null> {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    let user = mockUsers.find((u: User) => u.id === id);
    if (!user) {
      user = mockDataStore.drivers.find(d => d.id === id);
    }
    if (!user && id === mockDataStore.admin.id) {
      user = mockDataStore.admin;
    }

    return user ? JSON.parse(JSON.stringify(user)) : null;
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User> {
    await new Promise(resolve => setTimeout(resolve, 300));

    let userIndex = mockUsers.findIndex((u: User) => u.id === id);
    if (userIndex !== -1) {
      mockUsers[userIndex] = { ...mockUsers[userIndex], ...updates };
      return JSON.parse(JSON.stringify(mockUsers[userIndex]));
    }

    throw new Error('User not found');
  }

  async getDrivers(): Promise<Driver[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return JSON.parse(JSON.stringify(mockDataStore.drivers));
  }

  async getDriverById(id: string): Promise<Driver | null> {
    await new Promise(resolve => setTimeout(resolve, 200));
    const driver = mockDataStore.drivers.find(d => d.id === id);
    return driver ? JSON.parse(JSON.stringify(driver)) : null;
  }

  async getPassengers(): Promise<Passenger[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return JSON.parse(JSON.stringify(mockDataStore.passengers));
  }

  async getPassengerById(id: string): Promise<Passenger | null> {
    await new Promise(resolve => setTimeout(resolve, 200));
    const passenger = mockDataStore.passengers.find(p => p.id === id);
    return passenger ? JSON.parse(JSON.stringify(passenger)) : null;
  }

  async login(email: string, password: string): Promise<{ user: User; token: string }> {
    await new Promise(resolve => setTimeout(resolve, 600));

    // Mock authentication: accept any email/password for demo
    // In production, this would validate against backend
    const passenger = mockDataStore.passengers.find(p => p.email.toLowerCase() === email.toLowerCase());
    if (passenger) {
      return {
        user: JSON.parse(JSON.stringify(passenger)),
        token: `mock-token-${passenger.id}-${Date.now()}`,
      };
    }

    const driver = mockDataStore.drivers.find(d => d.email.toLowerCase() === email.toLowerCase());
    if (driver) {
      return {
        user: JSON.parse(JSON.stringify(driver)),
        token: `mock-token-${driver.id}-${Date.now()}`,
      };
    }

    // Fallback: create a demo user
    const demoUser: Passenger = {
      id: `user-${Date.now()}`,
      name: email.split('@')[0],
      email,
      phone: '+8801700000000',
      role: 'PASSENGER',
      avatar: '👤',
      rating: 4.5,
      totalBookings: 0,
    };

    return {
      user: demoUser,
      token: `mock-token-${demoUser.id}-${Date.now()}`,
    };
  }

  async logout(): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 200));
    // Mock logout: just clear session data if needed
  }
}

export default MockDataSource;
