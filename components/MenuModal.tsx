import React from 'react';
import { Modal, TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface MenuModalProps {
  isVisible: boolean;
  onClose: () => void;
  onLogout: () => void;
  onNavigateCreate: () => void;       // Pour "Créer nouveau"
  onNavigateCreateGroup: () => void;  // Pour "Nouveau Groupe"
}

const PRIMARY_BLUE = '#1A237E';

const MenuModal = ({ isVisible, onClose, onLogout, onNavigateCreate, onNavigateCreateGroup }: MenuModalProps) => {
  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity style={styles.modalOverlay} onPress={onClose}>
        <View style={styles.menuContainer}>
          


          {/* 2. Bouton Nouveau Groupe */}
          <TouchableOpacity onPress={onNavigateCreateGroup} style={styles.menuItem}>
            <Ionicons name="people-outline" size={24} color={PRIMARY_BLUE} />
            <Text style={{ marginLeft: 10, color: PRIMARY_BLUE, fontSize: 16 }}>Nouveau Groupe</Text>
          </TouchableOpacity>

          {/* 3. Bouton Déconnexion (avec séparateur) */}
          <TouchableOpacity 
            onPress={onLogout} 
            style={[styles.menuItem, { borderTopWidth: 1, borderTopColor: '#eee', marginTop: 5 }]}
          >
            <Ionicons name="log-out-outline" size={24} color="red" />
            <Text style={{ marginLeft: 10, color: 'red', fontSize: 16 }}>Déconnexion</Text>
          </TouchableOpacity>
          
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.3)' },
  menuContainer: { 
    position: 'absolute', top: 50, right: 10, backgroundColor: 'white', 
    borderRadius: 8, padding: 5, elevation: 5, shadowColor: '#000', 
    shadowOpacity: 0.2, shadowRadius: 5, minWidth: 180 
  },
  menuItem: { flexDirection: 'row', alignItems: 'center', padding: 12 }
});

export default MenuModal;