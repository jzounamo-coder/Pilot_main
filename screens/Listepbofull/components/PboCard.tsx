import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { PboItem } from '../pboList.hooks';
import { styles, PRIMARY_BLUE } from '../pboList.style';

interface PboCardProps {
  item: PboItem;
  onPress: () => void;
}

export const PboCard = React.memo(({ item, onPress }: PboCardProps) => {
  const isFull = item.portsOccupes >= item.nbPbo;

  return (
    <TouchableOpacity style={styles.pboCard} onPress={onPress}>
      <View style={styles.iconContainer}>
        <MaterialCommunityIcons name="package-variant-closed" size={32} color={PRIMARY_BLUE} />
      </View>
      
      <View style={styles.pboContent}>
        <View style={styles.pboHeader}>
          <Text style={styles.pboTitle} numberOfLines={1}>{item.nomPbo}</Text>
          <Text style={styles.pboDate}>{item.dateMaj}</Text>
        </View>
        
        <Text style={styles.pboLoc}>
          {item.localisation} {item.arrondissement !== 'Non renseigné' ? `- ${item.arrondissement}` : ''}
        </Text>
        
        <View style={styles.pboFooter}>
          <View style={[styles.badge, { backgroundColor: isFull ? '#FEE2E2' : '#F0F0F0' }]}>
            <Text style={[styles.badgeText, { color: isFull ? '#EF4444' : '#666' }]}>
              OCCUPÉS: {item.portsOccupes}
            </Text>
          </View>

          <View style={[styles.badge, { backgroundColor: '#E7F3F0' }]}>
            <Text style={[styles.badgeText, { color: PRIMARY_BLUE }]}>
              LIBRES: {item.portsDispos}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
});