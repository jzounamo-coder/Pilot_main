import React from 'react';
import { View, Text, FlatList } from 'react-native';

import { styles } from './installations.style';
import { useInstallationsLogic } from './installations.hooks';
import { InstallationDashboard } from './components/InstallationDashboard';
import { InstallationFilters } from './components/InstallationFilters';
import { InstallationCard } from './components/InstallationCard';

export default function InstallationsScreen() {
  const {
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
    filteredInstallations,
    stats,
    resetFilters,
    ouvrirItineraire,
    navigateToValidation
  } = useInstallationsLogic();

  return (
    <View style={styles.container}>
      
      {/* 1. COMPOSANT TABLEAU DE BORD (STATISTIQUES COMTPEURS) */}
      <InstallationDashboard stats={stats} />

      {/* 2. COMPOSANT RECHERCHE ET BARRES DE FILTRAGE */}
      <InstallationFilters 
        search={search}
        setSearch={setSearch}
        showFilters={showFilters}
        setShowFilters={setShowFilters}
        selectedVille={selectedVille}
        setSelectedVille={setSelectedVille}
        selectedStatut={selectedStatut}
        setSelectedStatut={setSelectedStatut}
        suggestionsVilles={suggestionsVilles}
        suggestionsStatuts={suggestionsStatuts}
        onReset={resetFilters}
      />

      {/* 3. LISTE PRINCIPALE DES CHANTIERS D'INSTALLATION */}
      <FlatList
        data={filteredInstallations}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <InstallationCard 
            item={item} 
            onCardPress={navigateToValidation}
            onGpsPress={ouvrirItineraire}
          />
        )}
        contentContainerStyle={{ paddingBottom: 10 }}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Aucune installation trouvée.</Text>
        }
      />
    </View>
  );
}