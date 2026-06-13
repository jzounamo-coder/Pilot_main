import React from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import MapView from '../../../components/MapViewWrapper/MapViewWrapper';
import { PoteauMarker } from './PoteauMarker';
import { styles } from '../demandePoteau.style';

interface PoteauMapProps {
  location: any;
  setLocation: (coords: any) => void;
  poteauxList: any[];
  onMarkerPress: (poteauId: number, index: number) => void;
}

export function PoteauMap({ location, setLocation, poteauxList, onMarkerPress }: PoteauMapProps) {
  if (!location) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#1A237E" />
        <Text style={{ marginTop: 10 }}>Chargement de la carte...</Text>
      </View>
    );
  }

  return (
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
      {poteauxList.map((poteau, index) => (
        <PoteauMarker
          key={poteau.id}
          poteau={poteau}
          index={index}
          onPress={() => onMarkerPress(poteau.id, index)}
        />
      ))}
    </MapView>
  );
}