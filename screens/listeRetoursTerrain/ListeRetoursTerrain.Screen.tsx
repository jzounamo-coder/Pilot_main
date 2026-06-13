import React, { useCallback } from 'react';
import { View, Text, FlatList, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { styles, PRIMARY_BLUE } from './listeRetoursTerrain.style';
import { useRetoursTerrain, RetourItem } from './listeRetoursTerrain.hooks';
import { RetoursHeader } from './components/RetoursHeader';
import { RetoursSearchBar } from './components/RetoursSearchBar';
import { FilterModal } from './components/FilterModal';
import { RetourDetailModal } from './components/RetourDetailModal';
import { RetourCard } from './components/RetourCard';

export default function ListeRetoursTerrain() {
  const navigation = useNavigation<any>();
  const {
    loading,
    retours,
    searchQuery,
    setSearchQuery,
    selectedFilter,
    setSelectedFilter,
    isModalOpen,
    setIsModalOpen,
    selectedItem,
    isDetailModalOpen,
    setIsDetailModalOpen,
    filteredData,
    fetchRetoursTerrain,
    openDetail,
  } = useRetoursTerrain();

  const handleSelectFilter = useCallback((filter: string) => {
    setSelectedFilter(filter);
    setIsModalOpen(false);
  }, [setSelectedFilter, setIsModalOpen]);

  const renderItem = useCallback(({ item }: { item: RetourItem }) => (
    <RetourCard item={item} onPress={() => openDetail(item)} />
  ), [openDetail]);

  return (
    <View style={styles.container}>
      
      <RetoursHeader 
        selectedFilter={selectedFilter}
        onBackPress={() => navigation.goBack()}
        onFilterPress={() => setIsModalOpen(true)}
      />

      <RetoursSearchBar 
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      <FilterModal 
        isOpen={isModalOpen}
        selectedFilter={selectedFilter}
        onSelectFilter={handleSelectFilter}
        onClose={() => setIsModalOpen(false)}
      />

      <RetourDetailModal 
        isOpen={isDetailModalOpen}
        item={selectedItem}
        onClose={() => setIsDetailModalOpen(false)}
      />

      {/* Liste principale */}
      {loading && retours.length === 0 ? (
        <View style={{ flex: 1, justifyContent: 'center' }}>
          <ActivityIndicator size="large" color={PRIMARY_BLUE} />
        </View>
      ) : (
        <FlatList
          data={filteredData}
          keyExtractor={(item) => item.id?.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.listContainer}
          refreshing={loading}
          onRefresh={fetchRetoursTerrain}
          ListEmptyComponent={
            <Text style={{ textAlign: 'center', color: '#888', marginTop: 40 }}>Aucun retour trouvé</Text>
          }
        />
      )}
    </View>
  );
}