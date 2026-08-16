import axios from 'axios';
import Constants from 'expo-constants';
import * as SecureStore from 'expo-secure-store';

const manifest = Constants.manifest || (Constants as any).expoConfig || {};
const BASE_URL = process.env.EXPO_PUBLIC_API_URL || manifest.extra?.apiUrl || 'http://72.61.225.177:5001';

const AUTH_KEY = 'AUTH_TOKEN_V1';
const AUTH_USER_KEY = 'AUTH_USER_V1';

const client = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json'
  }
});

export async function setAuthToken(token: string | null) {
  if (token) {
    client.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    await SecureStore.setItemAsync(AUTH_KEY, token);
  } else {
    delete client.defaults.headers.common['Authorization'];
    await SecureStore.deleteItemAsync(AUTH_KEY);
  }
}

export async function getAuthToken(): Promise<string | null> {
  try {
    const t = await SecureStore.getItemAsync(AUTH_KEY);
    if (t) client.defaults.headers.common['Authorization'] = `Bearer ${t}`;
    return t;
  } catch (e) {
    return null;
  }
}

export async function clearAuthToken() {
  delete client.defaults.headers.common['Authorization'];
  await SecureStore.deleteItemAsync(AUTH_KEY);
}

export async function setAuthUser(user: any | null) {
  if (user) {
    await SecureStore.setItemAsync(AUTH_USER_KEY, JSON.stringify(user));
  } else {
    await SecureStore.deleteItemAsync(AUTH_USER_KEY);
  }
}

export async function getAuthUser(): Promise<any | null> {
  try {
    const json = await SecureStore.getItemAsync(AUTH_USER_KEY);
    if (json) return JSON.parse(json);
    return null;
  } catch (e) {
    return null;
  }
}

export async function clearAuthUser() {
  await SecureStore.deleteItemAsync(AUTH_USER_KEY);
}

export default client;
