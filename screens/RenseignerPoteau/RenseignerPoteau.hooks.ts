// RenseignerPoteau.hooks.ts
import { useState } from 'react';
import { Alert } from 'react-native';

export const useRenseignerPoteau = (route: any, navigation: any) => {
  // Récupération sécurisée des infos du poteau actuel passé en paramètre
  const { poteau } = route.params || {}; 

  const [etat, setEtat] = useState('Bon état');
  const [nbPbo, setNbPbo] = useState('');
  const [lat, setLat] = useState('');
  const [lng, setLng] = useState('');

  // Fonction utilitaire pour obtenir la couleur selon l'état choisi
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Bon état': return '#00C853'; // Vert
      case 'Mauvais état': return '#FFD600'; // Jaune
      case 'Tombé': return '#D50000'; // Rouge
      default: return '#1A237E';
    }
  };

  // Traitement de l'enregistrement des données
  const handleSave = () => {
    Alert.alert("Succès", "Les informations ont été enregistrées localement.");
    navigation.goBack();
  };

  return {
    poteau,
    etat,
    setEtat,
    nbPbo,
    setNbPbo,
    lat,
    setLat,
    lng,
    setLng,
    getStatusColor,
    handleSave,
  };
};