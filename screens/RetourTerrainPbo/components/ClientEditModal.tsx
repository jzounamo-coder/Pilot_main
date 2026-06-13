import React from 'react';
import { View, Text, Modal, KeyboardAvoidingView, ScrollView, TextInput, TouchableOpacity, ActivityIndicator, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ClientPbo } from '../useRetourTerrain.hooks';
import { styles } from '../retourTerrain.styles';

interface ClientEditModalProps {
  isVisible: boolean;
  onClose: () => void;
  isReady: boolean;
  currentClient: ClientPbo | null;
  savingClient: boolean;
  formFields: {
    editNom: string; setEditNom: (t: string) => void;
    editPrenom: string; setEditPrenom: (t: string) => void;
    editTelephone: string; setEditTelephone: (t: string) => void;
    editNumAbonnement: string; setEditNumAbonnement: (t: string) => void;
    editArrondissement: string; setEditArrondissement: (t: string) => void;
    editQuartier: string; setEditQuartier: (t: string) => void;
    editAdresse: string; setEditAdresse: (t: string) => void;
  };
  onSave: () => void;
}

export const ClientEditModal: React.FC<ClientEditModalProps> = ({
  isVisible, onClose, isReady, currentClient, savingClient, formFields, onSave
}) => {
  return (
    <Modal visible={isVisible} animationType="slide" transparent={true} onRequestClose={onClose}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Configuration {currentClient?.positionCassette}</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color="#333" />
            </TouchableOpacity>
          </View>
          
          {isReady ? (
            <ScrollView showsVerticalScrollIndicator={false} style={styles.modalForm} contentContainerStyle={{ paddingBottom: 20 }}>
              {/* Ligne 1: Nom et Prénom */}
              <View style={styles.formRow}>
                <View style={styles.formCol}>
                  <Text style={styles.inputLabel}>Nom *</Text>
                  <TextInput style={styles.modalInput} value={formFields.editNom} onChangeText={formFields.setEditNom} />
                </View>
                <View style={styles.formCol}>
                  <Text style={styles.inputLabel}>Prénom *</Text>
                  <TextInput style={styles.modalInput} value={formFields.editPrenom} onChangeText={formFields.setEditPrenom} />
                </View>
              </View>

              {/* Ligne 2: Téléphone et Abonnement */}
              <View style={styles.formRow}>
                <View style={styles.formCol}>
                  <Text style={styles.inputLabel}>Téléphone *</Text>
                  <TextInput style={styles.modalInput} value={formFields.editTelephone} onChangeText={formFields.setEditTelephone} keyboardType="phone-pad" />
                </View>
                <View style={styles.formCol}>
                  <Text style={styles.inputLabel}>N° Abonnement</Text>
                  <TextInput style={styles.modalInput} value={formFields.editNumAbonnement} onChangeText={formFields.setEditNumAbonnement} />
                </View>
              </View>

              {/* Ligne 3: Arrondissement et Quartier */}
              <View style={styles.formRow}>
                <View style={styles.formCol}>
                  <Text style={styles.inputLabel}>Arrondissement</Text>
                  <TextInput style={styles.modalInput} value={formFields.editArrondissement} onChangeText={formFields.setEditArrondissement} />
                </View>
                <View style={styles.formCol}>
                  <Text style={styles.inputLabel}>Quartier</Text>
                  <TextInput style={styles.modalInput} value={formFields.editQuartier} onChangeText={formFields.setEditQuartier} />
                </View>
              </View>

              {/* Ligne 4: Adresse Complète */}
              <Text style={styles.inputLabel}>Adresse Complète</Text>
              <TextInput style={styles.modalInput} value={formFields.editAdresse} onChangeText={formFields.setEditAdresse} />
            </ScrollView>
          ) : (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <ActivityIndicator size="large" color={styles.modalBtnSave.backgroundColor} />
            </View>
          )}

          <View style={styles.modalFooter}>
            <TouchableOpacity style={[styles.modalBtn, styles.modalBtnCancel]} onPress={onClose} disabled={savingClient}>
              <Text style={styles.modalBtnCancelText}>Annuler</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.modalBtn, styles.modalBtnSave, savingClient && { backgroundColor: '#BDBDBD' }]} onPress={onSave} disabled={savingClient}>
              {savingClient ? <ActivityIndicator size="small" color="white" /> : <Text style={styles.modalBtnSaveText}>Enregistrer</Text>}
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};