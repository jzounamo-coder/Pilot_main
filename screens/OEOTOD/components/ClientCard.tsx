import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ClientItem } from '../OEOTOD.hooks';
import { styles } from '../OEOTOD.style';

interface ClientCardProps {
  item: ClientItem;
  typeStyle: { color: string; bg: string };
  onPress: () => void;
}

export const ClientCard = React.memo(({ item, typeStyle, onPress }: ClientCardProps) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.cardContent}>
        <View style={styles.infoSection}>
          <Text style={styles.clientName}>{item.nom}</Text>
          <Text style={styles.clientDetails}>
            <Ionicons name="call-outline" size={12} /> {item.tel}
          </Text>
          <Text style={styles.clientDetails}>
            <Ionicons name="location-outline" size={12} /> {item.ville}, {item.arrondissement}
          </Text>
        </View>
        <View style={[styles.badge, { backgroundColor: typeStyle.bg }]}>
          <Text style={[styles.badgeText, { color: typeStyle.color }]}>{item.type}</Text>
        </View>
      </View>
      <View style={styles.actionButton}>
        <Ionicons name="chevron-forward" size={20} color="#1A237E" />
      </View>
    </TouchableOpacity>
  );
});