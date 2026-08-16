import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../auth/AuthContext';
import { ActivityIndicator, View } from 'react-native';

// Auth Screens
import AuthScreen from '../screens/Auth';
import CompleteRegistration from '../screens/CompleteRegistration';

// App Screens
import LandingScreen from '../screens/Landing';
import SearchResults from '../screens/SearchResults';
import TripDetails from '../screens/TripDetails';
import PassengerDashboard from '../screens/PassengerDashboard';
import DriverDashboard from '../screens/DriverDashboard';
import AdminDashboard from '../screens/AdminDashboard';
import CreateTrip from '../screens/CreateTrip';
import ProfileScreen from '../screens/Profile';
import BookingHistoryScreen from '../screens/BookingHistory';
import MyTripsScreen from '../screens/MyTrips';

export type RootStackParamList = {
  // Auth
  Auth: undefined;
  CompleteRegistration: undefined;
  // App
  Landing: undefined;
  Search: undefined;
  TripDetails: { id?: string };
  Passenger: undefined;
  Driver: undefined;
  Admin: undefined;
  CreateTrip: undefined;
  Profile: undefined;
  BookingHistory: undefined;
  MyTrips: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

function AuthNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Auth"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Auth" component={AuthScreen} />
      <Stack.Screen name="CompleteRegistration" component={CompleteRegistration} />
    </Stack.Navigator>
  );
}

function AppNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Landing"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Landing" component={LandingScreen} />
      <Stack.Screen name="Search" component={SearchResults} />
      <Stack.Screen name="TripDetails" component={TripDetails} />
      <Stack.Screen name="Passenger" component={PassengerDashboard} />
      <Stack.Screen name="Driver" component={DriverDashboard} />
      <Stack.Screen name="Admin" component={AdminDashboard} />
      <Stack.Screen name="CreateTrip" component={CreateTrip} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="BookingHistory" component={BookingHistoryScreen} />
      <Stack.Screen name="MyTrips" component={MyTripsScreen} />
    </Stack.Navigator>
  );
}

export default function RootNavigator() {
  const { user, tokenLoaded } = useAuth();

  if (!tokenLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>n        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  return user ? <AppNavigator /> : <AuthNavigator />;
}
