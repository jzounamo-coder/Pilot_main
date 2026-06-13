import React from 'react';
import { View, ActivityIndicator, Image } from 'react-native';
import { AuthLoadingHooks } from './AuthLoading.hooks';
import { styles } from './AuthLoading.styles';

export default function AuthLoadingScreen() {
  // On exécute la logique de vérification de session au montage
  AuthLoadingHooks();

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#1A237E" />
      <Image 
        source={require('../../assets/logo.png')} // À ajuster selon votre arborescence de dossiers
        style={styles.logo} 
      />
    </View>
  );
}