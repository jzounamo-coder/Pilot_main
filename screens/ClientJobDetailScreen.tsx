import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function ClientJobDetail({ route, navigation }: any) {
  const { client } = route.params;

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* CARTE INFO CLIENT */}
        <View style={styles.infoCard}>
          <Ionicons name="person-circle-outline" size={80} color="#1A237E" style={{ alignSelf: 'center' }} />
          <Text style={styles.clientName}>{client.nom}</Text>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>ID Client :</Text>
            <Text style={styles.infoValue}>{client.id}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Téléphone :</Text>
            <Text style={styles.infoValue}>{client.tel}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Ville :</Text>
            <Text style={styles.infoValue}>{client.ville}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Secteur :</Text>
            <Text style={styles.infoValue}>{client.arrondissement || "N/A"}</Text>
          </View>
        </View>

        {/* SECTION BOUTONS */}
        <View style={styles.buttonContainer}>
          
          {/* NOUVEAU BOUTON VISUALISATION  */}
          <TouchableOpacity 
            style={styles.btnVISUALISATION} 
            onPress={() => navigation.navigate('SummaryScreen', { client, photos: { pointA: null, pointB: null, pointC: null } })}
          >
            <Ionicons name="create-outline" size={24} color="white" />
            <Text style={styles.btnText}> VISUALISATION </Text>
          </TouchableOpacity>

          {/* BOUTON VALIDER L'INTERVENTION */}
          <TouchableOpacity 
            style={styles.btnValidate} 
            onPress={() => navigation.navigate('Visualisation', { client })}
          >
            <Ionicons name="checkmark-done-circle-outline" size={24} color="white" />
            <Text style={styles.btnText}>VALIDER L'INTERVENTION</Text>
          </TouchableOpacity>
          
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F4F5F7' },
  scrollContent: { padding: 20 },
  infoCard: { backgroundColor: 'white', borderRadius: 15, padding: 20, elevation: 4, marginBottom: 25 },
  clientName: { fontSize: 24, fontWeight: 'bold', color: '#1A237E', textAlign: 'center', marginBottom: 20 },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
  infoLabel: { color: '#666', fontSize: 16 },
  infoValue: { fontWeight: 'bold', color: '#333', fontSize: 16 },
  buttonContainer: { marginTop: 10, gap: 12 },
  // Style pour le bouton VISUALISATION (Bleu)
  btnVISUALISATION: { 
    backgroundColor: '#1A237E', 
    flexDirection: 'row', 
    padding: 18, 
    borderRadius: 12, 
    alignItems: 'center', 
    justifyContent: 'center', 
    elevation: 3 
  },
  // Style pour le bouton Valider (Vert)
  btnValidate: { 
    backgroundColor: '#b1550a', 
    flexDirection: 'row', 
    padding: 18, 
    borderRadius: 12, 
    alignItems: 'center', 
    justifyContent: 'center', 
    elevation: 3 
  },
  btnText: { color: 'white', fontWeight: 'bold', fontSize: 16, marginLeft: 10 }
});