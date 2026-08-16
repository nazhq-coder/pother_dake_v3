import React, { useState } from 'react';
import styled from 'styled-components/native';
import { Text, TouchableOpacity } from 'react-native';
import Sidebar from './Sidebar';
import { useAuth } from '../auth/AuthContext';

const HeaderContainer = styled.View`
  height: 56px;
  padding: 12px 16px;
  background-color: ${p => p.theme.colors.background};
  border-bottom-width: 1px;
  border-bottom-color: #e6eef8;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const Title = styled.Text`
  font-size: 18px;
  font-weight: 700;
  color: ${p => p.theme.colors.primary};
`;

const MenuButton = styled.TouchableOpacity`
  padding: 8px;
`;

export default function Header({ navigation, title }: any) {
  const [open, setOpen] = useState(false);
  const { user } = useAuth();

  return (
    <>
      <HeaderContainer>
        <MenuButton onPress={() => setOpen(true)}>
          <Text style={{color: '#2563eb', fontWeight: '600'}}>Menu</Text>
        </MenuButton>
        <Title>{title || 'Pother Dake'}</Title>
        <MenuButton onPress={() => navigation.navigate('Profile')}>
          <Text style={{color: '#2563eb', fontWeight: '600'}}>{user?.name?.split(' ')[0] || 'Account'}</Text>
        </MenuButton>
      </HeaderContainer>
      <Sidebar visible={open} onClose={() => setOpen(false)} navigation={navigation} />
    </>
  );
}
