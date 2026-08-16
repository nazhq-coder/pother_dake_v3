import styled from 'styled-components/native';
import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import Header from '../components/Header';
import { useAuth } from '../auth/AuthContext';
import repository from '../repository';
import { Trip } from '../types';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'TripDetails'>;

const Container = styled.View`
  flex: 1;
  background-color: ${p => p.theme.colors.background};
`;

const Content = styled.ScrollView`
  padding: 16px;
`;

const Card = styled.View`
  background-color: #fff;
  padding: 14px;
  border-radius: 8px;
  margin-bottom: 12px;
  border-width: 1px;
  border-color: #e5e7eb;
`;

const Title = styled.Text`
  font-size: 18px;
  font-weight: 700;
  color: ${p => p.theme.colors.primary};
  margin-bottom: 8px;
`;

const Subtitle = styled.Text`
  font-size: 14px;
  font-weight: 600;
  color: #4b5563;
  margin-bottom: 12px;
`;

const DetailRow = styled.View`
  flex-direction: row;
  margin-bottom: 8px;
`;

const DetailLabel = styled.Text`
  font-size: 13px;
  font-weight: 600;
  color: #6b7280;
  flex: 0.4;
`;

const DetailValue = styled.Text`
  font-size: 13px;
  color: #374151;
  flex: 0.6;
`;

const Button = styled.TouchableOpacity`
  background-color: #2563eb;
  padding: 14px;
  border-radius: 8px;
  align-items: center;
  margin-top: 12px;
`;

const ButtonText = styled.Text`
  color: #fff;
  font-weight: 700;
`;

const SeatsInput = styled.TextInput`
  border-width: 1px;
  border-color: #e5e7eb;
  padding: 10px;
  border-radius: 6px;
  background-color: #fff;
  width: 60px;
  text-align: center;
`;

const LoadingView = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const EmptyView = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const EmptyText = styled.Text`
  font-size: 16px;
  color: #9ca3af;
`;

export default function TripDetails({ route, navigation }: Props) {
  const { user } = useAuth();
  const id = route?.params?.id;
  const [trip, setTrip] = useState<Trip | null>(null);
  const [loading, setLoading] = useState(true);
  const [seats, setSeats] = useState('1');
  const [booking, setBooking] = useState(false);

  useEffect(() => {
    loadTrip();
  }, [id]);

  const loadTrip = async () => {
    try {
      setLoading(true);
      if (id) {
        const data = await repository.fetchTripById(id);
        setTrip(data);
      } else {
        const trips = await repository.fetchTrips();
        setTrip(trips[0] || null);
      }
    } catch (err: any) {
      Alert.alert('Error', err?.message || 'Failed to load trip');
    } finally {
      setLoading(false);
    }
  };

  const handleBook = async () => {
    if (!trip || !user) return;

    // Only passengers can book
    if (user.role !== 'PASSENGER') {
      Alert.alert('Error', 'Only passengers can book trips');
      return;
    }

    // Prevent booking own trip defensively
    if (trip.driverId === user.id) {
      Alert.alert('Error', 'You cannot book your own trip');
      return;
    }

    const seatsNum = parseInt(seats, 10) || 1;
    if (seatsNum < 1) {
      Alert.alert('Validation Error', 'Please select at least 1 seat');
      return;
    }
    if (seatsNum > trip.availableSeats) {
      Alert.alert('Error', `Only ${trip.availableSeats} seats available`);
      return;
    }

    setBooking(true);
    try {
      await repository.bookTrip(trip.id, user.id, seatsNum);
      // Refresh trip details to show updated seats
      await loadTrip();
      // Also ensure booking history shows new booking by navigating to BookingHistory
      Alert.alert('Success', 'Trip booked successfully!');
      navigation.navigate('BookingHistory');
    } catch (err: any) {
      const msg = err?.message || 'Failed to book trip';
      Alert.alert('Booking Error', String(msg));
    } finally {
      setBooking(false);
    }
  };

  if (loading) {
    return (
      <>
        <Header navigation={navigation} title="Trip Details" />
        <LoadingView>
          <ActivityIndicator size="large" color="#2563eb" />
        </LoadingView>
      </>
    );
  }

  if (!trip) {
    return (
      <>
        <Header navigation={navigation} title="Trip Details" />
        <EmptyView>
          <EmptyText>Trip not found</EmptyText>
          <TouchableOpacity
            onPress={() => navigation.navigate('Search')}
            style={{ marginTop: 16 }}
          >
            <Text style={{ color: '#2563eb', fontWeight: '600' }}>Back to Search</Text>
          </TouchableOpacity>
        </EmptyView>
      </>
    );
  }

  return (
    <>
      <Header navigation={navigation} title="Trip Details" />
      <Container>
        <Content showsVerticalScrollIndicator={false}>
          {/* Driver Info */}
          <Card>
            <Subtitle>Driver Information</Subtitle>
            <DetailRow>
              <DetailLabel>Name</DetailLabel>
              <DetailValue>{trip.driver.name}</DetailValue>
            </DetailRow>
            <DetailRow>
              <DetailLabel>Rating</DetailLabel>
              <DetailValue>⭐ {trip.driver.rating}/5.0</DetailValue>
            </DetailRow>
            <DetailRow>
              <DetailLabel>Trips</DetailLabel>
              <DetailValue>{trip.driver.completedRides || 0} completed</DetailValue>
            </DetailRow>
            {trip.driver.phone && (
              <DetailRow>
                <DetailLabel>Contact</DetailLabel>
                <DetailValue>{trip.driver.phone}</DetailValue>
              </DetailRow>
            )}
          </Card>

          {/* Trip Route */}
          <Card>
            <Subtitle>Route</Subtitle>
            <DetailRow>
              <DetailLabel>From</DetailLabel>
              <DetailValue>{trip.origin.name}</DetailValue>
            </DetailRow>
            <DetailRow>
              <DetailLabel>To</DetailLabel>
              <DetailValue>{trip.destination.name}</DetailValue>
            </DetailRow>
          </Card>

          {/* Trip Timing */}
          <Card>
            <Subtitle>Schedule</Subtitle>
            <DetailRow>
              <DetailLabel>Date</DetailLabel>
              <DetailValue>{trip.departureDate}</DetailValue>
            </DetailRow>
            <DetailRow>
              <DetailLabel>Departure</DetailLabel>
              <DetailValue>{trip.departureTime}</DetailValue>
            </DetailRow>
            {trip.estimatedArrivalTime && (
              <DetailRow>
                <DetailLabel>Arrival</DetailLabel>
                <DetailValue>{trip.estimatedArrivalTime}</DetailValue>
              </DetailRow>
            )}
          </Card>

          {/* Vehicle & Price */}
          <Card>
            <Subtitle>Trip Details</Subtitle>
            {trip.vehicleType && (
              <DetailRow>
                <DetailLabel>Vehicle</DetailLabel>
                <DetailValue>{trip.vehicleType}</DetailValue>
              </DetailRow>
            )}
            <DetailRow>
              <DetailLabel>Price/Seat</DetailLabel>
              <DetailValue>৳{trip.pricePerSeat}</DetailValue>
            </DetailRow>
            <DetailRow>
              <DetailLabel>Seats</DetailLabel>
              <DetailValue>{trip.availableSeats}/{trip.totalSeats} available</DetailValue>
            </DetailRow>
            {trip.description && (
              <DetailRow>
                <DetailLabel>Notes</DetailLabel>
                <DetailValue>{trip.description}</DetailValue>
              </DetailRow>
            )}
          </Card>

          {/* Preferences */}
          {trip.preferences && (
            <Card>
              <Subtitle>Preferences</Subtitle>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                {trip.preferences.ac && <Text style={{ marginRight: 12, marginBottom: 6 }}>❄️ AC</Text>}
                {trip.preferences.music && <Text style={{ marginRight: 12, marginBottom: 6 }}>🎵 Music</Text>}
                {trip.preferences.luggage && <Text style={{ marginRight: 12, marginBottom: 6 }}>🧳 Luggage</Text>}
                {trip.preferences.pets && <Text style={{ marginRight: 12, marginBottom: 6 }}>🐾 Pets OK</Text>}
                {trip.preferences.smoking && <Text style={{ marginRight: 12, marginBottom: 6 }}>🚬 Smoking</Text>}
              </View>
            </Card>
          )}

          {/* Booking Section */}
          {user?.role === 'PASSENGER' && trip.availableSeats > 0 ? (
            <Card>
              <Subtitle>Book Seats</Subtitle>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
                <Text style={{ marginRight: 12 }}>Seats:</Text>
                <SeatsInput
                  value={seats}
                  onChangeText={setSeats}
                  keyboardType="number-pad"
                  maxLength={1}
                  editable={!booking}
                />
              </View>
              <DetailRow>
                <DetailLabel>Total Cost</DetailLabel>
                <DetailValue>৳{(parseInt(seats, 10) || 1) * trip.pricePerSeat}</DetailValue>
              </DetailRow>
              {booking ? (
                <ActivityIndicator size="large" color="#2563eb" style={{ marginTop: 12 }} />
              ) : (
                <Button onPress={handleBook}>
                  <ButtonText>Confirm Booking</ButtonText>
                </Button>
              )}
            </Card>
          ) : user?.role === 'PASSENGER' && trip.availableSeats === 0 ? (
            <Card>
              <Text style={{ color: '#ef4444', fontWeight: '600', textAlign: 'center' }}>
                ❌ This trip is full
              </Text>
            </Card>
          ) : null}

          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={{ marginTop: 12, marginBottom: 20 }}
          >
            <Text style={{ color: '#2563eb', fontWeight: '600', textAlign: 'center' }}>
              ← Go Back
            </Text>
          </TouchableOpacity>
        </Content>
      </Container>
    </>
  );
}
