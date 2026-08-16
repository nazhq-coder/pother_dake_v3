import styled from 'styled-components/native';
import React from 'react';
import { Text } from 'react-native';
import Header from '../components/Header';
import RoleGuard from '../components/RoleGuard';

const Container = styled.View`
  flex: 1;
  padding: 16px;
  background-color: ${p => p.theme.colors.background};
`;

function AdminDashboardInner() {
  return (
    <>
      <Header navigation={{}} title="Admin" />
      <Container>
        <Text style={{fontSize: 18, fontWeight: '700'}}>Admin Dashboard</Text>
      </Container>
    </>
  );
}

export default RoleGuard(['ADMIN'], AdminDashboardInner);
