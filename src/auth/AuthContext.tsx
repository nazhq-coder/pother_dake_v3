import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '../types';
import repository from '../repository';
import * as SecureStore from 'expo-secure-store';

interface AuthContextType {
  user: User | null;
  token: string | null;
  tokenLoaded: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  setAuthUser: (user: User | null) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

const AUTH_KEY = 'AUTH_TOKEN_V1';
const AUTH_USER_KEY = 'AUTH_USER_V1';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [tokenLoaded, setTokenLoaded] = useState(false);

  // Load stored auth on app startup
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const storedToken = await SecureStore.getItemAsync(AUTH_KEY);
        const storedUserJson = await SecureStore.getItemAsync(AUTH_USER_KEY);
        
        if (mounted) {
          if (storedToken) setToken(storedToken);
          if (storedUserJson) {
            try {
              setUser(JSON.parse(storedUserJson));
            } catch (e) {
              // ignore parse error
            }
          }
        }
      } catch (e) {
        // ignore secure store errors
      } finally {
        if (mounted) setTokenLoaded(true);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const result = await repository.login(email, password);
      
      // Store token and user
      await SecureStore.setItemAsync(AUTH_KEY, result.token);
      await SecureStore.setItemAsync(AUTH_USER_KEY, JSON.stringify(result.user));
      
      setToken(result.token);
      setUser(result.user);
    } catch (err) {
      throw err;
    }
  };

  const logout = async () => {
    try {
      await repository.logout();
      await SecureStore.deleteItemAsync(AUTH_KEY);
      await SecureStore.deleteItemAsync(AUTH_USER_KEY);
      setToken(null);
      setUser(null);
    } catch (err) {
      throw err;
    }
  };

  const setAuthUser = (newUser: User | null) => {
    setUser(newUser);
    if (newUser) {
      SecureStore.setItemAsync(AUTH_USER_KEY, JSON.stringify(newUser)).catch(() => {});
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, tokenLoaded, login, logout, setAuthUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
