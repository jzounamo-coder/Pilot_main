import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles, PRIMARY_BLUE } from '../pboList.style';

interface PboHeaderProps {
  selectedCity: string;
  onFilterPress: () => void;
}

export function PboHeader({ selectedCity, onFilterPress }: PboHeaderProps) {
  return (
    <View style={styles.headerContainer}>
      <View style={styles.headerTextContainer}>
        <Text style={styles.headerSubtitle}>suivi infrastructures</Text>
        <Text style={styles.headerTitle}>Liste des PBO</Text>
        {selectedCity !== 'Tous' && (
          <Text style={styles.headerFilterText}>Filtre actif : {selectedCity}</Text>
        )}
      </View>
      <TouchableOpacity style={styles.filterButton} onPress={onFilterPress} activeOpacity={0.8}>
        <Ionicons name="funnel" size={22} color={PRIMARY_BLUE} />
      </TouchableOpacity>
    </View>
  );
}