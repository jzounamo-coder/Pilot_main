import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import MapView, { Marker } from '../components/MapViewWrapper/MapViewWrapper';
import * as Location from 'expo-location';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';


export default function DemandePoteauScreen() {
  const [location, setLocation] = useState<any>(null);
  const [poteauxList, setPoteauxList] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert("Permission refusée", "L'accès à la localisation est nécessaire.");
        return;
      }
      let currentLoc = await Location.getCurrentPositionAsync({});
      setLocation(currentLoc.coords);
    })();
  }, []);

  // Ajoute un nouveau poteau au tableau
  const ajouterPoteauIci = () => {
    if (location) {
      const nouveauPoteau = {
        id: Date.now(), 
        latitude: location.latitude,
        longitude: location.longitude,
      };
      setPoteauxList([...poteauxList, nouveauPoteau]);
    } else {
      Alert.alert("Attente", "Localisation en cours de récupération...");
    }
  };

  // NOUVELLE FONCTION : Supprime le poteau sélectionné après confirmation
  const gererSuppressionPoteau = (poteauId: number, index: number) => {
    Alert.alert(
      "Supprimer le poteau",
      `Voulez-vous vraiment supprimer le poteau n°${index + 1} ?`,
      [
        { text: "Annuler", style: "cancel" },
        { 
          text: "Oui, supprimer", 
          style: "destructive", 
          onPress: () => {
            setPoteauxList(poteauxList.filter(poteau => poteau.id !== poteauId));
          } 
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      {/* SECTION BOUTON DU HAUT UNIQUE */}
      <View style={styles.topActions}>
        <TouchableOpacity 
            style={[styles.btnAction, { backgroundColor: '#1A237E' }]} 
            onPress={ajouterPoteauIci}
        >
          <Ionicons name="add-circle" size={24} color="white" />
          <Text style={styles.btnText}>AJOUTER POTEAU ICI ({poteauxList.length})</Text>
        </TouchableOpacity>
      </View>

      {location ? (
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: location.latitude,
            longitude: location.longitude,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005,
          }}
          showsUserLocation={true}
         onUserLocationChange={(e: any) => {
            if (e.nativeEvent.coordinate) {
              setLocation(e.nativeEvent.coordinate);
            }
          }}
        >
          {/* Boucle sur les poteaux avec l'événement onPress sur le Marker */}
          {poteauxList.map((poteau, index) => (
            <Marker 
              key={poteau.id} 
              coordinate={{ latitude: poteau.latitude, longitude: poteau.longitude }}
              tappable={true}
              onPress={() => gererSuppressionPoteau(poteau.id, index)} 
            >
               <View style={styles.markerContainer}>
                  {/* Petit badge pour voir le numéro du poteau sur la map */}
                  <View style={styles.badgeIndex}>
                    <Text style={styles.badgeIndexText}>{index + 1}</Text>
                  </View>
                  <View style={styles.pboBox}>
                    <MaterialCommunityIcons name="transmission-tower" size={20} color="white" />
                  </View>
                  <View style={styles.poleLine} />
               </View>
            </Marker>
          ))}
        </MapView>
      ) : (
        <View style={styles.loading}>
          <ActivityIndicator size="large" color="#1A237E" />
          <Text style={{marginTop: 10}}>Chargement de la carte...</Text>
        </View>
      )}
  
      {poteauxList.length > 0 && (
          <TouchableOpacity 
            style={styles.confirmFab} 
            onPress={() => Alert.alert("Succès", `${poteauxList.length} poteaux enregistrés.`)}
          >
              <Text style={styles.confirmFabText}>VALIDER LA DEMANDE ({poteauxList.length})</Text>
          </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white' },
  topActions: { padding: 15, zIndex: 10, backgroundColor: 'white', elevation: 4 },
  btnAction: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center', 
    padding: 14, 
    borderRadius: 12 
  },
  btnText: { color: 'white', fontWeight: 'bold', marginLeft: 10 },
  map: { width: '100%', flex: 1 },
  loading: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  
  markerContainer: { 
    alignItems: 'center', 
    justifyContent: 'center',
    width: 40,
  },
  pboBox: {
    backgroundColor: '#1A237E', 
    padding: 5,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: 'white',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    zIndex: 2,
  },
  poleLine: {
    width: 4,
    height: 25,
    backgroundColor: '#444', 
    marginTop: -2, 
    borderBottomLeftRadius: 2,
    borderBottomRightRadius: 2,
  },
  // Style du petit numéro au dessus de l'icône du poteau
  badgeIndex: {
    position: 'absolute',
    top: -12,
    backgroundColor: '#D32F2F',
    borderRadius: 10,
    width: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
    borderWidth: 1,
    borderColor: 'white'
  },
  badgeIndexText: {
    color: 'white',
    fontSize: 9,
    fontWeight: 'bold'
  },

  confirmFab: { 
    position: 'absolute', 
    bottom: 30, 
    alignSelf: 'center', 
    backgroundColor: '#d1820c', 
    paddingHorizontal: 30, 
    paddingVertical: 15, 
    borderRadius: 30, 
    elevation: 8 
  },
  confirmFabText: { color: 'white', fontWeight: 'bold', fontSize: 16 }
});