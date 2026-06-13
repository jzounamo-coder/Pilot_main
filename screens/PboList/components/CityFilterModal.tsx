import React from 'react';
import { View, Text, Modal, TextInput, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles, PRIMARY_BLUE } from '../pboList.style';

interface CityFilterModalProps {
  isOpen: boolean;
  searchCityQuery: string;
  onSearchCityChange: (text: string) => void;
  filteredCities: string[];
  selectedCity: string;
  onSelectCity: (city: string) => void;
  onClose: () => void;
}

export function CityFilterModal({
  isOpen,
  searchCityQuery,
  onSearchCityChange,
  filteredCities,
  selectedCity,
  onSelectCity,
  onClose
}: CityFilterModalProps) {
  return (
    <Modal visible={isOpen} transparent={true} animationType="fade" onRequestClose={onClose}>
      <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={onClose}>
        <View style={styles.modalContent} onStartShouldSetResponder={() => true}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Filtrer par Ville</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color="#333" />
            </TouchableOpacity>
          </View>

          <View style={styles.searchContainer}>
            <Ionicons name="search" size={18} color="#666" style={{ marginRight: 8 }} />
            <TextInput
              style={styles.searchInput}
              placeholder="Rechercher ou taper une ville..."
              value={searchCityQuery}
              onChangeText={onSearchCityChange}
              clearButtonMode="while-editing"
            />
          </View>

          <ScrollView style={{ maxHeight: 250 }} keyboardShouldPersistTaps="handled">
            {filteredCities.length === 0 ? (
              <Text style={styles.emptyText}>Aucune ville trouvée</Text>
            ) : (
              filteredCities.map((city) => (
                <TouchableOpacity 
                  key={city} 
                  style={[styles.dropdownItem, selectedCity === city && { backgroundColor: '#F0F2FF' }]} 
                  onPress={() => onSelectCity(city)}
                >
                  <Text style={selectedCity === city ? styles.itemTextActive : styles.itemText}>
                    {city}
                  </Text>
                  {selectedCity === city && <Ionicons name="checkmark" size={18} color={PRIMARY_BLUE} />}
                </TouchableOpacity>
              ))
            )}
          </ScrollView>
        </View>
      </TouchableOpacity>
    </Modal>
  );
}