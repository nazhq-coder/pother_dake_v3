import styled from 'styled-components/native';
import React from 'react';
import { Text } from 'react-native';

const Container = styled.View`
  background-color: #fff;
  padding: 12px;
  border-radius: 8px;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
  min-width: 120px;
  elevation: 2;
`;

const Label = styled.Text`
  font-size: 12px;
  color: #6b7280;
`;

const Value = styled.Text`
  font-size: 18px;
  font-weight: 700;
  margin-top: 6px;
`;

export default function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <Container>
      <Label>{label}</Label>
      <Value>{value}</Value>
    </Container>
  );
}
