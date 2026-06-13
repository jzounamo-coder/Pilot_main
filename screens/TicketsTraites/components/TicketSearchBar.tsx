import React from 'react';
import { View, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles, PRIMARY_BLUE } from '../ticketsTraites.style';

interface TicketSearchBarProps {
  searchQuery: string;
  setSearchQuery: (text: string) => void;
  onFilterPress: () => void;
}

export function TicketSearchBar({ searchQuery, setSearchQuery, onFilterPress }: TicketSearchBarProps) {
  return (
    <View style={styles.searchSection}>
      <View style={styles.searchWrapper}>
        <Ionicons name="search" size={20} color="#999" />
        <TextInput
          style={styles.searchInput}
          placeholder="Rechercher un client, PBO, DOU..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <TouchableOpacity style={{ padding: 5 }} onPress={onFilterPress}>
          <Ionicons name="funnel" size={20} color={PRIMARY_BLUE} />
        </TouchableOpacity>
      </View>
    </View>
  );
}