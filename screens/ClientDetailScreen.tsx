import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';

export default function ClientDetailScreen() {
  const route = useRoute<any>();
  const navigation = useNavigation();
  
  // On récupère les infos du client passées par la navigation
  const { client } = route.params;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        
        {/* HEADER CLIENT */}
        <View style={styles.header}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarText}>
              {client.name ? client.name.charAt(0).toUpperCase() : 'C'}
            </Text>
          </View>
          <Text style={styles.clientName}>{client.name || 'Client Inconnu'}</Text>
          <View style={styles.badgeStatus}>
            <Text style={styles.badgeText}>ACTIF</Text>
          </View>
        </View>

        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>COORDONNÉES</Text>
          
          <Text style={styles.label}>Téléphone</Text>
          <Text style={styles.val}>{client.phone || '+242 06 XXX XX XX'}</Text>

          <Text style={styles.label}>Adresse / Quartier</Text>
          <Text style={styles.val}>{client.address || 'Brazzaville, Congo'}</Text>

          <Text style={styles.label}>Email</Text>
          <Text style={styles.val}>{client.email || 'non-renseigné@mail.com'}</Text>
        </View>

        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>INFOS TECHNIQUES (SUR PBO)</Text>
          
          <Text style={styles.label}>Numéro de Port</Text>
          <Text style={[styles.val, {color: '#1A237E', fontWeight: 'bold'}]}>
             Port {client.portNumber || 'Non assigné'}
          </Text>

          <Text style={styles.label}>Offre Souscrite</Text>
          <Text style={styles.val}>{client.offre || 'Fibre Optique Résidentielle'}</Text>

          <Text style={styles.label}>Référence Client</Text>
          <Text style={styles.val}>{client.refClient || 'SP-2026-XXXX'}</Text>
        </View>

        {/* BOUTONS D'ACTION */}
        <View style={styles.actionBox}>
          <TouchableOpacity 
            style={styles.btnAction} 
            onPress={() => console.log("Appeler le client")}
          >
            <Text style={styles.btnActionText}>📞 APPELER</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.btnAction, {backgroundColor: '#1A237E'}]}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.btnActionText}>RETOUR</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { alignItems: 'center', padding: 30, backgroundColor: '#f9f9f9', borderBottomWidth: 1, borderBottomColor: '#eee' },
  avatarCircle: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#1A237E', justifyContent: 'center', alignItems: 'center', marginBottom: 15 },
  avatarText: { color: '#fff', fontSize: 32, fontWeight: 'bold' },
  clientName: { fontSize: 22, fontWeight: 'bold', color: '#333' },
  badgeStatus: { backgroundColor: '#e6f4ea', paddingHorizontal: 15, paddingVertical: 5, borderRadius: 20, marginTop: 10 },
  badgeText: { color: '#1A237E', fontWeight: 'bold', fontSize: 12 },
  infoSection: { padding: 20, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  sectionTitle: { fontSize: 14, fontWeight: 'bold', color: '', marginBottom: 10 },
  label: { fontSize: 11, color: '#aaa', marginTop: 15, textTransform: 'uppercase' },
  val: { fontSize: 16, color: '#333', marginTop: 5, fontWeight: '500' },
  actionBox: { padding: 20, flexDirection: 'row', justifyContent: 'space-between' },
  btnAction: { flex: 0.48, backgroundColor: '#444', padding: 15, borderRadius: 10, alignItems: 'center' },
  btnActionText: { color: '#fff', fontWeight: 'bold' }
});