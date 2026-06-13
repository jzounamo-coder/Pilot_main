import React from 'react';
import { View, Platform, Text, ActivityIndicator } from 'react-native'; 
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';

import { styles, PRIMARY_BLUE } from './mapScreen.style';
import { useMapData } from './mapScreen.hooks';
import { PboMarker } from './components/PboMarker';
import { PoleMarker } from './components/PoleMarker';

export default function MapScreen() {
  const {
    pbos,
    poles,
    loading,
    userLocation,
    currentRegion,
    setCurrentRegion,
    getPboColor
  } = useMapData();

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color={PRIMARY_BLUE} />
        <Text style={styles.loaderText}>Chargement de la position et des données...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined}
        style={styles.map}
        showsUserLocation={true}
        followsUserLocation={false} 
        initialRegion={currentRegion}
        // 2. ON DÉTECTE QUAND L'UTILISATEUR BOUGE OU ZOOME
        onRegionChangeComplete={setCurrentRegion}
      >
        
        {/* 3. AFFICHAGE CONDITIONNEL SELON LE ZOOM (latitudeDelta) */}
        {/* On affiche les PBO si le delta est inférieur à 0.04 (Zoom assez haut) */}
        {currentRegion.latitudeDelta < 0.04 && pbos.map((pbo, index) => (
          <PboMarker 
            key={pbo._id || `pbo-${index}`}
            pbo={pbo}
            index={index}
            pinColor={getPboColor(pbo.pboNumberFreePort)}
          />
        ))}

        {/* On affiche les poteaux seulement si on est encore plus proche (Delta < 0.02) */}
        {/* Car les poteaux avec images personnalisées sont très lourds à charger */}
        {currentRegion.latitudeDelta < 0.02 && poles.map((pole, index) => (
          <PoleMarker 
            key={pole._id || `pole-${index}`}
            pole={pole}
            index={index}
          />
        ))}

        {userLocation && (
          <Marker 
            coordinate={userLocation} 
            title="Vous êtes ici" 
            pinColor="navy" 
          />
        )}
      </MapView>
    </View>
  );
}