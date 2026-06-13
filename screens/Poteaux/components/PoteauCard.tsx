import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Poteau } from '../poteaux.hooks';
import { styles } from '../poteaux.style';

interface PoteauCardProps {
  item: Poteau;
  onPress: () => void;
}

export const PoteauCard = React.memo(({ item, onPress }: PoteauCardProps) => {
  const isE2C = item.type === 'E2C';
  
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.cardHeader}>
        <View style={styles.idContainer}>
          <Ionicons 
            name={isE2C ? 'flash' : 'call'} 
            size={20} 
            color={isE2C ? '#FFD600' : '#00C853'} 
          />
          <Text style={styles.poteauId}>{item.id}</Text>
        </View>
        <Text style={[styles.typeBadge, { backgroundColor: isE2C ? '#FFF9C4' : '#C8E6C9' }]}>
          {item.type}
        </Text>
      </View>

      <View style={styles.cardBody}>
        <View style={styles.coordRow}>
          <Ionicons name="location-outline" size={16} color="#666" />
          <Text style={styles.coordText}>Lat: {item.lat} | Lng: {item.lng}</Text>
        </View>
        <Text style={styles.villeText}>{item.ville}</Text>
      </View>
      
      <Ionicons name="chevron-forward" size={20} color="#CCC" style={styles.chevron} />
    </TouchableOpacity>
  );
});