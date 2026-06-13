import React from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useStatus } from './Status.hooks';
import { styles } from './Status.styles';
import { TicketItem } from './components/TicketItem';

export default function StatusScreen() {
  const { 
    filteredTickets, 
    searchQuery, 
    handleNavigateToForm, 
    handleNavigateToDetail 
  } = useStatus();

  return (
    <View style={styles.container}>
      <FlatList 
        data={filteredTickets} 
        keyExtractor={(item) => item.id} 
        renderItem={({ item }) => (
          <TicketItem 
            item={item} 
            onPress={() => handleNavigateToDetail(item)} 
          />
        )} 
        ListEmptyComponent={
          searchQuery ? (
            <Text style={styles.emptyText}>
              Aucun résultat pour "{searchQuery}"
            </Text>
          ) : null
        }
      />
      
      {/* Bouton flottant d'ajout */}
      <TouchableOpacity style={styles.fab} onPress={handleNavigateToForm}>
        <Ionicons name="add" size={35} color="white" />
      </TouchableOpacity>
    </View>
  );
}