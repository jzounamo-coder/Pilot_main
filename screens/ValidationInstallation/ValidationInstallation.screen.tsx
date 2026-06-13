import React from 'react';
import { ScrollView, View, Text, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useValidationInstallation } from './ValidationInstallation.hooks';
import { styles } from './ValidationInstallation.styles';
import { StepCard } from './components/StepCard';

export default function ValidationInstallationScreen() {
  const {
    installation,
    heureArrivee,
    numeroMateriel,
    signalDbm,
    loading,
    setNumeroMateriel,
    setSignalDbm,
    marquerArrivee,
    validerLInstallation,
  } = useValidationInstallation();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      
      {/* BANDEAU INFO CLIENT */}
      <View style={styles.clientHeader}>
        <View style={styles.headerTitleRow}>
          <Text style={styles.clientName}>{installation.nom}</Text>
          <Text style={styles.clientId}>{installation.id}</Text>
        </View>
        <Text style={styles.clientSub}>
          <Ionicons name="location" size={14} color="#666" /> {installation.ville}, {installation.arrondissement}
        </Text>
      </View>

      <Text style={styles.sectionTitle}>Checklist d'installation terrain</Text>

      {/* ÉTAPE 1 : HORODATAGE */}
      <StepCard 
        stepNumber={1} 
        title="Arrivée sur le site" 
        isDone={!!heureArrivee}
      >
        {heureArrivee ? (
          <View style={styles.timeBadge}>
            <Ionicons name="time" size={18} color="#388E3C" />
            <Text style={styles.timeBadgeText}>Arrivée enregistrée à : {heureArrivee}</Text>
          </View>
        ) : (
          <TouchableOpacity style={styles.actionButton} onPress={marquerArrivee}>
            <Ionicons name="log-in-outline" size={20} color="white" style={{ marginRight: 8 }} />
            <Text style={styles.actionButtonText}>Marquer mon arrivée</Text>
          </TouchableOpacity>
        )}
      </StepCard>

      {/* ÉTAPE 2 : MATÉRIEL */}
      <StepCard 
        stepNumber={2} 
        title="Équipement posé (PBO / PTO / ONT)" 
        isDone={!!numeroMateriel.trim()}
      >
        <View style={styles.inputWrapper}>
          <Ionicons name="barcode-outline" size={20} color="#999" style={{ marginRight: 8 }} />
          <TextInput
            style={styles.input}
            placeholder="Numéro de série ou ID Équipement"
            value={numeroMateriel}
            onChangeText={setNumeroMateriel}
            autoCapitalize="characters"
          />
        </View>
      </StepCard>

      {/* ÉTAPE 3 : MESURE DE PUISSANCE FIBRE */}
      <StepCard 
        stepNumber={3} 
        title="Puissance du signal (dBm)" 
        isDone={!!signalDbm.trim()}
      >
        <View style={styles.inputWrapper}>
          <Ionicons name="speedometer-outline" size={20} color="#999" style={{ marginRight: 8 }} />
          <TextInput
            style={styles.input}
            placeholder="Ex: -19.5"
            keyboardType="numeric"
            value={signalDbm}
            onChangeText={setSignalDbm}
          />
          <Text style={styles.unitText}>dBm</Text>
        </View>
        <Text style={styles.hintText}>Une bonne mesure se situe généralement entre -15 dBm et -25 dBm.</Text>
      </StepCard>

      {/* BOUTON GLOBAL VALIDATION DE FIN DE CHANTIER */}
      <TouchableOpacity 
        style={[styles.submitButton, loading ? styles.submitButtonDisabled : null]} 
        onPress={validerLInstallation}
        disabled={loading}
      >
        <Text style={styles.submitButtonText}>
          {loading ? "Enregistrement..." : "Clôturer et Valider l'Installation"}
        </Text>
      </TouchableOpacity>

    </ScrollView>
  );
}