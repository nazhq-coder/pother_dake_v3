import styled from 'styled-components/native';
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, ActivityIndicator, Alert } from 'react-native';
import Header from '../components/Header';
import { useAuth } from '../auth/AuthContext';
import repository from '../repository';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'CompleteRegistration'>;

const Container = styled.View`
  flex: 1;
  padding: 16px;
  background-color: ${p => p.theme.colors.background};
`;

const ScrollContainer = styled.ScrollView`
  padding: 0;
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
  margin-bottom: 12px;
`;

const ButtonText = styled.Text`
  color: #fff;
  font-weight: 700;
`;

export default function CompleteRegistration({ navigation }: Props) {
  const { user, setAuthUser } = useAuth();
  const [gender, setGender] = useState(user?.role === 'DRIVER' ? 'Male' : '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [profession, setProfession] = useState('');
  const [loading, setLoading] = useState(false);

  if (!user) {
    return (
      <>
        <Header navigation={navigation} title="Complete Registration" />
        <Container>
          <Text>Please log in first</Text>
        </Container>
      </>
    );
  }

  const onSubmit = async () => {
    if (!gender.trim() || !phone.trim()) {
      Alert.alert('Error', 'Gender and phone are required');
      return;
    }

    try {
      setLoading(true);
      const updated = await repository.updateUser(user.id, {
        phone: phone.trim(),
      });
      setAuthUser(updated);
      setLoading(false);
      Alert.alert('Success', 'Registration completed.');
      navigation.navigate('Landing');
    } catch (err: any) {
      setLoading(false);
      const msg = err?.message || 'Update failed';
      Alert.alert('Error', String(msg));
    }
  };

  return (
    <>
      <Header navigation={navigation} title="Complete Registration" />
      <Container>
        <ScrollContainer>
          <Text style={{ fontSize: 18, fontWeight: '700', marginBottom: 12 }}>Complete Your Registration</Text>

          <Field
            placeholder="Email"
            value={user.email}
            editable={false}
            keyboardType="email-address"
            style={{ backgroundColor: '#f0f0f0' }}
          />

          <Field
            placeholder="Gender"
            value={gender}
            onChangeText={setGender}
            editable={!loading}
          />

          <Field
            placeholder="Phone"
            value={phone}
            onChangeText={setPhone}
            editable={!loading}
            keyboardType="phone-pad"
          />

          {user.role === 'DRIVER' && (
            <Field
              placeholder="Profession"
              value={profession}
              onChangeText={setProfession}
              editable={!loading}
            />
          )}

          {loading ? (
            <ActivityIndicator size="large" color="#2563eb" />
          ) : (
            <Button onPress={onSubmit}>
              <ButtonText>Complete Registration</ButtonText>
            </Button>
          )}

          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={{ color: '#2563eb', textAlign: 'center', marginTop: 12 }}>Go Back</Text>
          </TouchableOpacity>
        </ScrollContainer>
      </Container>
    </>
  );
}
