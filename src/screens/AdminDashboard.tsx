import styled from 'styled-components/native';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert } from 'react-native';
import Header from '../components/Header';
import RoleGuard from '../components/RoleGuard';
import { useAuth } from '../auth/AuthContext';
import repository from '../repository';
import { Trip } from '../types';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'Admin'>;

const Container = styled.View`
  flex: 1;
  padding: 16px;
  background-color: ${p => p.theme.colors.background};
`;

const WelcomeCard = styled.View`
  background: linear-gradient(135deg, #7c3aed 0%, #5b21b6 100%);
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
  color: #e9d5ff;
`;

const StatsGrid = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 16px;
`;

const StatCard = styled.View`
  width: 48%;
  background-color: #fff;
  border-radius: 8px;
  padding: 14px;
  border-width: 1px;
  border-color: #e5e7eb;
  margin-bottom: 12px;
`;

const StatNumber = styled.Text`
  font-size: 20px;
  font-weight: 700;
  color: #7c3aed;
`;

const StatLabel = styled.Text`
  font-size: 12px;
  color: #6b7280;
  margin-top: 4px;
`;

const QuickActionsContainer = styled.View`
  margin-top: 20px;
  gap: 10px;
`;

const ActionButton = styled.TouchableOpacity<{ variant?: string }>`
  background-color: ${p => p.variant === 'secondary' ? '#f3f4f6' : '#7c3aed'};
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

function AdminDashboardInner({ navigation }: Props) {
  const { user, logout } = useAuth();
  const [trips, setTrips] = useState<Trip[]>([]);
  const [driversCount, setDriversCount] = useState<number>(0);
  const [passengersCount, setPassengersCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [allTrips, drivers, passengers] = await Promise.all([
        repository.fetchTrips(),
        repository.getDrivers(),
        repository.getPassengers(),
      ]);

      setTrips(allTrips);
      setDriversCount(drivers.length);
      setPassengersCount(passengers.length);
    } catch (err: any) {
      Alert.alert('Error', err?.message || 'Failed to load admin data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        <Header navigation={navigation} title="Admin" />
        <Container style={{ justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#7c3aed" />
        </Container>
      </>
    );
  }

  // Calculate statistics
  const totalTrips = trips.length;
  const now = new Date();
  const upcomingTrips = trips.filter(t => {
    const tripDate = new Date(`${t.departureDate}T${t.departureTime}`);
    return t.status === 'SCHEDULED' && tripDate > now;
  }).length;
  const completedTrips = trips.filter(t => t.status === 'COMPLETED').length;
  const totalBookings = trips.reduce((sum, t) => sum + (Array.isArray(t.passengers) ? t.passengers.length : 0), 0);
  const cancelledBookings = trips.reduce((sum, t) => {
    const c = (t.passengers || []).filter(p => p.status === 'CANCELLED').length;
    return sum + c;
  }, 0);

  return (
    <>
      <Header navigation={navigation} title="Admin" />
      <Container>
        <WelcomeCard>
          <WelcomeTitle>Welcome, {user?.name}</WelcomeTitle>
          <WelcomeSubtitle>Overview of platform activity (mock data)</WelcomeSubtitle>
        </WelcomeCard>

        <StatsGrid>
          <StatCard>
            <StatNumber>{totalTrips}</StatNumber>
            <StatLabel>Total Trips</StatLabel>
          </StatCard>

          <StatCard>
            <StatNumber>{upcomingTrips}</StatNumber>
            <StatLabel>Upcoming Trips</StatLabel>
          </StatCard>

          <StatCard>
            <StatNumber>{completedTrips}</StatNumber>
            <StatLabel>Completed Trips</StatLabel>
          </StatCard>

          <StatCard>
            <StatNumber>{driversCount}</StatNumber>
            <StatLabel>Total Drivers</StatLabel>
          </StatCard>

          <StatCard>
            <StatNumber>{passengersCount}</StatNumber>
            <StatLabel>Total Passengers</StatLabel>
          </StatCard>

          <StatCard>
            <StatNumber>{totalBookings}</StatNumber>
            <StatLabel>Total Bookings</StatLabel>
          </StatCard>

          <StatCard>
            <StatNumber>{cancelledBookings}</StatNumber>
            <StatLabel>Cancelled Bookings</StatLabel>
          </StatCard>
        </StatsGrid>

        <QuickActionsContainer>
          <ActionButton
            variant="secondary"
            onPress={() => navigation.navigate('Landing')}
          >
            <ActionButtonText variant="secondary">🏠 Landing</ActionButtonText>
          </ActionButton>

          <ActionButton
            variant="secondary"
            onPress={() => {
              Alert.alert('Confirm', 'Logout?', [
                { text: 'Cancel' },
                { text: 'Logout', onPress: logout },
              ]);
            }}
          >
            <ActionButtonText variant="secondary">🚪 Logout</ActionButtonText>
          </ActionButton>
        </QuickActionsContainer>
      </Container>
    </>
  );
}

export default RoleGuard(['ADMIN'], AdminDashboardInner);
