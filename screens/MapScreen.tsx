import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator, Platform, Text, Image } from 'react-native'; 
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';

export default function MapScreen() {
  const [pbos, setPbos] = useState<any[]>([]);
  const [poles, setPoles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState<any>(null);
  
  // 1. AJOUT D'UN ÉTAT POUR LA RÉGION ACTUELLE (Pour calculer le zoom)
  const [currentRegion, setCurrentRegion] = useState({
    latitude: -4.276043351759078,
    longitude: 15.279780031739126,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });

  const defaultLocation = {
    latitude: -4.276043351759078,
    longitude: 15.279780031739126,
  };

  const getPboColor = (freePorts: any) => {
    const free = parseInt(freePorts) || 0;
    if (free === 0) return 'red';
    if (free === 14 || free === 15) return 'yellow';
    if (free > 13) return 'green';
    return 'orange';
  };

  const fetchNearbyData = async (lat: number, lng: number) => {
    try {
      const response = await fetch('https://control-api-dev.speedpro.cg/api/v1/ftth/pbo/pbo-get', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          location: { lat, lng }
        }),
      });

      const json = await response.json();
      if (json.data.pbos) setPbos(json.data.pbos);
      if (json.data.poles) setPoles(json.data.poles);
    } catch (error) {
      console.error("Erreur API SpeedPro:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setUserLocation(defaultLocation);
        fetchNearbyData(defaultLocation.latitude, defaultLocation.longitude);
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;
      
      const newRegion = {
        latitude,
        longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      };

      setUserLocation({ latitude, longitude });
      setCurrentRegion(newRegion); 
      fetchNearbyData(latitude, longitude);

      await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.Balanced,
          timeInterval: 5000,
          distanceInterval: 10,
        },
        (newLocation) => {
          const { latitude, longitude } = newLocation.coords;
          setUserLocation({ latitude, longitude });
        }
      );
    })();
  }, []);

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#1A237E" />
        <Text style={{ marginTop: 10 }}>Chargement de la position et des données...</Text>
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
        onRegionChangeComplete={(region) => setCurrentRegion(region)}
      >
        
        {/* 3. AFFICHAGE CONDITIONNEL SELON LE ZOOM (latitudeDelta) */}
        {/* On affiche les PBO si le delta est inférieur à 0.04 (Zoom assez haut) */}
        {currentRegion.latitudeDelta < 0.04 && pbos.map((pbo, index) => (
          <Marker
            key={pbo._id || `pbo-${index}`}
            coordinate={{
              latitude: parseFloat(pbo.lat), 
              longitude: parseFloat(pbo.lng),
            }}
            title={pbo.idPbo || "PBO"}
            description={`Ports libres: ${pbo.pboNumberFreePort}`}
            pinColor={getPboColor(pbo.pboNumberFreePort)}
          />
        ))}

        {/* On affiche les poteaux seulement si on est encore plus proche (Delta < 0.02) */}
        {/* Car les poteaux avec images personnalisées sont très lourds à charger */}
        {currentRegion.latitudeDelta < 0.02 && poles.map((pole, index) => (
          <Marker
            key={pole._id || `pole-${index}`}
            coordinate={{
              latitude: parseFloat(pole.lat),
              longitude: parseFloat(pole.lng),
            }}
            title={`Poteau: ${pole.id_material}`}
          >
            <Image 
              source={require('../assets/images/poteaux_metal.png')} 
              style={{ width: 30, height: 30 }} // Taille légèrement réduite pour fluidité
              resizeMode="contain"
            />
          </Marker>
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

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { ...StyleSheet.absoluteFillObject },
  loader: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white' }
});