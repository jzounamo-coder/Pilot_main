import React from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { styles } from './OEOTOD.style';
import { useOdvOtl, ClientItem } from './OEOTOD.hooks';
import { ClientCard } from './components/ClientCard';

export default function OdvOtlScreen() {
  const {
    searchText,
    setSearchText,
    filterVisible,
    setFilterVisible,
    cityFilter,
    setCityFilter,
    filteredData,
    suggestionsVilles,
    getTypeStyle,
    handleResetFilters,
    navigation
  } = useOdvOtl();

  const renderItem = ({ item }: { item: ClientItem }) => (
    <ClientCard 
      item={item}
      typeStyle={getTypeStyle(item.type)}
      onPress={() => navigation.navigate('ClientJobDetail', { client: item })}
    />
  );

  return (
    <View style={styles.container}>
      {/* HEADER : BARRE DE RECHERCHE & BOUTON FILTRE MODERNE */}
      <View style={styles.headerActions}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color="#999" />
          <TextInput
            placeholder="Rechercher..."
            style={styles.input}
            value={searchText}
            onChangeText={setSearchText}
          />
          {(searchText !== '' || cityFilter !== 'Toutes') && (
            <TouchableOpacity onPress={handleResetFilters}>
              <Ionicons name="close-circle" size={18} color="#999" style={{ marginRight: 5 }} />
            </TouchableOpacity>
          )}
        </View>
        
        <TouchableOpacity 
          style={[styles.filterBtn, filterVisible && { backgroundColor: '#3949AB' }]} 
          onPress={() => setFilterVisible(!filterVisible)}
        >
          <Ionicons name="filter" size={24} color="white" />
        </TouchableOpacity>
      </View>

      {/* BLOC DES SUGGESTIONS (Filtre horizontal) */}
      {filterVisible && (
        <View style={styles.suggestionsContainer}>
          <Text style={styles.suggestionTitle}>Filtrer par Ville :</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scrollSection}>
            {suggestionsVilles.map((v) => {
              const active = cityFilter === v;
              return (
                <TouchableOpacity 
                  key={v} 
                  style={[styles.chip, active && styles.chipActive]}
                  onPress={() => setCityFilter(v)}
                >
                  <Text style={[styles.chipText, active && styles.chipTextActive]}>{v}</Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      )}

      {/* Liste des Clients/Demandes Filtrée */}
      <FlatList
        data={filteredData}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={<Text style={styles.emptyText}>Aucun client trouvé.</Text>}
      />
    </View>
  );
}