import React from 'react';
import { View, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from '../listeRetoursTerrain.style';

interface RetoursSearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
}

export function RetoursSearchBar({ value, onChangeText }: RetoursSearchBarProps) {
  return (
    <View style={styles.searchSection}>
      <View style={styles.searchWrapper}>
        <Ionicons name="search" size={20} color="#999" />
        <TextInput
          style={styles.searchInput}
          placeholder="Rechercher un client, abonnement, PBO..."
          value={value}
          onChangeText={onChangeText}
        />
      </View>
    </View>
  );
}