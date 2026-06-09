import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function MapView({ style, children }: any) {
  return (
    <View style={[styles.container, style]}>
      <Text style={styles.text}>🗺️ Carte non disponible sur web</Text>
      {children}
    </View>
  );
}

export const Marker = (_props: any) => null;
export const Polyline = (_props: any) => null;
export const Circle = (_props: any) => null;

const styles = StyleSheet.create({
  container: { backgroundColor: '#e0e0e0', justifyContent: 'center', alignItems: 'center', borderRadius: 8 },
  text: { color: '#666', fontSize: 14 },
});
