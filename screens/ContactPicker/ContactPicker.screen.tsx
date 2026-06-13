// ContactPicker.screen.tsx
import React from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from './ContactPicker.styles';
import { useContactPicker } from './ContactPicker.hooks';

export default function ContactPickerScreen({ navigation }: any) {
  // On extrait tout ce que le Hook a préparé pour nous
  const {
    filteredContacts,
    loading,
    search,
    handleSearch,
    handleSelectContact
  } = useContactPicker(navigation);

  // Le rendu visuel de chaque ligne de contact
  const renderContact = ({ item }: any) => (
    <TouchableOpacity 
      style={styles.item}
      onPress={() => handleSelectContact(item)}
    >
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{item.name ? item.name[0].toUpperCase() : '?'}</Text>
      </View>
      <View>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.phone}>{item.phoneNumber}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* BARRE DE RECHERCHE */}
      <View style={styles.searchHeader}>
        <Ionicons name="search" size={20} color="gray" style={{ marginLeft: 10 }} />
        <TextInput 
          style={styles.searchBar} 
          placeholder="Rechercher sur SpeedPro..." 
          value={search}
          onChangeText={handleSearch}
        />
      </View>

      {/* RECHARGE / LISTE */}
      {loading ? (
        <ActivityIndicator size="large" color="#1A237E" style={{ marginTop: 20 }} />
      ) : (
        <FlatList 
          data={filteredContacts}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderContact}
        />
      )}
    </View>
  );
}