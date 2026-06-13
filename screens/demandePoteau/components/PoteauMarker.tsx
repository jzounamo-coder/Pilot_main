import React from 'react';
import { View, Text } from 'react-native';
import { Marker } from '../../../components/MapViewWrapper/MapViewWrapper'; // Ajustez le chemin vers votre Wrapper selon votre arborescence
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { styles } from '../demandePoteau.style';

interface PoteauMarkerProps {
  poteau: {
    id: number;
    latitude: number;
    longitude: number;
  };
  index: number;
  onPress: () => void;
}

export function PoteauMarker({ poteau, index, onPress }: PoteauMarkerProps) {
  return (
    <Marker 
      coordinate={{ latitude: poteau.latitude, longitude: poteau.longitude }}
      tappable={true}
      onPress={onPress} 
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
  );
}