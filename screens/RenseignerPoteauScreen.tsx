import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function RenseignerPoteauScreen({ route, navigation }: any) {
  const { poteau } = route.params; // On récupère les infos du poteau actuel

  const [etat, setEtat] = useState('Bon état');
  const [nbPbo, setNbPbo] = useState('');
  const [lat, setLat] = useState('');
  const [lng, setLng] = useState('');

  // Fonction pour obtenir la couleur selon l'état
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Bon état': return '#00C853'; // Vert
      case 'Mauvais état': return '#FFD600'; // Jaune
      case 'Tombé': return '#D50000'; // Rouge
      default: return '#1A237E';
    }
  };

  const handleSave = () => {
    Alert.alert("Succès", "Les informations ont été enregistrées localement.");
    navigation.goBack();
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#1A237E' }}>
      <ScrollView style={styles.container}>
        {/* HEADER AJUSTÉ (PLUS BAS) */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginRight: 15 }}>
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.title}>Mise à jour : {poteau.id}</Text>
        </View>

        <View style={styles.form}>
          {/* SÉLECTION DE L'ÉTAT AVEC COULEURS DYNAMIQUES */}
          <Text style={styles.label}>État du poteau</Text>
          <View style={styles.pickerContainer}>
            {['Bon état', 'Mauvais état', 'Tombé'].map((item) => {
              const isActive = etat === item;
              const activeColor = getStatusColor(item);
              
              return (
                <TouchableOpacity 
                  key={item} 
                  style={[
                    styles.radioBtn, 
                    { borderColor: activeColor },
                    isActive && { backgroundColor: activeColor }
                  ]}
                  onPress={() => setEtat(item)}
                >
                  <Text style={[
                    styles.radioText, 
                    { color: activeColor },
                    isActive && { color: 'white' }
                  ]}>
                    {item}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* NOMBRE DE PBO */}
          <Text style={styles.label}>Nombre de PBO sur le poteau</Text>
          <TextInput 
            style={styles.input}
            placeholder="Ex: 2"
            keyboardType="numeric"
            value={nbPbo}
            onChangeText={setNbPbo}
          />

          {/* COORDONNÉES */}
          <Text style={styles.label}>Latitude</Text>
          <TextInput 
            style={styles.input}
            placeholder="Ex: -4.2634"
            keyboardType="decimal-pad"
            value={lat}
            onChangeText={setLat}
          />

          <Text style={styles.label}>Longitude</Text>
          <TextInput 
            style={styles.input}
            placeholder="Ex: 15.2429"
            keyboardType="decimal-pad"
            value={lng}
            onChangeText={setLng}
          />

          {/* BOUTON ENREGISTRER QUI PREND LA COULEUR DE L'ÉTAT */}
          <TouchableOpacity 
            style={[styles.submitBtn, { backgroundColor: getStatusColor(etat) }]} 
            onPress={handleSave}
          >
            <Ionicons name="cloud-upload-outline" size={24} color="white" />
            <Text style={styles.submitBtnText}>ENREGISTRER LES DONNÉES</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F6FA' },
  header: { 
    paddingHorizontal: 15, 
    paddingBottom: 25, 
    paddingTop: 30, // Augmenté pour descendre le texte du header
    backgroundColor: '#1A237E',
    flexDirection: 'row',
    alignItems: 'center'
  },
  title: { color: 'white', fontSize: 18, fontWeight: 'bold' },
  form: { padding: 20 },
  label: { fontSize: 14, fontWeight: 'bold', color: '#333', marginBottom: 10, marginTop: 15 },
  input: { backgroundColor: 'white', borderWidth: 1, borderColor: '#DDD', borderRadius: 8, padding: 12, fontSize: 16 },
  pickerContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  radioBtn: { flex: 1, paddingVertical: 10, borderWidth: 2, borderRadius: 8, alignItems: 'center', marginHorizontal: 2 },
  radioText: { fontWeight: 'bold', fontSize: 11 },
  submitBtn: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', padding: 15, borderRadius: 12, marginTop: 30, elevation: 3 },
  submitBtnText: { color: 'white', fontWeight: 'bold', marginLeft: 10, fontSize: 16 }
});