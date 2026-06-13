import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from '../listeRetoursTerrain.style';

interface RetoursHeaderProps {
  selectedFilter: string;
  onBackPress: () => void;
  onFilterPress: () => void;
}

export function RetoursHeader({ selectedFilter, onBackPress, onFilterPress }: RetoursHeaderProps) {
  return (
    <View style={styles.header}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <TouchableOpacity style={styles.backBtn} onPress={onBackPress}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Retours Terrain</Text>
        {selectedFilter !== 'Tous' && (
          <Text style={styles.filterSubtitle}> ({selectedFilter})</Text>
        )}
      </View>
      <TouchableOpacity style={styles.filterButton} onPress={onFilterPress}>
        <Ionicons name="funnel" size={20} color="white" />
      </TouchableOpacity>
    </View>
  );
}