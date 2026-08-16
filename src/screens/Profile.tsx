import styled from 'styled-components/native';
import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, ActivityIndicator, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import Header from '../components/Header';
import { useAuth } from '../auth/AuthContext';
import repository from '../repository';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'Profile'>;

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
  margin-bottom: 12px;
`;

const Label = styled.Text`
  font-size: 13px;
  font-weight: 600;
  color: #6b7280;
  margin-bottom: 4px;
`;

const Field = styled.TextInput`
  border-width: 1px;
  border-color: #e5e7eb;
  padding: 10px;
  border-radius: 6px;
  margin-bottom: 12px;
  background-color: #f9fafb;
  font-size: 14px;
`;

const ReadonlyField = styled.Text`
  font-size: 14px;
  color: #374151;
  padding: 10px;
  background-color: #f9fafb;
  border-radius: 6px;
  margin-bottom: 12px;
  border-width: 1px;
  border-color: #e5e7eb;
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
  font-size: 16px;
`;

const DangerButton = styled.TouchableOpacity`
  background-color: #ef4444;
  padding: 12px;
  border-radius: 8px;
  align-items: center;
  margin-top: 8px;
`;

const LoadingView = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

export default function ProfileScreen({ navigation }: Props) {
  const { user, logout, setAuthUser } = useAuth();
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [avatar, setAvatar] = useState(user?.avatar || '👤');

  // Refresh local state with latest user data whenever the screen gains focus
  useFocusEffect(
    useCallback(() => {
      let mounted = true;
      (async () => {
        if (!user) return;
        try {
          const fresh = await repository.getUser(user.id);
          if (fresh && mounted) {
            // Update auth context and local fields if different
            setAuthUser((prev => ({ ...(prev || {} as any), ...fresh })) as any);
            setName(fresh.name || '');
            setPhone(fresh.phone || '');
            setAvatar(fresh.avatar || '👤');
          }
        } catch (e) {
          // ignore fetch errors on focus
        }
      })();
      return () => { mounted = false; };
    }, [user?.id])
  );

  if (!user) {
    return (
      <>
        <Header navigation={navigation} title="Profile" />
        <LoadingView>
          <Text>Not logged in</Text>
        </LoadingView>
      </>
    );
  }

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('Validation', 'Name cannot be empty');
      return;
    }

    setLoading(true);
    try {
      const updated = await repository.updateUser(user.id, {
        name: name.trim(),
        phone: phone.trim(),
        avatar: avatar.trim(),
      });
      // Update auth context so other screens get the new user immediately
      setAuthUser(updated);
      setEditMode(false);
      Alert.alert('Success', 'Profile updated');
    } catch (err: any) {
      Alert.alert('Error', err?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    Alert.alert('Confirm', 'Do you want to logout?', [
      { text: 'Cancel', onPress: () => {} },
      {
        text: 'Logout',
        onPress: async () => {
          try {
            setLoading(true);
            await logout();
            setLoading(false);
          } catch (err: any) {
            setLoading(false);
            Alert.alert('Error', err?.message || 'Logout failed');
          }
        },
      },
    ]);
  };

  return (
    <>
      <Header navigation={navigation} title="Profile" />
      <Container>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
          <Content showsVerticalScrollIndicator={false}>
            {/* Profile Avatar & Role */}
            <Card>
              <View style={{ alignItems: 'center', marginBottom: 12 }}>
                <Text style={{ fontSize: 48 }}>{avatar}</Text>
                <Text style={{ fontSize: 16, fontWeight: '700', marginTop: 8 }}>{user.name}</Text>
                <Text style={{ fontSize: 12, color: '#6b7280', marginTop: 4 }}>
                  {user.role === 'PASSENGER' ? '👤 Passenger' : user.role === 'DRIVER' ? '🚗 Driver' : '⚙️ Admin'}
                </Text>
              </View>
            </Card>

            {/* Basic Info */}
            <Card>
              <Title>Basic Information</Title>
              <Label>Email</Label>
              <ReadonlyField>{user.email}</ReadonlyField>

              <Label>Role</Label>
              <ReadonlyField>{user.role}</ReadonlyField>

              {user.role === 'PASSENGER' && (
                <>
                  <Label>Total Bookings</Label>
                  <ReadonlyField>{(user as any).totalBookings || 0}</ReadonlyField>
                </>
              )}

              {user.role === 'DRIVER' && (
                <>
                  <Label>Total Trips</Label>
                  <ReadonlyField>{(user as any).totalTrips || 0}</ReadonlyField>
                </>
              )}

              <Label>Rating</Label>
              <ReadonlyField>⭐ {user.rating || 0}/5.0</ReadonlyField>
            </Card>

            {/* Editable Fields */}
            <Card>
              <Title>Edit Profile</Title>

              <Label>Name</Label>
              <Field
                value={name}
                onChangeText={setName}
                editable={editMode && !loading}
                placeholder="Enter your name"
              />

              <Label>Phone</Label>
              <Field
                value={phone}
                onChangeText={setPhone}
                editable={editMode && !loading}
                placeholder="Enter your phone"
                keyboardType="phone-pad"
              />

              <Label>Avatar Emoji</Label>
              <Field
                value={avatar}
                onChangeText={setAvatar}
                editable={editMode && !loading}
                placeholder="Emoji only"
                maxLength={2}
              />

              {editMode ? (
                <>
                  {loading ? (
                    <ActivityIndicator size="large" color="#2563eb" style={{ marginTop: 12 }} />
                  ) : (
                    <>
                      <Button onPress={handleSave}>
                        <ButtonText>Save Changes</ButtonText>
                      </Button>
                      <Button
                        onPress={() => {
                          setEditMode(false);
                          setName(user.name);
                          setPhone(user.phone);
                          setAvatar(user.avatar || '👤');
                        }}
                        style={{ backgroundColor: '#6b7280' }}
                      >
                        <ButtonText>Cancel</ButtonText>
                      </Button>
                    </>
                  )}
                </>
              ) : (
                <Button onPress={() => setEditMode(true)}>
                  <ButtonText>Edit Profile</ButtonText>
                </Button>
              )}
            </Card>

            {/* Logout */}
            <Card>
              {loading ? (
                <ActivityIndicator size="large" color="#ef4444" />
              ) : (
                <DangerButton onPress={handleLogout}>
                  <ButtonText>Logout</ButtonText>
                </DangerButton>
              )}
            </Card>
          </Content>
        </KeyboardAvoidingView>
      </Container>
    </>
  );
}
