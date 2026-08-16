import styled from 'styled-components/native';
import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import Header from '../components/Header';
import { useAuth } from '../auth/AuthContext';
import repository from '../repository';
import { Location } from '../types';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'CreateTrip'>;

const Container = styled.View`
  flex: 1;
  background-color: ${p => p.theme.colors.background};
`;

const Content = styled.ScrollView`
  padding: 16px;
`;

const Field = styled.TextInput`
  border-width: 1px;
  border-color: #e5e7eb;
  padding: 12px;
  border-radius: 8px;
  margin-bottom: 12px;
  background-color: #fff;
`;

const Button = styled.TouchableOpacity`
  background-color: #2563eb;
  padding: 12px;
  border-radius: 8px;
  align-items: center;
  margin-top: 8px;
`;

const ButtonText = styled.Text`
  color: #fff;
  font-weight: 700;
`;

export default function CreateTrip({ navigation }: Props) {
  const { user } = useAuth();
  const [startingPoint, setStartingPoint] = useState('');
  const [destination, setDestination] = useState('');
  const [date, setDate] = useState('');
  const [departureTime, setDepartureTime] = useState('');
  const [estimatedArrivalTime, setEstimatedArrivalTime] = useState('');
  const [vehicleType, setVehicleType] = useState('Car');
  const [availableSeats, setAvailableSeats] = useState('4');
  const [pricePerSeat, setPricePerSeat] = useState('250');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [ac, setAc] = useState(true);
  const [music, setMusic] = useState(true);
  const [luggage, setLuggage] = useState(true);

  const onSubmit = async () => {
    if (!user || user.role !== 'DRIVER') {
      Alert.alert('Error', 'Only drivers can create trips');
      return;
    }

    if (!startingPoint.trim() || !destination.trim()) {
      Alert.alert('Error', 'Starting point and destination required');
      return;
    }

    if (!date.trim() || !departureTime.trim()) {
      Alert.alert('Error', 'Date and departure time required');
      return;
    }

    const seats = parseInt(availableSeats, 10) || 1;
    const price = parseFloat(pricePerSeat) || 0;

    if (seats < 1) {
      Alert.alert('Error', 'Seats must be at least 1');
      return;
    }

    if (price < 0) {
      Alert.alert('Error', 'Price cannot be negative');
      return;
    }

    // Mock locations
    const origin: Location = {
      name: startingPoint.trim(),
      latitude: 23.8103,
      longitude: 90.4125,
    };

    const destination_loc: Location = {
      name: destination.trim(),
      latitude: 23.7973,
      longitude: 90.4243,
    };

    const tripData = {
      driverId: user.id,
      driver: user as any,
      origin,
      destination: destination_loc,
      departureDate: date.trim(),
      departureTime: departureTime.trim(),
      estimatedArrivalTime: estimatedArrivalTime.trim() || undefined,
      totalSeats: seats,
      availableSeats: seats,
      pricePerSeat: price,
      status: 'SCHEDULED' as const,
      description: description.trim() || undefined,
      vehicleType: vehicleType.trim(),
      preferences: {
        ac,
        music,
        luggage,
        pets: false,
        smoking: false,
      },
      passengers: [],
    };

    try {
      setLoading(true);
      await repository.createTrip(tripData);
      setLoading(false);
      Alert.alert('Success', 'Trip created successfully!');
      navigation.navigate('MyTrips');
    } catch (err: any) {
      setLoading(false);
      const msg = err?.message || 'Failed to create trip';
      Alert.alert('Error', String(msg));
    }
  };

  if (!user || user.role !== 'DRIVER') {
    return (
      <>
        <Header navigation={navigation} title="Create Trip" />
        <Container>
          <Content>
            <Text style={{ fontSize: 16, color: '#ef4444' }}>Only drivers can create trips</Text>
          </Content>
        </Container>
      </>
    );
  }

  return (
    <>
      <Header navigation={navigation} title="Create Trip" />
      <Container>
        <Content>
          <Text style={{ fontSize: 18, fontWeight: '700', marginBottom: 12 }}>Create New Trip</Text>

          <Field
            placeholder="Starting point (address)"
            value={startingPoint}
            onChangeText={setStartingPoint}
            editable={!loading}
          />
          <Field
            placeholder="Destination (address)"
            value={destination}
            onChangeText={setDestination}
            editable={!loading}
          />
          <Field
            placeholder="Date (YYYY-MM-DD)"
            value={date}
            onChangeText={setDate}
            editable={!loading}
          />
          <Field
            placeholder="Departure time (HH:MM)"
            value={departureTime}
            onChangeText={setDepartureTime}
            editable={!loading}
          />
          <Field
            placeholder="Estimated arrival time (HH:MM)"
            value={estimatedArrivalTime}
            onChangeText={setEstimatedArrivalTime}
            editable={!loading}
          />
          <Field
            placeholder="Vehicle type"
            value={vehicleType}
            onChangeText={setVehicleType}
            editable={!loading}
          />
          <Field
            placeholder="Available seats"
            value={availableSeats}
            onChangeText={setAvailableSeats}
            keyboardType="numeric"
            editable={!loading}
          />
          <Field
            placeholder="Price per seat"
            value={pricePerSeat}
            onChangeText={setPricePerSeat}
            keyboardType="decimal-pad"
            editable={!loading}
          />
          <Field
            placeholder="Description (optional)"
            value={description}
            onChangeText={setDescription}
            editable={!loading}
            multiline
            numberOfLines={3}
          />

          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 }}>
            <TouchableOpacity onPress={() => setAc(!ac)} style={{ padding: 8 }} disabled={loading}>
              <Text style={{ color: ac ? '#2563eb' : '#374151', fontWeight: '600' }}>
                ❄️ {ac ? 'AC' : 'No AC'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setMusic(!music)} style={{ padding: 8 }} disabled={loading}>
              <Text style={{ color: music ? '#2563eb' : '#374151', fontWeight: '600' }}>
                🎵 {music ? 'Music' : 'No Music'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setLuggage(!luggage)} style={{ padding: 8 }} disabled={loading}>
              <Text style={{ color: luggage ? '#2563eb' : '#374151', fontWeight: '600' }}>
                🧳 {luggage ? 'Luggage' : 'No Luggage'}
              </Text>
            </TouchableOpacity>
          </View>

          {loading ? (
            <ActivityIndicator size="large" color="#2563eb" style={{ marginTop: 12 }} />
          ) : (
            <Button onPress={onSubmit}>
              <ButtonText>Create Trip</ButtonText>
            </Button>
          )}
        </Content>
      </Container>
    </>
  );
}
