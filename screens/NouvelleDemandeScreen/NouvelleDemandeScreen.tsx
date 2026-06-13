import React from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, ScrollView, 
  ActivityIndicator, Modal, FlatList 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CameraView } from 'expo-camera';

import { styles } from './nouvelleDemande.style';
import { useNouvelleDemande } from './nouvelleDemande.hooks';

export default function NouvelleDemandeScreen() {
  const {
    pboMa,
    setPboMa,
    pboNumero,
    setPboNumero,
    clientId,
    setClientId,
    modalVisible,
    setModalVisible,
    showScanner,
    setShowScanner,
    saving,
    activeField,
    setActiveField,
    RAISONS,
    openScanner,
    handleSubmit,
    navigation
  } = useNouvelleDemande();

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
            onChangeText={setPboMa}
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
        <TextInput 
          style={styles.input} 
          placeholder="Saisir l'ID client" 
          onChangeText={setClientId} 
          value={clientId} 
        />

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