import React from 'react';
import { View, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from '../pboList.style';

interface PboSearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
}

export function PboSearchBar({ value, onChangeText }: PboSearchBarProps) {
  return (
    <View style={styles.mainSearchContainer}>
      <Ionicons name="search" size={20} color="#666" style={{ marginRight: 8 }} />
      <TextInput
        style={styles.mainSearchInput}
        placeholder="Rechercher par ID PBO (ex: PB7384)..."
        value={value}
        onChangeText={onChangeText}
        autoCapitalize="characters"
        clearButtonMode="while-editing"
      />
      {value !== '' && (
        <TouchableOpacity onPress={() => onChangeText('')}>
          <Ionicons name="close-circle" size={20} color="#888" />
        </TouchableOpacity>
      )}
    </View>
  );
}