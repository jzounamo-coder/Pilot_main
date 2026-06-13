import React, { useCallback } from 'react';
import { View, Text, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; 
import { useNavigation } from '@react-navigation/native';

import { styles, PRIMARY_BLUE } from './pboList.style';
import { usePboList, PboItem } from './pboList.hooks';
import { PboHeader } from './components/PboHeader';
import { PboSearchBar } from './components/PboSearchBar';
import { CityFilterModal } from './components/CityFilterModal';
import { PboCard } from './components/PboCard';

export default function TabTwoScreen() {
  const navigation = useNavigation<any>();
  const {
    loading,
    page,
    selectedCity,
    setSelectedCity,
    isModalOpen,
    setIsModalOpen,
    searchCityQuery,
    setSearchCityQuery,
    searchIdQuery,
    setSearchIdQuery,
    filteredCitiesInModal,
    filteredPbos,
    loadMore
  } = usePboList();

  const handleSelectCity = useCallback((city: string) => {
    setSelectedCity(city);
    setSearchCityQuery(''); 
    setIsModalOpen(false); 
  }, [setSelectedCity, setSearchCityQuery, setIsModalOpen]);

  const renderItem = useCallback(({ item }: { item: PboItem }) => (
    <PboCard 
      item={item} 
      onPress={() => navigation.navigate('PboDetail', { pbo: item })} 
    />
  ), [navigation]);

  return (
    <View style={styles.container}>
      <PboHeader 
        selectedCity={selectedCity} 
        onFilterPress={() => setIsModalOpen(true)} 
      />

      <PboSearchBar 
        value={searchIdQuery} 
        onChangeText={setSearchIdQuery} 
      />

      <CityFilterModal
        isOpen={isModalOpen}
        searchCityQuery={searchCityQuery}
        onSearchCityChange={setSearchCityQuery}
        filteredCities={filteredCitiesInModal}
        selectedCity={selectedCity}
        onSelectCity={handleSelectCity}
        onClose={() => setIsModalOpen(false)}
      />

      {loading && page === 1 ? (
        <View style={{ flex: 1, justifyContent: 'center' }}>
          <ActivityIndicator size="large" color={PRIMARY_BLUE} />
        </View>
      ) : (
        <FlatList 
          data={filteredPbos} 
          keyExtractor={(item, index) => item.id + index} 
          renderItem={renderItem}
          onEndReached={loadMore}
          onEndReachedThreshold={0.5}
          contentContainerStyle={{ paddingVertical: 10 }}
          ListEmptyComponent={
            !loading ? <Text style={styles.emptyText}>Aucun PBO trouvé</Text> : null
          }
          ListFooterComponent={
            loading ? <ActivityIndicator size="small" color={PRIMARY_BLUE} style={{ margin: 10 }} /> : null
          }
        />
      )}

      <TouchableOpacity style={styles.fabMap} onPress={() => navigation.navigate('Map')}>
        <Ionicons name="location" size={30} color="white" />
      </TouchableOpacity>

      <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate('PboForm')}>
        <Ionicons name="add" size={35} color="white" />
      </TouchableOpacity>
    </View>
  );
}