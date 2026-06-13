import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from './ClientJobDetail.styles';
import { useClientJobDetail } from './ClientJobDetail.hooks';

export default function ClientJobDetail({ route, navigation }: any) {
  const { 
    client, 
    handleNavigateToSummary, 
    handleNavigateToVisualisation 
  } = useClientJobDetail(route, navigation);

  // Sécurité au cas où le client ne serait pas transmis
  if (!client) {
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: 'center', marginTop: 50 }}>Aucune donnée client trouvée.</Text>
      </View>
    );
  }

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
          
          {/* BOUTON VISUALISATION */}
          <TouchableOpacity 
            style={styles.btnVISUALISATION} 
            onPress={handleNavigateToSummary}
          >
            <Ionicons name="create-outline" size={24} color="white" />
            <Text style={styles.btnText}> VISUALISATION </Text>
          </TouchableOpacity>

          {/* BOUTON VALIDER L'INTERVENTION */}
          <TouchableOpacity 
            style={styles.btnValidate} 
            onPress={handleNavigateToVisualisation}
          >
            <Ionicons name="checkmark-done-circle-outline" size={24} color="white" />
            <Text style={styles.btnText}>VALIDER L'INTERVENTION</Text>
          </TouchableOpacity>
          
        </View>

      </ScrollView>
    </View>
  );
}