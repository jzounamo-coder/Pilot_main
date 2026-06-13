import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { styles } from './demandePoteau.style';
import { useDemandePoteauLogic } from './demandePoteau.hooks';
import { PoteauMap } from './components/PoteauMap';

export default function DemandePoteauScreen() {
  const {
    location,
    setLocation,
    poteauxList,
    ajouterPoteauIci,
    gererSuppressionPoteau,
    validerDemande,
  } = useDemandePoteauLogic();

  return (
    <View style={styles.container}>
      {/* SECTION BOUTON DU HAUT UNIQUE */}
      <View style={styles.topActions}>
        <TouchableOpacity 
          style={[styles.btnAction, { backgroundColor: '#1A237E' }]} 
          onPress={ajouterPoteauIci}
        >
          <Ionicons name="add-circle" size={24} color="white" />
          <Text style={styles.btnText}>
            AJOUTER POTEAU ICI ({poteauxList.length})
          </Text>
        </TouchableOpacity>
      </View>

      {/* CARTE ET MARQUEURS */}
      <PoteauMap
        location={location}
        setLocation={setLocation}
        poteauxList={poteauxList}
        onMarkerPress={gererSuppressionPoteau}
      />
  
      {/* BOUTON FLOTTANT DE VALIDATION */}
      {poteauxList.length > 0 && (
        <TouchableOpacity 
          style={styles.confirmFab} 
          onPress={validerDemande}
        >
          <Text style={styles.confirmFabText}>
            VALIDER LA DEMANDE ({poteauxList.length})
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}