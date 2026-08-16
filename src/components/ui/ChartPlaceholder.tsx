import styled from 'styled-components/native';
import React from 'react';
import { Text } from 'react-native';

const Box = styled.View`
  height: 180px;
  border-radius: 8px;
  background-color: #eef2ff;
  align-items: center;
  justify-content: center;
`;

export default function ChartPlaceholder({ title }: { title?: string }) {
  return (
    <Box>
      <Text style={{fontWeight: '700', color: '#3730a3'}}>{title || 'Chart'}</Text>
      <Text style={{marginTop: 8, color: '#4c51bf'}}>Chart placeholder (convert to RN chart later)</Text>
    </Box>
  );
}
