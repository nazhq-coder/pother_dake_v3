import styled from 'styled-components/native';
import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator, Alert, FlatList } from 'react-native';
import Header from '../components/Header';
import { useAuth } from '../auth/AuthContext';
import repository from '../repository';
import RoleGuard from '../components/RoleGuard';
import { Trip } from '../types';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'Driver'>;

const Container = styled.View`
  flex: 1;
  background-color: ${p => p.theme.colors.background};
`;

const Content = styled.ScrollView`
  padding: 16px;
`;

const WelcomeCard = styled.View`
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 20px;
`;

const WelcomeTitle = styled.Text`
  font-size: 24px;
  font-weight: 700;
  color: #fff;
  margin-bottom: 6px;
`;

const WelcomeSubtitle = styled.Text`
  font-size: 14px;
  color: #d1fae5;
`;

const SectionTitle = styled.Text`
  font-size: 18px;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 12px;
  margin-top: 16px;
`;

const StatsContainer = styled.View`
  flex-direction: row;
  gap: 12px;
  margin-bottom: 16px;
`;

const StatCard = styled.View`
  flex: 1;
  background-color: #fff;
  border-radius: 8px;
  padding: 14px;
  border-width: 1px;
  border-color: #e5e7eb;
  align-items: center;
`;

const StatNumber = styled.Text`
  font-size: 20px;
  font-weight: 700;
  color: #10b981;
`;

const StatLabel = styled.Text`
  font-size: 12px;
  color: #6b7280;
  margin-top: 4px;
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
  font-size: 14px;
  font-weight: 700;
  color: #10b981;
  margin-bottom: 6px;
`;

const TripDetail = styled.Text`
  font-size: 12px;
  color: #6b7280;
  margin-bottom: 3px;
`;

const QuickActionsContainer = styled.View`
  margin-top: 20px;
  gap: 10px;
`;

const ActionButton = styled.TouchableOpacity<{ variant?: string }>`
  background-color: ${p => p.variant === 'secondary' ? '#f3f4f6' : '#10b981'};
  padding: 12px;
  border-radius: 8px;
  border-width: ${p => p.variant === 'secondary' ? '1px' : '0px'};
  border-color: ${p => p.variant === 'secondary' ? '#e5e7eb' : 'transparent'};
  align-items: center;
`;

const ActionButtonText = styled.Text<{ variant?: string }>`
  font-weight: 600;
  font-size: 14px;
  color: ${p => p.variant === 'secondary' ? '#374151' : '#fff'};
`;

const EmptyStateContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: 40px 16px;
`;

const EmptyStateText = styled.Text`
  font-size: 16px;
  color: #9ca3af;
  text-align: center;
  margin-bottom: 16px;
`;

const LoadingView = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

function DriverDashboardInner({ navigation }: Props) {
  const { user, logout } = useAuth();
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      if (!user || user.role !== 'DRIVER') {
        setLoading(false);
        return;
      }

      const allTrips = await repository.fetchTrips();
      const driverTrips = allTrips.filter(t => t.driverId === user.id);
      setTrips(driverTrips);
    } catch (err: any) {
      Alert.alert('Error', err?.message || 'Failed to load trips');
    } finally {
      setLoading(false);
    }
  };

  const upcomingTrips = trips.filter(t => {
    const now = new Date();
    const tripDate = new Date(`${t.departureDate}T${t.departureTime}`);
    return t.status === 'SCHEDULED' && tripDate > now;
  });

  const completedTrips = trips.filter(t => t.status === 'COMPLETED');
  const totalPassengers = trips.reduce((sum, trip) => sum + trip.passengers.length, 0);

  if (loading) {
    return (
      <>
        <Header navigation={navigation} title="Dashboard" />
        <LoadingView>
          <ActivityIndicator size="large" color="#10b981" />
        </LoadingView>
      </>
    );
  }

  return (
    <>
      <Header navigation={navigation} title="Dashboard" />
      <Container>
        <Content showsVerticalScrollIndicator={false}>
          {/* Welcome Card */}
          <WelcomeCard>
            <WelcomeTitle>Welcome, {user?.name}! 🚗</WelcomeTitle>
            <WelcomeSubtitle>Manage your rides and passengers</WelcomeSubtitle>
          </WelcomeCard>

          {/* Statistics */}
          <StatsContainer>
            <StatCard>
              <StatNumber>{upcomingTrips.length}</StatNumber>
              <StatLabel>Upcoming</StatLabel>
            </StatCard>
            <StatCard>
              <StatNumber>{completedTrips.length}</StatNumber>
              <StatLabel>Completed</StatLabel>
            </StatCard>
            <StatCard>
              <StatNumber>{totalPassengers}</StatNumber>
              <StatLabel>Passengers</StatLabel>
            </StatCard>
          </StatsContainer>

          {/* Upcoming Trips */}
          {upcomingTrips.length > 0 ? (
            <>
              <SectionTitle>Upcoming Trips</SectionTitle>
              <FlatList
                data={upcomingTrips.slice(0, 3)}
                scrollEnabled={false}
                renderItem={({ item }) => (
                  <TripCard>
                    <TripTitle>
                      {item.origin.name} → {item.destination.name}
                    </TripTitle>
                    <TripDetail>📅 {item.departureDate}</TripDetail>
                    <TripDetail>🕐 {item.departureTime}</TripDetail>
                    <TripDetail>💺 {item.availableSeats}/{item.totalSeats} seats available</TripDetail>
                    <TripDetail>👥 {item.passengers.length} passenger(s) booked</TripDetail>
                    <TripDetail>💵 ৳{item.pricePerSeat} per seat</TripDetail>
                  </TripCard>
                )}
                keyExtractor={item => item.id}
              />
            </>
          ) : (
            <EmptyStateContainer>
              <EmptyStateText>No upcoming trips</EmptyStateText>
              <ActionButton onPress={() => navigation.navigate('CreateTrip')}>
                <ActionButtonText>Create Your First Trip</ActionButtonText>
              </ActionButton>
            </EmptyStateContainer>
          )}

          {/* Quick Actions */}
          <QuickActionsContainer>
            <ActionButton onPress={() => navigation.navigate('CreateTrip')}>
              <ActionButtonText>➕ Create Trip</ActionButtonText>
            </ActionButton>
            <ActionButton
              variant="secondary"
              onPress={() => navigation.navigate('MyTrips')}
            >
              <ActionButtonText variant="secondary">📋 My Trips</ActionButtonText>
            </ActionButton>
            <ActionButton
              variant="secondary"
              onPress={() => navigation.navigate('Profile')}
            >
              <ActionButtonText variant="secondary">👤 Profile</ActionButtonText>
            </ActionButton>
            <ActionButton
              variant="secondary"
              onPress={() =>
                Alert.alert('Confirm', 'Logout?', [
                  { text: 'Cancel' },
                  {
                    text: 'Logout',
                    onPress: logout,
                  },
                ])
              }
            >
              <ActionButtonText variant="secondary">🚪 Logout</ActionButtonText>
            </ActionButton>
          </QuickActionsContainer>
        </Content>
      </Container>
    </>
  );
}

export default RoleGuard(['DRIVER'], DriverDashboardInner);
