import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles, PRIMARY_BLUE } from './mapScreenWeb.style';

export default function MapScreenWeb() {
  return (
    <View style={styles.container}>
      <Ionicons name="map-outline" size={80} color={PRIMARY_BLUE} />
      
      <Text style={styles.title}>Mode Web</Text>
      
      <Text style={styles.text}>
        La carte interactive de géolocalisation est uniquement disponible sur l'application mobile (Android ou iOS).
      </Text>
    </View>
  );
}