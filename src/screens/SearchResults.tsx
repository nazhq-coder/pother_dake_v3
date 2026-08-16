import styled from 'styled-components/native';
import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView, ActivityIndicator, Alert, FlatList } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import Header from '../components/Header';
import repository from '../repository';
import { Trip } from '../types';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'Search'>;

const Container = styled.View`
  flex: 1;
  background-color: ${p => p.theme.colors.background};
`;

const Content = styled.View`
  padding: 16px;
  flex: 1;
`;

const SearchBar = styled.TextInput`
  border-width: 1px;
  border-color: #e5e7eb;
  padding: 12px;
  border-radius: 8px;
  margin-bottom: 16px;
  background-color: #fff;
`;

const TripCard = styled.TouchableOpacity`
  background-color: #fff;
  border-radius: 8px;
  padding: 14px;
  margin-bottom: 12px;
  border-width: 1px;
  border-color: #e5e7eb;
`;

const TripTitle = styled.Text`
  font-size: 16px;
  font-weight: 700;
  color: ${p => p.theme.colors.primary};
  margin-bottom: 6px;
`;

const TripDetail = styled.Text`
  font-size: 13px;
  color: #6b7280;
  margin-bottom: 4px;
`;

const TripMeta = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-top: 10px;
`;

const Badge = styled.View`
  background-color: #dbeafe;
  padding: 4px 8px;
  border-radius: 4px;
`;

const BadgeText = styled.Text`
  font-size: 12px;
  color: #1e40af;
  font-weight: 600;
`;

const EmptyView = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const EmptyText = styled.Text`
  font-size: 16px;
  color: #9ca3af;
  font-weight: 500;
`;

const LoadingView = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

export default function SearchResults({ navigation }: Props) {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [filteredTrips, setFilteredTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');

  const loadTrips = async () => {
    try {
      setLoading(true);
      const data = await repository.fetchTrips();
      setTrips(data);
      const text = (searchText || '').trim().toLowerCase();
      if (text) {
        const filtered = data.filter(trip =>
          trip.origin.name.toLowerCase().includes(text) ||
          trip.destination.name.toLowerCase().includes(text) ||
          trip.driver.name.toLowerCase().includes(text)
        );
        setFilteredTrips(filtered);
      } else {
        setFilteredTrips(data);
      }
    } catch (err: any) {
      Alert.alert('Error', err?.message || 'Failed to load trips');
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadTrips();
    }, [])
  );

  const handleSearch = (text: string) => {
    setSearchText(text);
    const lower = text.toLowerCase();
    const filtered = trips.filter(trip =>
      trip.origin.name.toLowerCase().includes(lower) ||
      trip.destination.name.toLowerCase().includes(lower) ||
      trip.driver.name.toLowerCase().includes(lower)
    );
    setFilteredTrips(filtered);
  };

  const handleTripPress = (trip: Trip) => {
    navigation.navigate('TripDetails', { id: trip.id });
  };

  const renderTrip = ({ item }: { item: Trip }) => (
    <TripCard onPress={() => handleTripPress(item)}>
      <TripTitle>{item.driver.name}'s Trip</TripTitle>
      <TripDetail>📍 {item.origin.name} → {item.destination.name}</TripDetail>
      <TripDetail>🕐 {item.departureTime} on {item.departureDate}</TripDetail>
      <TripMeta>
        <View>
          <TripDetail>💵 ৳{item.pricePerSeat} • {item.availableSeats}/{item.totalSeats} seats</TripDetail>
        </View>
        <Badge>
          <BadgeText>
            {item.availableSeats === 0 ? 'FULL' : 'AVAILABLE'}
          </BadgeText>
        </Badge>
      </TripMeta>
    </TripCard>
  );

  if (loading) {
    return (
      <>
        <Header navigation={navigation} title="Search Trips" />
        <LoadingView>
          <ActivityIndicator size="large" color="#2563eb" />
        </LoadingView>
      </>
    );
  }

  return (
    <>
      <Header navigation={navigation} title="Search Trips" />
      <Container>
        <Content>
          <SearchBar
            placeholder="Search by location or driver name..."
            value={searchText}
            onChangeText={handleSearch}
          />

          {filteredTrips.length === 0 ? (
            <EmptyView>
              <EmptyText>
                {searchText ? 'No trips found' : 'No trips available'}
              </EmptyText>
            </EmptyView>
          ) : (
            <FlatList
              data={filteredTrips}
              renderItem={renderTrip}
              keyExtractor={item => item.id}
              scrollEnabled={true}
            />
          )}
        </Content>
      </Container>
    </>
  );
}
