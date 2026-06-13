import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from '../poteaux.style';

interface InfoRowProps {
  label: string;
  value: string;
  icon: keyof typeof Ionicons.photoLibrary | any;
  color?: string;
}

export const InfoRow = React.memo(({ label, value, icon, color }: InfoRowProps) => (
  <View style={styles.infoRow}>
    <Ionicons name={icon} size={20} color={color || '#1A237E'} />
    <Text style={styles.infoLabel}>{label} :</Text>
    <Text style={styles.infoValue}>{value}</Text>
  </View>
));