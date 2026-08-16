import styled from 'styled-components/native';
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, ActivityIndicator, Alert } from 'react-native';
import Header from '../components/Header';
import { useAuth } from '../auth/AuthContext';
import { RootStackParamList } from '../navigation';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

type Props = NativeStackScreenProps<RootStackParamList, 'Auth'>;

const Container = styled.View`
  flex: 1;
  padding: 16px;
  background-color: ${p => p.theme.colors.background};
`;

const ScrollView = styled.ScrollView`
  padding: 16px;
  background-color: ${p => p.theme.colors.background};
`;

const Title = styled.Text`
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 8px;
  color: ${p => p.theme.colors.primary};
`;

const Subtitle = styled.Text`
  font-size: 14px;
  color: #6b7280;
  margin-bottom: 20px;
`;

const Field = styled.TextInput`
  border-width: 1px;
  border-color: #e5e7eb;
  padding: 12px;
  border-radius: 8px;
  margin-bottom: 12px;
  background-color: #fff;
  font-size: 14px;
`;

const Button = styled.TouchableOpacity`
  background-color: #2563eb;
  padding: 14px;
  border-radius: 8px;
  align-items: center;
  margin-top: 16px;
`;

const ButtonText = styled.Text`
  color: #fff;
  font-weight: 700;
  font-size: 16px;
`;

const DemoSection = styled.View`
  background-color: #f0f4ff;
  border-radius: 8px;
  padding: 12px;
  margin-top: 20px;
`;

const DemoTitle = styled.Text`
  font-size: 13px;
  font-weight: 600;
  color: #4f46e5;
  margin-bottom: 8px;
`;

const DemoText = styled.Text`
  font-size: 12px;
  color: #666;
  margin-bottom: 6px;
`;

const DemoAccount = styled.View`
  background-color: #fff;
  padding: 8px;
  border-radius: 4px;
  margin-bottom: 6px;
`;

const DemoEmail = styled.Text`
  font-size: 11px;
  font-family: monospace;
  color: #374151;
  font-weight: 600;
`;

export default function AuthScreen({ navigation }: Props) {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const onLogin = async () => {
    if (!email.trim()) {
      Alert.alert('Validation Error', 'Please enter an email address');
      return;
    }

    setLoading(true);
    try {
      await login(email.trim(), password);
      setLoading(false);
      Alert.alert('Success', 'Logged in successfully');
      // Navigation handled by root navigator based on auth state
    } catch (err: any) {
      setLoading(false);
      const msg = err?.message || 'Login failed';
      Alert.alert('Login Error', String(msg));
    }
  };

  const quickLogin = async (quickEmail: string) => {
    setLoading(true);
    try {
      await login(quickEmail, 'password');
      setLoading(false);
    } catch (err: any) {
      setLoading(false);
      Alert.alert('Login Error', err?.message || 'Login failed');
    }
  };

  return (
    <>
      <Header navigation={navigation} title="Authentication" />
      <Container>
        <ScrollView>
          <Title>Sign In</Title>
          <Subtitle>Demo mode - Use any email address to login</Subtitle>

          <Field 
            placeholder="Email address" 
            value={email} 
            onChangeText={setEmail} 
            autoCapitalize="none" 
            keyboardType="email-address"
            editable={!loading}
          />
          <Field 
            placeholder="Password (optional)" 
            value={password} 
            onChangeText={setPassword} 
            secureTextEntry
            editable={!loading}
          />

          {loading ? (
            <ActivityIndicator size="large" color="#2563eb" style={{ marginTop: 16 }} />
          ) : (
            <Button onPress={onLogin}>
              <ButtonText>Sign In</ButtonText>
            </Button>
          )}

          <DemoSection>
            <DemoTitle>📱 DEMO MODE - Quick Login</DemoTitle>
            <DemoText>Running in offline mock mode. Use any of these emails to test:</DemoText>
            
            <DemoAccount>
              <DemoEmail>Passenger: samir@example.com</DemoEmail>
              <TouchableOpacity 
                onPress={() => quickLogin('samir@example.com')}
                style={{ marginTop: 6 }}
              >
                <Text style={{ color: '#2563eb', fontSize: 12, fontWeight: '600' }}>
                  Login as Samir (Passenger)
                </Text>
              </TouchableOpacity>
            </DemoAccount>

            <DemoAccount>
              <DemoEmail>Passenger: nadia@example.com</DemoEmail>
              <TouchableOpacity 
                onPress={() => quickLogin('nadia@example.com')}
                style={{ marginTop: 6 }}
              >
                <Text style={{ color: '#2563eb', fontSize: 12, fontWeight: '600' }}>
                  Login as Nadia (Passenger)
                </Text>
              </TouchableOpacity>
            </DemoAccount>

            <DemoAccount>
              <DemoEmail>Driver: ashraf.khan@potherdake.com</DemoEmail>
              <TouchableOpacity 
                onPress={() => quickLogin('ashraf.khan@potherdake.com')}
                style={{ marginTop: 6 }}
              >
                <Text style={{ color: '#2563eb', fontSize: 12, fontWeight: '600' }}>
                  Login as Ashraf (Driver)
                </Text>
              </TouchableOpacity>
            </DemoAccount>

            <DemoText style={{ marginTop: 8, fontStyle: 'italic', color: '#8b5cf6' }}>
              Or enter any email address to create a demo account
            </DemoText>
          </DemoSection>
        </ScrollView>
      </Container>
    </>
  );
}
