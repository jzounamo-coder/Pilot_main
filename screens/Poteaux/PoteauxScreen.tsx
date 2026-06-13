import React from 'react';
import { View, Text, FlatList, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { styles } from './poteaux.style';
import { usePoteaux, usePoteauDetail, Poteau } from './poteaux.hooks';
import { PoteauCard } from './components/PoteauCard';
import { InfoRow } from './components/InfoRow';

// ── ÉCRAN PRINCIPAL : LISTE DES POTEAUX ──
export default function PoteauxScreen() {
  const {
    search,
    setSearch,
    filterVisible,
    setFilterVisible,
    selectedVille,
    setSelectedVille,
    filteredPoteaux,
    suggestionsVilles,
    handleResetFilters,
    navigation,
  } = usePoteaux();

  const renderItem = ({ item }: { item: Poteau }) => (
    <PoteauCard 
      item={item} 
      onPress={() => navigation.navigate('PoteauDetail', { poteau: item })} 
    />
  );

  return (
    <View style={styles.container}>
      {/* Header avec Barre de Recherche et Filtre */}
      <View style={styles.headerActions}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color="#999" />
          <TextInput 
            placeholder="Rechercher un poteau..." 
            style={styles.input}
            value={search}
            onChangeText={setSearch}
          />
          {(search !== '' || selectedVille !== 'Toutes') && (
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
              const active = selectedVille === v;
              return (
                <TouchableOpacity 
                  key={v} 
                  style={[styles.chip, active && styles.chipActive]}
                  onPress={() => setSelectedVille(v)}
                >
                  <Text style={[styles.chipText, active && styles.chipTextActive]}>{v}</Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      )}

      {/* Liste des Poteaux Filtrée */}
      <FlatList
        data={filteredPoteaux}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={<Text style={styles.emptyText}>Aucun poteau trouvé</Text>}
      />

      {/* Bouton Faire une demande */}
      <TouchableOpacity 
        style={styles.fab} 
        onPress={() => navigation.navigate('DemandePoteau')}
      >
        <Ionicons name="add" size={30} color="white" />
        <Text style={styles.fabText}>DEMANDE POTEAU</Text>
      </TouchableOpacity>
    </View>
  );
}

// ── ÉCRAN DE DÉTAIL D'UN POTEAU ──
export function PoteauDetailScreen() {
  const { poteau, navigation } = usePoteauDetail();

  return (
    <View style={styles.detailContainer}>
      <View style={styles.detailCard}>
        <View style={styles.iconCircle}>
          <Ionicons name="construct" size={50} color="#1A237E" />
        </View>
        
        <Text style={styles.detailId}>{poteau.id}</Text>
        
        <View style={styles.infoBox}>
          <InfoRow label="Latitude" value={poteau.lat} icon="location" />
          <InfoRow label="Longitude" value={poteau.lng} icon="location" />
          <InfoRow 
            label="État" 
            value={poteau.etat} 
            icon="stats-chart" 
            color={poteau.etat === 'Opérationnel' ? 'green' : 'orange'} 
          />
          <InfoRow label="Nombre PBO" value={poteau.nbPbo.toString()} icon="git-network" />
        </View>

        <TouchableOpacity 
          style={styles.btnRenseigner}
          onPress={() => navigation.navigate('RenseignerPoteau', { poteau: poteau })}
        >
          <Text style={styles.btnText}>RENSEIGNER</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}