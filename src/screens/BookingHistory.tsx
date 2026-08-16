import styled from 'styled-components/native';
import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Alert, FlatList } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import Header from '../components/Header';
import { useAuth } from '../auth/AuthContext';
import repository from '../repository';
import { Booking, Trip } from '../types';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'BookingHistory'>;

const Container = styled.View`
  flex: 1;
  background-color: ${p => p.theme.colors.background};
`;

const Content = styled.View`
  padding: 16px;
  flex: 1;
`;

const BookingCard = styled.View`
  background-color: #fff;
  border-radius: 8px;
  padding: 14px;
  margin-bottom: 12px;
  border-width: 1px;
  border-color: #e5e7eb;
`;

const BookingTitle = styled.Text`
  font-size: 16px;
  font-weight: 700;
  color: ${p => p.theme.colors.primary};
  margin-bottom: 6px;
`;

const BookingDetail = styled.Text`
  font-size: 13px;
  color: #6b7280;
  margin-bottom: 4px;
`;

const StatusBadge = styled.View<{ status: string }>`
  background-color: ${p =>
    p.status === 'CONFIRMED'
      ? '#dcfce7'
      : p.status === 'COMPLETED'
      ? '#e0e7ff'
      : p.status === 'CANCELLED'
      ? '#fee2e2'
      : '#fef3c7'};
  padding: 4px 8px;
  border-radius: 4px;
  align-self: flex-start;
  margin-top: 8px;
`;

const StatusText = styled.Text<{ status: string }>`
  font-size: 12px;
  font-weight: 600;
  color: ${p =>
    p.status === 'CONFIRMED'
      ? '#15803d'
      : p.status === 'COMPLETED'
      ? '#3730a3'
      : p.status === 'CANCELLED'
      ? '#991b1b'
      : '#92400e'};
`;

const TabContainer = styled.View`
  flex-direction: row;
  margin-bottom: 16px;
  border-bottom-width: 1px;
  border-bottom-color: #e5e7eb;
`;

const Tab = styled.TouchableOpacity<{ active: boolean }>`
  padding: 12px 16px;
  border-bottom-width: ${p => (p.active ? '2px' : '0px')};
  border-bottom-color: #2563eb;
`;

const TabText = styled.Text<{ active: boolean }>`
  font-size: 14px;
  font-weight: ${p => (p.active ? '700' : '500')};
  color: ${p => (p.active ? '#2563eb' : '#6b7280')};
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

const CancelButton = styled.TouchableOpacity`
  background-color: #ef4444;
  padding: 8px 12px;
  border-radius: 6px;
  margin-top: 8px;
  align-self: flex-start;
`;

const CancelButtonText = styled.Text`
  color: #fff;
  font-weight: 600;
  font-size: 12px;
`;

type TabType = 'upcoming' | 'completed' | 'cancelled';

interface BookingWithTrip extends Booking {
  tripData?: Trip;
}

export default function BookingHistoryScreen({ navigation }: Props) {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<BookingWithTrip[]>([]);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>('upcoming');
  const [cancelling, setCancelling] = useState<string | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      if (!user || user.role !== 'PASSENGER') {
        setLoading(false);
        return;
      }

      const [bookingList, tripList] = await Promise.all([
        repository.getBookings(user.id),
        repository.fetchTrips(),
      ]);

      const enrichedBookings = bookingList.map(booking => ({
        ...booking,
        tripData: tripList.find(t => t.id === booking.tripId),
      }));

      setBookings(enrichedBookings);
      setTrips(tripList);
    } catch (err: any) {
      Alert.alert('Error', err?.message || 'Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [user])
  );

  const handleCancelBooking = async (bookingId: string) => {
    Alert.alert('Confirm Cancellation', 'Are you sure you want to cancel this booking?', [
      { text: 'Keep It', onPress: () => {} },
      {
        text: 'Cancel Booking',
        onPress: async () => {
          setCancelling(bookingId);
          try {
            await repository.cancelBooking(bookingId);
            // Reload data so cancelled booking appears in the Cancelled tab and seats are restored
            await loadData();
            Alert.alert('Success', 'Booking cancelled');
          } catch (err: any) {
            Alert.alert('Error', err?.message || 'Failed to cancel booking');
          } finally {
            setCancelling(null);
          }
        },
      },
    ]);
  };

  const getFilteredBookings = () => {
    const now = new Date();
    return bookings.filter(booking => {
      const trip = booking.tripData;
      if (!trip) return false;

      const tripDate = new Date(`${trip.departureDate}T${trip.departureTime}`);

      if (activeTab === 'upcoming') {
        return booking.status !== 'CANCELLED' && tripDate > now;
      }
      if (activeTab === 'completed') {
        return booking.status === 'COMPLETED' || (booking.status === 'CONFIRMED' && tripDate < now);
      }
      if (activeTab === 'cancelled') {
        return booking.status === 'CANCELLED';
      }
      return false;
    });
  };

  const filteredBookings = getFilteredBookings();

  const renderBooking = (booking: BookingWithTrip) => {
    const trip = booking.tripData;
    if (!trip) return null;

    return (
      <BookingCard key={booking.id}>
        <BookingTitle>
          {trip.driver.name} • {trip.origin.name} → {trip.destination.name}
        </BookingTitle>
        <BookingDetail>📍 {trip.departureDate} at {trip.departureTime}</BookingDetail>
        <BookingDetail>💵 ৳{trip.pricePerSeat} × {booking.seatsBooked} seats = ৳{trip.pricePerSeat * booking.seatsBooked}</BookingDetail>
        <BookingDetail>🪑 Seats: {booking.seatsBooked}</BookingDetail>
        <BookingDetail>
          💳 Payment: {booking.paymentStatus === 'PAID' ? '✅ Paid' : booking.paymentStatus === 'PENDING' ? '⏳ Pending' : '❌ Failed'}
        </BookingDetail>

        <StatusBadge status={booking.status}>
          <StatusText status={booking.status}>{booking.status}</StatusText>
        </StatusBadge>

        {booking.status === 'CONFIRMED' && activeTab === 'upcoming' && cancelling !== booking.id ? (
          <CancelButton onPress={() => handleCancelBooking(booking.id)}>
            <CancelButtonText>Cancel Booking</CancelButtonText>
          </CancelButton>
        ) : cancelling === booking.id ? (
          <ActivityIndicator size="small" color="#ef4444" style={{ marginTop: 8 }} />
        ) : null}
      </BookingCard>
    );
  };

  if (loading) {
    return (
      <>
        <Header navigation={navigation} title="Booking History" />
        <LoadingView>
          <ActivityIndicator size="large" color="#2563eb" />
        </LoadingView>
      </>
    );
  }

  if (!user || user.role !== 'PASSENGER') {
    return (
      <>
        <Header navigation={navigation} title="Booking History" />
        <EmptyView>
          <EmptyText>Only passengers can view bookings</EmptyText>
        </EmptyView>
      </>
    );
  }

  return (
    <>
      <Header navigation={navigation} title="Booking History" />
      <Container>
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

        <Content>
          {filteredBookings.length === 0 ? (
            <EmptyView>
              <EmptyText>
                {activeTab === 'upcoming'
                  ? 'No upcoming bookings'
                  : activeTab === 'completed'
                  ? 'No completed trips'
                  : 'No cancelled bookings'}
              </EmptyText>
            </EmptyView>
          ) : (
            <FlatList
              data={filteredBookings}
              renderItem={({ item }) => renderBooking(item)}
              keyExtractor={item => item.id}
              scrollEnabled={false}
            />
          )}
        </Content>
      </Container>
    </>
  );
}
