import { useState } from 'react';
import { Alert } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';

export interface InstallationData {
  nom: string;
  type: string;
  id: string;
  ville: string;
  arrondissement: string;
}

export const useValidationInstallation = () => {
  const route = useRoute<any>();
  const navigation = useNavigation();

  // Données d'installation avec fallback par défaut sécurisé
  const installation: InstallationData = route.params?.installation || { 
    nom: 'Client Inconnu', 
    type: 'OE', 
    id: 'INST-000', 
    ville: 'Brazzaville', 
    arrondissement: 'Centre' 
  };

  const [heureArrivee, setHeureArrivee] = useState<string | null>(null);
  const [numeroMateriel, setNumeroMateriel] = useState('');
  const [signalDbm, setSignalDbm] = useState('');
  const [loading, setLoading] = useState(false);

  const marquerArrivee = () => {
    const maintenant = new Date();
    const heures = maintenant.getHours().toString().padStart(2, '0');
    const minutes = maintenant.getMinutes().toString().padStart(2, '0');
    setHeureArrivee(`${heures}:${minutes}`);
  };

  const validerLInstallation = () => {
    if (!heureArrivee) {
      Alert.alert("Action requise", "Veuillez d'abord valider l'heure d'arrivée sur le site (Étape 1).");
      return;
    }
    if (!numeroMateriel.trim()) {
      Alert.alert("Action requise", "Veuillez saisir le numéro de série du matériel ou PBO/PTO (Étape 2).");
      return;
    }
    if (!signalDbm.trim()) {
      Alert.alert("Action requise", "Veuillez renseigner la mesure de puissance du signal en dBm (Étape 3).");
      return;
    }

    setLoading(true);

    // Simulation de la requête d'API de clôture de chantier
    setTimeout(() => {
      setLoading(false);
      Alert.alert(
        "Succès", 
        `L'installation pour ${installation.nom} a été validée avec succès !`,
        [{ text: "OK", onPress: () => navigation.goBack() }]
      );
    }, 1500);
  };

  return {
    installation,
    heureArrivee,
    numeroMateriel,
    signalDbm,
    loading,
    setNumeroMateriel,
    setSignalDbm,
    marquerArrivee,
    validerLInstallation,
  };
};