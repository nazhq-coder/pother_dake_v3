import React from 'react';
import styled from 'styled-components/native';
import { TouchableOpacity, Text } from 'react-native';
import { useAuth } from '../auth/AuthContext';

const Overlay = styled.TouchableOpacity`
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0,0,0,0.35);
  z-index: 40;
`;

const Drawer = styled.View`
  width: 260px;
  background-color: ${p => p.theme.colors.background};
  height: 100%;
  padding: 16px;
  elevation: 6;
`;

const Item = styled.TouchableOpacity`
  padding-vertical: 12px;
`;

const ItemText = styled.Text`
  font-size: 16px;
  color: ${p => p.theme.colors.primary};
`;

export default function Sidebar({ visible, onClose, navigation }: any) {
  const { user } = useAuth();
  // user.role expected to be one of: 'DRIVER', 'PASSENGER', 'ADMIN'

  if (!visible) return null;

  const canSeeAdmin = user && user.role === 'ADMIN';
  const canSeePassenger = user && user.role === 'PASSENGER';
  const canSeeDriver = user && user.role === 'DRIVER';

  const go = (route: string) => {
    onClose();
    navigation.navigate(route as any);
  };

  return (
    <Overlay activeOpacity={1} onPress={onClose}>
      <Drawer>
        <Item onPress={() => go('Landing')}>
          <ItemText>Home</ItemText>
        </Item>
        <Item onPress={() => go('Search')}>
          <ItemText>Search</ItemText>
        </Item>
        {canSeePassenger && (
          <Item onPress={() => go('Passenger')}>
            <ItemText>Passenger</ItemText>
          </Item>
        )}
        {canSeeDriver && (
          <Item onPress={() => go('Driver')}>
            <ItemText>Driver</ItemText>
          </Item>
        )}
        {canSeeAdmin && (
          <Item onPress={() => go('Admin')}>
            <ItemText>Admin</ItemText>
          </Item>
        )}
        <Item onPress={() => go('Auth')}>
          <ItemText>Sign In</ItemText>
        </Item>
      </Drawer>
    </Overlay>
  );
}
