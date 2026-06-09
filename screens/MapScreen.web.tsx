import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function MapScreen() {
  return (
    <View style={styles.container}>
      <Ionicons name="map-outline" size={80} color="#1A237E" />
      <Text style={styles.title}>Mode Web</Text>
      <Text style={styles.text}>
        La carte interactive de géolocalisation est uniquement disponible sur l'application mobile (Android ou iOS).
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: '#f5f5f5',
    padding: 20
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 15,
    marginBottom: 10
  },
  text: { 
    fontSize: 16, 
    color: 'gray', 
    textAlign: 'center', 
    lineHeight: 24
  }
});