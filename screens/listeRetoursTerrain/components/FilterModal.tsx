import React from 'react';
import { View, Text, Modal, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles, PRIMARY_BLUE } from '../listeRetoursTerrain.style';

interface FilterModalProps {
  isOpen: boolean;
  selectedFilter: string;
  onSelectFilter: (filter: string) => void;
  onClose: () => void;
}

export function FilterModal({ isOpen, selectedFilter, onSelectFilter, onClose }: FilterModalProps) {
  return (
    <Modal visible={isOpen} transparent={true} animationType="fade" onRequestClose={onClose}>
      <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={onClose}>
        <View style={styles.modalContent} onStartShouldSetResponder={() => true}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Filtrer les retours</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color="#333" />
            </TouchableOpacity>
          </View>
          {['Tous', 'Nommé', 'Non Nommé'].map((option) => (
            <TouchableOpacity
              key={option}
              style={[styles.dropdownItem, selectedFilter === option && { backgroundColor: '#F0F2FF' }]}
              onPress={() => onSelectFilter(option)}
            >
              <Text style={selectedFilter === option ? styles.itemTextActive : styles.itemText}>
                {option === 'Tous' ? 'Afficher tout' : `PBO ${option}s`}
              </Text>
              {selectedFilter === option && <Ionicons name="checkmark" size={18} color={PRIMARY_BLUE} />}
            </TouchableOpacity>
          ))}
        </View>
      </TouchableOpacity>
    </Modal>
  );
}