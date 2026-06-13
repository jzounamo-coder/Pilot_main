// RenseignerPoteau.screen.tsx
import React from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from './RenseignerPoteau.styles';
import { useRenseignerPoteau } from './RenseignerPoteau.hooks';

export default function RenseignerPoteauScreen({ route, navigation }: any) {
  // Extraction de toute la logique métier
  const {
    poteau,
    etat,
    setEtat,
    nbPbo,
    setNbPbo,
    lat,
    setLat,
    lng,
    setLng,
    getStatusColor,
    handleSave,
  } = useRenseignerPoteau(route, navigation);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#1A237E' }}>
      <ScrollView style={styles.container}>
        
        {/* EN-TÊTE DE LA PAGE */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginRight: 15 }}>
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.title}>Mise à jour : {poteau?.id || 'Inconnu'}</Text>
        </View>

        {/* FORMULAIRE DE MISE À JOUR */}
        <View style={styles.form}>
          
          {/* SÉLECTION DE L'ÉTAT COMPOSÉ DÉPLIÉ */}
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

          {/* COORDONNÉES GÉOGRAPHIQUES */}
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

          {/* BOUTON DE SOUMISSION DYNAMIQUE */}
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