/**
 * Repository Base Class & Interface
 * Defines the contract for data sources (Mock or API)
 */

import { Trip, Booking, User, Driver, Passenger } from '../types';

export interface IDataSource {
  // Authentication
  login(email: string, password: string): Promise<{ user: User; token: string }>;
  logout(): Promise<void>;

  // User/Profile operations
  getUser(id: string): Promise<User | null>;
  updateUser(id: string, updates: Partial<User>): Promise<User>;
  getDrivers(): Promise<Driver[]>;
  getDriverById(id: string): Promise<Driver | null>;
  getPassengers(): Promise<Passenger[]>;
  getPassengerById(id: string): Promise<Passenger | null>;

  // Trip operations
  fetchTrips(): Promise<Trip[]>;
  fetchTripById(id: string): Promise<Trip | null>;
  createTrip(tripData: Omit<Trip, 'id' | 'createdAt'>): Promise<Trip>;
  updateTrip(id: string, updates: Partial<Trip>): Promise<Trip>;
  deleteTrip(id: string): Promise<void>;

  // Booking operations
  bookTrip(tripId: string, passengerId: string, seatsBooked: number): Promise<Booking>;
  getBookings(passengerId?: string): Promise<Booking[]>;
  cancelBooking(bookingId: string): Promise<void>;

  // Optional admin helpers
  getCompletedTrips?(): Promise<Trip[]>;
}

/**
 * Repository wrapper
 * Delegates all operations to the underlying data source
 */
class Repository implements IDataSource {
  constructor(private dataSource: IDataSource) {}

  async login(email: string, password: string): Promise<{ user: User; token: string }> {
    return this.dataSource.login(email, password);
  }

  async logout(): Promise<void> {
    return this.dataSource.logout();
  }

  async getUser(id: string): Promise<User | null> {
    return this.dataSource.getUser(id);
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User> {
    return this.dataSource.updateUser(id, updates);
  }

  async getDrivers(): Promise<Driver[]> {
    return this.dataSource.getDrivers();
  }

  async getDriverById(id: string): Promise<Driver | null> {
    return this.dataSource.getDriverById(id);
  }

  async getPassengers(): Promise<Passenger[]> {
    return this.dataSource.getPassengers();
  }

  async getPassengerById(id: string): Promise<Passenger | null> {
    return this.dataSource.getPassengerById(id);
  }

  async fetchTrips(): Promise<Trip[]> {
    return this.dataSource.fetchTrips();
  }

  async fetchTripById(id: string): Promise<Trip | null> {
    return this.dataSource.fetchTripById(id);
  }

  async createTrip(tripData: Omit<Trip, 'id' | 'createdAt'>): Promise<Trip> {
    return this.dataSource.createTrip(tripData);
  }

  async updateTrip(id: string, updates: Partial<Trip>): Promise<Trip> {
    return this.dataSource.updateTrip(id, updates);
  }

  async deleteTrip(id: string): Promise<void> {
    return this.dataSource.deleteTrip(id);
  }

  async bookTrip(tripId: string, passengerId: string, seatsBooked: number): Promise<Booking> {
    return this.dataSource.bookTrip(tripId, passengerId, seatsBooked);
  }

  async getBookings(passengerId?: string): Promise<Booking[]> {
    return this.dataSource.getBookings(passengerId);
  }

  async cancelBooking(bookingId: string): Promise<void> {
    return this.dataSource.cancelBooking(bookingId);
  }

  async getCompletedTrips(): Promise<Trip[]> {
    // If the underlying data source implements getCompletedTrips, call it; otherwise return empty
    // @ts-ignore - optional method on IDataSource
    if (typeof (this.dataSource as any).getCompletedTrips === 'function') {
      // @ts-ignore
      return (this.dataSource as any).getCompletedTrips();
    }
    return [];
  }
}

export default Repository;
