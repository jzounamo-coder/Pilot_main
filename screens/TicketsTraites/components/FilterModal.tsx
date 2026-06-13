import React from 'react';
import { View, Text, Modal, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles, PRIMARY_BLUE } from '../ticketsTraites.style';

interface FilterModalProps {
  visible: boolean;
  selectedFilter: string;
  onSelectFilter: (filter: string) => void;
  onClose: () => void;
}

export function FilterModal({ visible, selectedFilter, onSelectFilter, onClose }: FilterModalProps) {
  return (
    <Modal visible={visible} transparent={true} animationType="fade" onRequestClose={onClose}>
      <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={onClose}>
        <View style={styles.modalContent} onStartShouldSetResponder={() => true}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Filtrer la liste</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color="#333" />
            </TouchableOpacity>
          </View>
          {['Tous', 'Nommé', 'Non Nommé'].map((option) => (
            <TouchableOpacity
              key={option}
              style={[styles.dropdownItem, selectedFilter === option && { backgroundColor: '#F0F2FF' }]}
              onPress={() => {
                onSelectFilter(option);
                onClose();
              }}
            >
              <Text style={selectedFilter === option ? styles.itemTextActive : styles.itemText}>
                {option === 'Tous' ? 'Afficher tout' : option === 'Nommé' ? 'PBO Nommés' : 'DOU (Non Nommés)'}
              </Text>
              {selectedFilter === option && <Ionicons name="checkmark" size={18} color={PRIMARY_BLUE} />}
            </TouchableOpacity>
          ))}
        </View>
      </TouchableOpacity>
    </Modal>
  );
}