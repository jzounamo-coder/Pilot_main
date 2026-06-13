import React from 'react';
import { View, Text, FlatList, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { styles, PRIMARY_BLUE } from './ticketsTraites.style';
import { useTicketsTraitesLogic } from './ticketsTraites.hooks';
import { TicketSearchBar } from './components/TicketSearchBar';
import { FilterModal } from './components/FilterModal';
import { TicketCard } from './components/TicketCard';
import { TicketDetailModal } from './components/TicketDetailModal';

export default function TicketsTraites() {
  const {
    loading,
    searchQuery,
    setSearchQuery,
    selectedFilter,
    setSelectedFilter,
    isFilterModalOpen,
    setIsFilterModalOpen,
    selectedTicket,
    isDetailModalOpen,
    setIsDetailModalOpen,
    filteredData,
    tickets,
    fetchTickets,
    openDetailModal
  } = useTicketsTraitesLogic();

  return (
    <View style={styles.container}>
      {/* 1. BARRE DE RECHERCHE & DECLENCHEUR FILTRE */}
      <TicketSearchBar 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onFilterPress={() => setIsFilterModalOpen(true)}
      />

      {/* 2. MODAL DE SÉLECTION DU FILTRE */}
      <FilterModal 
        visible={isFilterModalOpen}
        selectedFilter={selectedFilter}
        onSelectFilter={setSelectedFilter}
        onClose={() => setIsFilterModalOpen(false)}
      />

      {/* 3. MODAL DES DÉTAILS D'UN TICKET CLIENT */}
      <TicketDetailModal 
        visible={isDetailModalOpen}
        ticket={selectedTicket}
        onClose={() => setIsDetailModalOpen(false)}
      />

      {/* 4. ZONE D'AFFICHAGE ET CONTENU DE LA LISTE */}
      {loading && tickets.length === 0 ? (
        <View style={{ flex: 1, justifyContent: 'center' }}>
          <ActivityIndicator size="large" color={PRIMARY_BLUE} />
        </View>
      ) : (
        <FlatList
          data={filteredData}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TicketCard item={item} onDetailPress={openDetailModal} />
          )}
          contentContainerStyle={styles.listContainer}
          refreshing={loading}
          onRefresh={fetchTickets}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="alert-circle-outline" size={50} color="#ccc" />
              <Text style={{ textAlign: 'center', color: '#888', marginTop: 10 }}>
                Aucun enregistrement trouvé
              </Text>
            </View>
          }
        />
      )}
    </View>
  );
}