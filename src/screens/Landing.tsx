import styled from 'styled-components/native';
import React from 'react';
import { View, Text } from 'react-native';
import Header from '../components/Header';

const Container = styled.View`
  flex: 1;
  padding: 16px;
  background-color: ${p => p.theme.colors.background};
`;

export default function LandingScreen({ navigation }: any) {
  return (
    <>
      <Header navigation={navigation} title="Home" />
      <Container>
        <Text style={{fontSize: 20, fontWeight: '700'}}>Landing Page</Text>
        <Text style={{marginTop: 12, color: '#2563eb'}} onPress={() => navigation.navigate('Search')}>Go to Search</Text>
      </Container>
    </>
  );
}
