import React, { useState } from 'react';
import { 
  View, Text, StyleSheet, ScrollView, TextInput, 
  TouchableOpacity, Alert 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRoute, useNavigation } from '@react-navigation/native';

const PRIMARY_BLUE = '#1A237E';

export default function ValidationInstallationScreen() {
  const route = useRoute<any>();
  const navigation = useNavigation();
  
  // Récupération des données transmises par la page précédente
  const { installation } = route.params || { 
    installation: { nom: 'Client Inconnu', type: 'OE', id: 'INST-000', ville: 'Brazzaville', arrondissement: 'Centre' } 
  };

  // États pour gérer les étapes de validation
  const [heureArrivee, setHeureArrivee] = useState<string | null>(null);
  const [numeroMateriel, setNumeroMateriel] = useState('');
  const [signalDbm, setSignalDbm] = useState('');
  const [loading, setLoading] = useState(false);

  // Fonction pour enregistrer l'heure d'arrivée exacte
  const marquerArrivee = () => {
    const maintenant = new Date();
    const heures = maintenant.getHours().toString().padStart(2, '0');
    const minutes = maintenant.getMinutes().toString().padStart(2, '0');
    setHeureArrivee(`${heures}:${minutes}`);
  };

  // Soumission et enregistrement final de l'installation
  const validerLInstallation = () => {
    if (!heureArrivee) {
      Alert.alert("Action requise", "Veuillez d'abord valider l'heure d'arrivée sur le site (Étape 1).");
      return;
    }
    if (!numeroMateriel.trim()) {
      Alert.alert("Action requise", "Veuillez saisir le numéro de série du matériel ou PBO/PTO (Étape 2).");
      return;
    }
    if (!signalDbm.trim()) {
      Alert.alert("Action requise", "Veuillez renseigner la mesure de puissance du signal en dBm (Étape 3).");
      return;
    }

    setLoading(true);

    // Simulation d'une sauvegarde réseau ou locale
    setTimeout(() => {
      setLoading(false);
      Alert.alert(
        "Succès", 
        `L'installation pour ${installation.nom} a été validée avec succès !`,
        [{ text: "OK", onPress: () => navigation.goBack() }]
      );
    }, 1500);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 30 }}>
      
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
      <View style={styles.stepCard}>
        <View style={styles.stepHeader}>
          <View style={[styles.stepCircle, heureArrivee ? styles.stepCircleDone : null]}>
            <Text style={styles.stepNumber}>{heureArrivee ? "✓" : "1"}</Text>
          </View>
          <Text style={styles.stepTitle}>Arrivée sur le site</Text>
        </View>
        
        <View style={styles.stepContent}>
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
        </View>
      </View>

      {/* ÉTAPE 2 : MATÉRIEL */}
      <View style={styles.stepCard}>
        <View style={styles.stepHeader}>
          <View style={[styles.stepCircle, numeroMateriel.trim() ? styles.stepCircleDone : null]}>
            <Text style={styles.stepNumber}>{numeroMateriel.trim() ? "✓" : "2"}</Text>
          </View>
          <Text style={styles.stepTitle}>Équipement posé (PBO / PTO / ONT)</Text>
        </View>

        <View style={styles.stepContent}>
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
        </View>
      </View>

      {/* ÉTAPE 3 : MESURE DE PUISSANCE FIBRE */}
      <View style={styles.stepCard}>
        <View style={styles.stepHeader}>
          <View style={[styles.stepCircle, signalDbm.trim() ? styles.stepCircleDone : null]}>
            <Text style={styles.stepNumber}>{signalDbm.trim() ? "✓" : "3"}</Text>
          </View>
          <Text style={styles.stepTitle}>Puissance du signal (dBm)</Text>
        </View>

        <View style={styles.stepContent}>
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
        </View>
      </View>

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

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F6FA', padding: 15 },
  
  // HEADER CLIENT
  clientHeader: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
    elevation: 2,
  },
  headerTitleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  clientName: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  clientId: { fontSize: 12, color: '#999', fontWeight: '600' },
  clientSub: { fontSize: 14, color: '#666', marginTop: 5 },

  sectionTitle: { fontSize: 15, fontWeight: 'bold', color: '#555', marginBottom: 15, textTransform: 'uppercase' },

  // STRUCTURE DES CARTES D'ÉTAPE
  stepCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    elevation: 2,
  },
  stepHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  stepCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  stepCircleDone: { backgroundColor: '#388E3C' },
  stepNumber: { color: 'white', fontWeight: 'bold', fontSize: 13 },
  stepTitle: { fontSize: 15, fontWeight: 'bold', color: '#333' },
  stepContent: { paddingLeft: 36 },

  // COMPOSANTS INTERNES ÉTAPES
  actionButton: {
    backgroundColor: PRIMARY_BLUE,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  actionButtonText: { color: 'white', fontWeight: 'bold', fontSize: 14 },
  timeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#C8E6C9',
  },
  timeBadgeText: { color: '#388E3C', fontWeight: 'bold', marginLeft: 8, fontSize: 14 },

  // FORMULAIRES / INPUTS
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: 8,
    paddingHorizontal: 10,
    height: 45,
    backgroundColor: '#FAFAFA',
  },
  input: { flex: 1, fontSize: 14, color: '#333' },
  unitText: { fontWeight: 'bold', color: '#666', marginLeft: 5 },
  hintText: { fontSize: 11, color: '#999', marginTop: 5, fontStyle: 'italic' },

  // BOUTON DE SOUMISSION FINAL
  submitButton: {
    backgroundColor: '#d1820c', 
    height: 52,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 15,
    elevation: 3,
  },
  submitButtonDisabled: { backgroundColor: '#A5D6A7' },
  submitButtonText: { color: 'white', fontSize: 16, fontWeight: 'bold' }
});