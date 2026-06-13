import React from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from '../installations.style';

interface FiltersProps {
  search: string;
  setSearch: (text: string) => void;
  showFilters: boolean;
  setShowFilters: (show: boolean) => void;
  selectedVille: string;
  setSelectedVille: (ville: string) => void;
  selectedStatut: string;
  setSelectedStatut: (statut: string) => void;
  suggestionsVilles: string[];
  suggestionsStatuts: string[];
  onReset: () => void;
}

export function InstallationFilters({
  search,
  setSearch,
  showFilters,
  setShowFilters,
  selectedVille,
  setSelectedVille,
  selectedStatut,
  setSelectedStatut,
  suggestionsVilles,
  suggestionsStatuts,
  onReset
}: FiltersProps) {
  const isFiltered = search !== '' || selectedVille !== 'Toutes' || selectedStatut !== 'Tous';

  return (
    <View>
      <View style={styles.headerActions}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={18} color="#999" />
          <TextInput
            placeholder="Rechercher une installation..."
            style={styles.input}
            value={search}
            onChangeText={setSearch}
          />
          {isFiltered && (
            <TouchableOpacity onPress={onReset}>
              <Ionicons name="close-circle" size={16} color="#999" style={{ marginRight: 5 }} />
            </TouchableOpacity>
          )}
        </View>
        
        <TouchableOpacity 
          style={[styles.filterBtn, showFilters && { backgroundColor: '#3949AB' }]} 
          onPress={() => setShowFilters(!showFilters)}
        >
          <Ionicons name="filter" size={20} color="white" />
        </TouchableOpacity>
      </View>

      {showFilters && (
        <View style={styles.suggestionsContainer}>
          <Text style={styles.suggestionTitle}>Filtrer par Ville :</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scrollSection}>
            {suggestionsVilles.map((ville) => {
              const active = selectedVille === ville;
              return (
                <TouchableOpacity 
                  key={ville} 
                  style={[styles.chip, active && styles.chipActive]} 
                  onPress={() => setSelectedVille(ville)}
                >
                  <Text style={[styles.chipText, active && styles.chipTextActive]}>{ville}</Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          <Text style={styles.suggestionTitle}>Filtrer par Statut :</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scrollSection}>
            {suggestionsStatuts.map((statut) => {
              const active = selectedStatut === statut;
              return (
                <TouchableOpacity 
                  key={statut} 
                  style={[styles.chip, active && styles.chipActive]} 
                  onPress={() => setSelectedStatut(statut)}
                >
                  <Text style={[styles.chipText, active && styles.chipTextActive]}>{statut}</Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      )}
    </View>
  );
}