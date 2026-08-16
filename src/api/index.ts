import client, { setAuthToken, getAuthToken, setAuthUser, getAuthUser, clearAuthUser } from './client';
import mockData from '../services/mockData';

// Feature flag: if USE_MOCK=true (env or app.json) we'll fallback to mock data on errors.
import Constants from 'expo-constants';
const manifest = Constants.manifest || (Constants as any).expoConfig || {};
const USE_MOCK = (manifest.extra && manifest.extra.useMock) === true || process.env.USE_MOCK === 'true' || false;

// Helper to unwrap axios responses
const unwrap = (res: any) => res && res.data ? res.data : res;

export async function login(email: string, password: string) {
  try {
    const res = await client.post('/auth/login', { email, password });
    const data = unwrap(res);
    // try common token fields
    const token = data?.token || data?.accessToken || data?.data?.token;
    const user = data?.user || data?.data || data?.result || null;
    if (token) await setAuthToken(token);
    if (user) await setAuthUser(user);
    return data;
  } catch (err) {
    if (USE_MOCK) {
      // return mock login response
      const mock = { token: 'mock-token-123', user: { id: 'u1', name: 'Mock User', role: 'PASSENGER', email } };
      await setAuthToken(mock.token);
      await setAuthUser(mock.user);
      return mock;
    }
    throw err;
  }
}

export async function logout() {
  await setAuthToken(null);
  await setAuthUser(null);
}

export async function getStoredAuth() {
  const token = await getAuthToken();
  const user = await getAuthUser();
  return { token, user };
}

export async function fetchTrips() {
  // Try GET /tripRoute first; if not available try /tripRoute/my-trips; fallback to mock on error
  try {
    const res = await client.get('/tripRoute');
    return unwrap(res);
  } catch (err: any) {
    // If server returns 404/405 or endpoint missing, try my-trips
    const status = err?.response?.status;
    if (status === 404 || status === 405 || status === 501) {
      try {
        const res2 = await client.get('/tripRoute/my-trips');
        return unwrap(res2);
      } catch (err2) {
        if (USE_MOCK) return mockData.trips;
        throw err2;
      }
    }
    if (USE_MOCK) return mockData.trips;
    throw err;
  }
}

export async function fetchTripById(id: string) {
  try {
    const res = await client.get(`/tripRoute/${id}`);
    return unwrap(res);
  } catch (err) {
    if (USE_MOCK) return mockData.trips.find(t => t.id === id) || null;
    throw err;
  }
}

export async function createTrip(payload: any) {
  try {
    const res = await client.post('/tripRoute/create', payload);
    return unwrap(res);
  } catch (err) {
    if (USE_MOCK) return { ok: true, created: payload };
    throw err;
  }
}

export async function deleteTrip(id: string) {
  try {
    const res = await client.delete(`/tripRoute/${id}`);
    return unwrap(res);
  } catch (err) {
    if (USE_MOCK) return { ok: true, id };
    throw err;
  }
}

export async function getMyTrips() {
  try {
    const res = await client.get('/tripRoute/my-trips');
    return unwrap(res);
  } catch (err) {
    if (USE_MOCK) return mockData.trips;
    throw err;
  }
}

export async function bookTrip(payload: { tripId: string; passengerId?: string; seatsBooked: number }) {
  try {
    // If passengerId is omitted, backend should use token to determine passenger
    const res = await client.post('/tripBookedRoute/tripBooked', payload);
    return unwrap(res);
  } catch (err) {
    if (USE_MOCK) return { ok: true, booking: payload };
    throw err;
  }
}

export async function getAllBookings() {
  try {
    const res = await client.get('/tripBookedRoute');
    return unwrap(res);
  } catch (err) {
    if (USE_MOCK) return [];
    throw err;
  }
}

export async function getAllDrivers() {
  try {
    const res = await client.get('/user/drivers');
    return unwrap(res);
  } catch (err) {
    if (USE_MOCK) return mockData.drivers;
    throw err;
  }
}

export async function getAllPassengers() {
  try {
    const res = await client.get('/user/passengers');
    return unwrap(res);
  } catch (err) {
    if (USE_MOCK) return [];
    throw err;
  }
}

export async function completeRegistration(formData: any) {
  try {
    const res = await client.post('/user/complete-registration', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return unwrap(res);
  } catch (err) {
    if (USE_MOCK) return { ok: true };
    throw err;
  }
}

export default {
  login,
  logout,
  getStoredAuth,
  fetchTrips,
  fetchTripById,
  createTrip,
  deleteTrip,
  getMyTrips,
  bookTrip,
  getAllBookings,
  getAllDrivers,
  getAllPassengers,
  completeRegistration
};
