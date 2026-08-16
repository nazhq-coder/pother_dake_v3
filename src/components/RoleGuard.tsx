import React from 'react';
import { Alert } from 'react-native';
import { useAuth } from '../auth/AuthContext';

// allowedRoles: array of strings e.g. ['DRIVER']
export default function RoleGuard(allowedRoles: string[], Component: React.ComponentType<any>) {
  return function Guarded(props: any) {
    const { user, tokenLoaded } = useAuth();

    // while token/user is loading, render null to avoid flicker
    if (!tokenLoaded) return null;

    const role = user?.role?.toUpperCase?.() || null;

    if (!user) {
      // not logged in — redirect to Auth
      props.navigation?.navigate?.('Auth');
      return null;
    }

    if (allowedRoles.includes(role)) {
      return <Component {...props} />;
    }

    // user not allowed — send them to their dashboard
    const goTo = role === 'DRIVER' ? 'Driver' : role === 'PASSENGER' ? 'Passenger' : role === 'ADMIN' ? 'Admin' : 'Landing';
    Alert.alert('Access denied', 'You do not have access to this area. Redirecting to your dashboard.');
    props.navigation?.navigate?.(goTo);
    return null;
  };
}
