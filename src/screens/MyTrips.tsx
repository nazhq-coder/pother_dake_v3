import styled from 'styled-components/native';
import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, Alert, FlatList } from 'react-native';
import Header from '../components/Header';
import { useAuth } from '../auth/AuthContext';
import repository from '../repository';
import { Trip } from '../types';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'MyTrips'>;

const Container = styled.View`
  flex: 1;
  background-color: ${p => p.theme.colors.background};
`;

const Content = styled.View`
  padding: 16px;
  flex: 1;
`;

const TabContainer = styled.View`
  flex-direction: row;
  padding: 16px;
  border-bottom-width: 1px;
  border-bottom-color: #e5e7eb;
  background-color: #fff;
`;

const Tab = styled.TouchableOpacity<{ active: boolean }>`
  padding: 8px 12px;
  border-bottom-width: ${p => (p.active ? '2px' : '0px')};
  border-bottom-color: #2563eb;
  margin-right: 8px;
`;

const TabText = styled.Text<{ active: boolean }>`
  font-size: 14px;
  font-weight: ${p => (p.active ? '700' : '500')};
  color: ${p => (p.active ? '#2563eb' : '#6b7280')};
`;

const TripCard = styled.View`
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
  align-items: center;
  margin-top: 10px;
`;

const StatusBadge = styled.View<{ status: string }>`
  background-color: ${p =>
    p.status === 'SCHEDULED'
      ? '#dbeafe'
      : p.status === 'IN_PROGRESS'
      ? '#fef3c7'
      : p.status === 'COMPLETED'
      ? '#dcfce7'
      : '#fee2e2'};
  padding: 4px 8px;
  border-radius: 4px;
`;

const StatusText = styled.Text<{ status: string }>`
  font-size: 12px;
  color: ${p =>
    p.status === 'SCHEDULED'
      ? '#1e40af'
      : p.status === 'IN_PROGRESS'
      ? '#92400e'
      : p.status === 'COMPLETED'
      ? '#15803d'
      : '#991b1b'};
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

const ActionButton = styled.TouchableOpacity`
  background-color: #2563eb;
  padding: 8px 12px;
  border-radius: 6px;
  margin-top: 8px;
  align-self: flex-start;
`;

const ActionButtonText = styled.Text`
  color: #fff;
  font-weight: 600;
  font-size: 12px;
`;

const DangerButton = styled.TouchableOpacity`
  background-color: #ef4444;
  padding: 8px 12px;
  border-radius: 6px;
  margin-top: 8px;
  align-self: flex-start;
`;

type TabType = 'upcoming' | 'completed' | 'cancelled';

export default function MyTripsScreen({ navigation }: Props) {
  const { user } = useAuth();
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>('upcoming');
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    loadTrips();
  }, []);

  const loadTrips = async () => {
    try {
      setLoading(true);
      if (!user || user.role !== 'DRIVER') {
        setLoading(false);
        return;
      }

      const allTrips = await repository.fetchTrips();
      // Filter trips created by current driver
      const driverTrips = allTrips.filter(t => t.driverId === user.id);
      setTrips(driverTrips);
    } catch (err: any) {
      Alert.alert('Error', err?.message || 'Failed to load trips');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTrip = async (tripId: string) => {
    Alert.alert('Confirm Deletion', 'Are you sure you want to delete this trip?', [
      { text: 'Keep It', onPress: () => {} },
      {
        text: 'Delete Trip',
        onPress: async () => {
          setDeleting(tripId);
          try {
            await repository.deleteTrip(tripId);
            setTrips(prev => prev.filter(t => t.id !== tripId));
            Alert.alert('Success', 'Trip deleted');
          } catch (err: any) {
            Alert.alert('Error', err?.message || 'Failed to delete trip');
          } finally {
            setDeleting(null);
          }
        },
      },
    ]);
  };

  const getFilteredTrips = () => {
    const now = new Date();
    return trips.filter(trip => {
      const tripDate = new Date(`${trip.departureDate}T${trip.departureTime}`);

      if (activeTab === 'upcoming') {
        return trip.status === 'SCHEDULED' && tripDate > now;
      }
      if (activeTab === 'completed') {
        return trip.status === 'COMPLETED' || (trip.status === 'SCHEDULED' && tripDate < now);
      }
      if (activeTab === 'cancelled') {
        return trip.status === 'CANCELLED';
      }
      return false;
    });
  };

  const filteredTrips = getFilteredTrips();

  const renderTrip = (trip: Trip) => (
    <TripCard key={trip.id}>
      <TripTitle>
        {trip.origin.name} → {trip.destination.name}
      </TripTitle>
      <TripDetail>📍 {trip.departureDate} at {trip.departureTime}</TripDetail>
      <TripDetail>💵 ৳{trip.pricePerSeat} • {trip.availableSeats}/{trip.totalSeats} seats available</TripDetail>
      <TripDetail>👥 {trip.passengers.length} passenger(s) booked</TripDetail>

      {trip.description && <TripDetail>📝 {trip.description}</TripDetail>}

      <TripMeta>
        <StatusBadge status={trip.status}>
          <StatusText status={trip.status}>{trip.status}</StatusText>
        </StatusBadge>
      </TripMeta>

      <ActionButton onPress={() => navigation.navigate('TripDetails', { id: trip.id })}>
        <ActionButtonText>View Details</ActionButtonText>
      </ActionButton>

      {trip.status === 'SCHEDULED' && deleting !== trip.id ? (
        <DangerButton onPress={() => handleDeleteTrip(trip.id)}>
          <ActionButtonText>Delete Trip</ActionButtonText>
        </DangerButton>
      ) : deleting === trip.id ? (
        <ActivityIndicator size="small" color="#ef4444" style={{ marginTop: 8 }} />
      ) : null}
    </TripCard>
  );

  if (loading) {
    return (
      <>
        <Header navigation={navigation} title="My Trips" />
        <LoadingView>
          <ActivityIndicator size="large" color="#2563eb" />
        </LoadingView>
      </>
    );
  }

  if (!user || user.role !== 'DRIVER') {
    return (
      <>
        <Header navigation={navigation} title="My Trips" />
        <EmptyView>
          <EmptyText>Only drivers can manage trips</EmptyText>
        </EmptyView>
      </>
    );
  }

  return (
    <>
      <Header navigation={navigation} title="My Trips" />
      <TabContainer>
        <Tab active={activeTab === 'upcoming'} onPress={() => setActiveTab('upcoming')}>
          <TabText active={activeTab === 'upcoming'}>Upcoming</TabText>
        </Tab>
        <Tab active={activeTab === 'completed'} onPress={() => setActiveTab('completed')}>
          <TabText active={activeTab === 'completed'}>Completed</TabText>
        </Tab>
        <Tab active={activeTab === 'cancelled'} onPress={() => setActiveTab('cancelled')}>
          <TabText active={activeTab === 'cancelled'}>Cancelled</TabText>
        </Tab>
      </TabContainer>

      <Container>
        <Content>
          {filteredTrips.length === 0 ? (
            <EmptyView>
              <EmptyText>
                {activeTab === 'upcoming'
                  ? 'No upcoming trips'
                  : activeTab === 'completed'
                  ? 'No completed trips'
                  : 'No cancelled trips'}
              </EmptyText>
            </EmptyView>
          ) : (
            <FlatList
              data={filteredTrips}
              renderItem={({ item }) => renderTrip(item)}
              keyExtractor={item => item.id}
              scrollEnabled={false}
            />
          )}
        </Content>
      </Container>
    </>
  );
}