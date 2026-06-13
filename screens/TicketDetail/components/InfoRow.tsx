import React from 'react';
import { View, Text } from 'react-native';
import { styles } from '../TicketDetail.styles';

interface InfoRowProps {
  label: string;
  value: string | number | undefined | null;
}

export const InfoRow: React.FC<InfoRowProps> = ({ label, value }) => {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value || '---'}</Text>
    </View>
  );
};