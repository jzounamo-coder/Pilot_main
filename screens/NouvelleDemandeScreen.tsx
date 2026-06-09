import React, { useState } from 'react';
import { 
  View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, 
  Alert, ActivityIndicator, Modal, FlatList 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { CameraView, useCameraPermissions } from 'expo-camera';

const PRIMARY_BLUE = '#1A237E';

export default function NouvelleDemandeScreen() {
  const navigation = useNavigation();
  
  const [pboMa, setPboMa] = useState('');
  const [pboNumero, setPboNumero] = useState('');
  const [clientId, setClientId] = useState('');
  // Champs mis en commentaire
  // const [sn, setSn] = useState('');
  // const [reason, setReason] = useState('');
  
  const [modalVisible, setModalVisible] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const [saving, setSaving] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();
  const [activeField, setActiveField] = useState<string | null>(null);

  const RAISONS = ['Échec de stabilisation', 'Port ONT scintille'];

  // Construit l'idPbo final selon ce que l'utilisateur a saisi
  const buildIdPbo = () => {
    if (pboMa.trim() && pboNumero.trim()) {
      return `BZV-${pboMa.trim().toUpperCase()}-PB${pboNumero.trim()}`;
    } else if (pboNumero.trim()) {
      return pboNumero.trim(); // Juste le code si pas de MA
    }
    return '';
  };

  const openScanner = async () => {
    const { granted } = await requestPermission();
    if (granted) {
      setShowScanner(true);
    } else {
      Alert.alert('Permission requise', 'Veuillez autoriser l\'accès à la caméra pour scanner.');
    }
  };

  const handleSubmit = async () => {
    const idPbo = buildIdPbo();

    // Validation mise à jour : seulement ID PBO et Client ID requis
    if (!idPbo || !clientId) {
      Alert.alert('Erreur', 'Veuillez remplir les champs obligatoires.');
      return;
    }

    setSaving(true);

    // 1. Préparation des données (sans SN et Reason)
    const payload = { idPbo, clientId };
    try { 
      const response: any = await fetch('https://control-api-dev.speedpro.cg/api/v1/pilot/ot-recreation', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      
      const rawText = await response.text();
      
      if (response.ok) {
        Alert.alert('Succès', 'Demande créée avec succès !');
        navigation.goBack();
      } else {
        console.error("Erreur serveur :", rawText);
        Alert.alert('Erreur', 'Serveur : ' + response.status + '\nVoir console pour détails.');
      }
    } catch (error) {
      console.error('Erreur Catch (Réseau) :', error);
      Alert.alert('Erreur', 'Impossible de joindre le serveur. Vérifiez votre connexion.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 5 }}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Nouvelle Demande</Text>
      </View>

      <ScrollView style={styles.body}>

        {/* ── ID PBO ── */}
        <Text style={styles.label}>ID PBO</Text>
        <View style={styles.pboInputGroup}>
          {/* BZV fixe */}
          <View style={styles.prefixBadge}>
            <Text style={styles.prefixText}>BZV</Text>
          </View>

          {/* MA — optionnel */}
          <Text style={styles.separator}>-</Text>
          <TextInput
            style={[
              styles.inputField,
              styles.styledInput,
              { flex: 1.5, textAlign: 'center' },
              activeField === 'pboMa' && styles.inputFieldActive,
            ]}
            placeholder="MA"
            value={pboMa}
            onChangeText={(t) => setPboMa(t)}
            maxLength={4}
            onFocus={() => setActiveField('pboMa')}
            onBlur={() => setActiveField(null)}
          />

          {/* Numéro PBO — obligatoire */}
          <Text style={styles.separator}>-</Text>
          <View style={[
            styles.pboNumberContainer,
            { flex: 2 },
            activeField === 'pboNumero' && styles.inputWrapperActive,
          ]}>
            <Text style={styles.pboPrefixText}>PB</Text>
            <TextInput
              style={[styles.inputField, { flex: 1, paddingLeft: 5 }]}
              placeholder="0575 *"
              value={pboNumero}
              onChangeText={(n) => setPboNumero(n.replace(/[^0-9]/g, ''))}
              keyboardType="numeric"
              onFocus={() => setActiveField('pboNumero')}
              onBlur={() => setActiveField(null)}
            />
          </View>
        </View>

        <Text style={styles.label}>Client ID</Text>
        <TextInput style={styles.input} placeholder="Saisir l'ID client" onChangeText={setClientId} value={clientId} />

        {/* --- RAISON MIS EN COMMENTAIRE --- */}
        {/*
        <Text style={styles.label}>Raison</Text>
        <TouchableOpacity 
          style={[styles.input, styles.dropdownInput]} 
          onPress={() => setModalVisible(true)}
        >
          <Text style={{ color: reason ? 'black' : '#AAA' }}>
            {reason || 'Sélectionner une raison'}
          </Text>
          <Ionicons name="chevron-down" size={20} color="#AAA" />
        </TouchableOpacity>
        */}

        {/* --- SN MIS EN COMMENTAIRE --- */}
        {/*
        <Text style={styles.label}>SN* </Text>
        <View style={styles.row}>
          <TextInput style={[styles.input, { flex: 1 }]} placeholder="Saisir ou scanner le SN" onChangeText={setSn} value={sn} />
          <TouchableOpacity style={styles.scanBtn} onPress={openScanner}>
            <Ionicons name="scan-outline" size={24} color="white" />
          </TouchableOpacity>
        </View>
        */}

        <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit} disabled={saving}>
          {saving ? <ActivityIndicator color="white" /> : <Text style={styles.submitText}>Envoyer la demande</Text>}
        </TouchableOpacity>
      </ScrollView>

      {/* Modal Choix Raison (Optionnel : laisser en commentaire si non utilisé) */}
      {/*
      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Choisir la raison</Text>
            <FlatList 
              data={RAISONS}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.option} onPress={() => { setReason(item); setModalVisible(false); }}>
                  <Text>{item}</Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity style={styles.closeModal} onPress={() => setModalVisible(false)}>
              <Text style={{color:'red'}}>Annuler</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      */}

      {/* Modal Scanner (Optionnel : laisser en commentaire si non utilisé) */}
      {/*
      <Modal visible={showScanner} animationType="slide">
        <CameraView
          style={StyleSheet.absoluteFillObject}
          facing="back"
          onBarcodeScanned={({ data }) => {
            setSn(data);
            setShowScanner(false);
          }}
        />
        <TouchableOpacity style={styles.closeCameraBtn} onPress={() => setShowScanner(false)}>
          <Ionicons name="close-circle" size={40} color="white" />
        </TouchableOpacity>
      </Modal>
      */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  header: { backgroundColor: PRIMARY_BLUE, paddingTop: 50, paddingBottom: 15, paddingHorizontal: 20, flexDirection: 'row', alignItems: 'center' },
  headerTitle: { color: 'white', fontSize: 18, fontWeight: 'bold', marginLeft: 15 },
  body: { padding: 20 },
  label: { fontSize: 14, fontWeight: 'bold', color: '#444', marginTop: 15, marginBottom: 5 },
  input: { backgroundColor: 'white', padding: 15, borderRadius: 10, borderWidth: 1, borderColor: '#DDD' },
  dropdownInput: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  row: { flexDirection: 'row', alignItems: 'center' },
  scanBtn: { backgroundColor: PRIMARY_BLUE, padding: 13, borderRadius: 10, marginLeft: 10 },
  submitBtn: { backgroundColor: PRIMARY_BLUE, marginTop: 30, padding: 15, borderRadius: 10, alignItems: 'center' },
  submitText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 20 },
  modalContent: { backgroundColor: 'white', borderRadius: 10, padding: 20 },
  modalTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 15 },
  option: { paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#EEE' },
  closeModal: { marginTop: 15, alignItems: 'center' },
  closeCameraBtn: { position: 'absolute', top: 50, right: 20 },

  // ── Styles PBO Input ──
  pboInputGroup: { flexDirection: 'row', alignItems: 'center', marginBottom: 5 },
  prefixBadge: { backgroundColor: '#E8F5E9', paddingHorizontal: 10, height: 45, borderRadius: 10, justifyContent: 'center', borderWidth: 1, borderColor: '#388E3C' },
  prefixText: { color: '#388E3C', fontWeight: 'bold' },
  separator: { fontSize: 18, fontWeight: 'bold', paddingHorizontal: 3 },
  styledInput: { backgroundColor: '#F0F2F5', height: 45, borderRadius: 10 },
  inputField: { flex: 1, height: 45 },
  inputFieldActive: { borderColor: PRIMARY_BLUE, borderWidth: 1.5, borderRadius: 10 },
  pboNumberContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F0F2F5', height: 45, borderRadius: 10, paddingHorizontal: 8 },
  pboPrefixText: { fontWeight: 'bold', color: '#666', fontSize: 13 },
  inputWrapperActive: { borderColor: PRIMARY_BLUE, borderWidth: 1.5 },
});