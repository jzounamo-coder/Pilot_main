import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons'; 

export default function TicketDetailScreen() {
  const route = useRoute<any>();
  const navigation = useNavigation();
  const { ticket } = route.params;

  // --- LOGIQUE DE SATURATION ---
  // On récupère les valeurs (on met des valeurs par défaut pour éviter les crashs)
  const totalPorts = parseInt(ticket.totalPorts || 16); 
  const freePorts = parseInt(ticket.npl || 0); // Supposons que NPL = Nombre de Ports Libres
  const occupiedPorts = totalPorts - freePorts;
  const isSaturated = freePorts === 0;

  const Row = ({ label, value }: any) => (
    <View style={styles.infoRow}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value || '---'}</Text>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Image source={{ uri: ticket.imageUri }} style={styles.avatar} />
        <Text style={styles.mainTitle}>{ticket.name}</Text>
        <Text style={styles.subTitle}>ID: {ticket.subscriberId}</Text>
      </View>

      <View style={styles.content}>
        {/* --- BLOC ALERTE SATURATION --- */}
        {isSaturated && (
          <View style={styles.saturationAlert}>
            <Ionicons name="warning" size={20} color="#B91C1C" />
            <Text style={styles.saturationText}>ATTENTION : PBO RATTACHÉ SATURÉ</Text>
          </View>
        )}

        <Text style={styles.sectionTitle}>Contact & Localisation</Text>
        <Row label="Téléphone" value={ticket.phone} />
        <Row label="Adresse" value={ticket.adresse} />
        
        <View style={{flexDirection: 'row'}}>
            <View style={{flex: 1}}><Row label="Latitude" value={ticket.lat} /></View>
            <View style={{flex: 1}}><Row label="Longitude" value={ticket.lnf} /></View>
        </View>

        <Text style={styles.sectionTitle}>Données Techniques & Saturation</Text>
        
        {/* Barre de progression visuelle */}
        <View style={styles.progressSection}>
          <Text style={styles.progressLabel}>Occupation du PBO ({occupiedPorts}/{totalPorts})</Text>
          <View style={styles.progressContainer}>
            <View style={[
              styles.progressBar, 
              { 
                width: `${(occupiedPorts / totalPorts) * 100}%`,
                backgroundColor: isSaturated ? '#EF4444' : '#10B981' 
              }
            ]} />
          </View>
        </View>

        <Row label="N° Abonnement" value={ticket.nAbonnement} />
        <Row label="PBO" value={ticket.pbo} />
        
        <View style={{flexDirection: 'row'}}>
            <View style={{flex: 1}}><Row label="Ports Libres (NPL)" value={ticket.npl} /></View>
            <View style={{flex: 1}}><Row label="Ports Occupés" value={occupiedPorts} /></View>
        </View>
        
        <Row label="Distance" value={ticket.disn} />
        <Row label="État des lieux" value={ticket.edl} />
      </View>

      <TouchableOpacity style={styles.btn} onPress={() => navigation.goBack()}>
        <Text style={{color: 'white', fontWeight: 'bold'}}>RETOUR</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F7F8' },
  header: { backgroundColor: '#1A237E', alignItems: 'center', paddingVertical: 30 },
  avatar: { width: 90, height: 90, borderRadius: 45, borderWidth: 2, borderColor: 'white', marginBottom: 10 },
  mainTitle: { color: 'white', fontSize: 22, fontWeight: 'bold' },
  subTitle: { color: '#ddd', fontSize: 16 },
  content: { padding: 20 },
  sectionTitle: { fontSize: 11, fontWeight: 'bold', color: '#1A237E', marginTop: 15, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 },
  infoRow: { backgroundColor: 'white', padding: 12, borderRadius: 8, marginBottom: 6, elevation: 1 },
  label: { fontSize: 10, color: '#888', textTransform: 'uppercase' },
  value: { fontSize: 15, color: '#333', fontWeight: '600' },
  btn: { margin: 20, backgroundColor: '#1A237E', padding: 15, borderRadius: 10, alignItems: 'center' },
  
  // NOUVEAUX STYLES POUR LA SATURATION
  saturationAlert: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEE2E2',
    padding: 12,
    borderRadius: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#EF4444',
  },
  saturationText: {
    color: '#B91C1C',
    fontWeight: 'bold',
    fontSize: 12,
    marginLeft: 10,
  },
  progressSection: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    elevation: 1,
  },
  progressLabel: {
    fontSize: 11,
    color: '#666',
    marginBottom: 8,
    fontWeight: '600',
  },
  progressContainer: {
    height: 10,
    backgroundColor: '#E5E7EB',
    borderRadius: 5,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
  },
});