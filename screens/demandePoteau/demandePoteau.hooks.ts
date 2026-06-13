import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import * as Location from 'expo-location';

export function useDemandePoteauLogic() {
  const [location, setLocation] = useState<any>(null);
  const [poteauxList, setPoteauxList] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert("Permission refusée", "L'accès à la localisation est nécessaire.");
        return;
      }
      let currentLoc = await Location.getCurrentPositionAsync({});
      setLocation(currentLoc.coords);
    })();
  }, []);

  const ajouterPoteauIci = () => {
    if (location) {
      const nouveauPoteau = {
        id: Date.now(), 
        latitude: location.latitude,
        longitude: location.longitude,
      };
      setPoteauxList([...poteauxList, nouveauPoteau]);
    } else {
      Alert.alert("Attente", "Localisation en cours de récupération...");
    }
  };

  const gererSuppressionPoteau = (poteauId: number, index: number) => {
    Alert.alert(
      "Supprimer le poteau",
      `Voulez-vous vraiment supprimer le poteau n°${index + 1} ?`,
      [
        { text: "Annuler", style: "cancel" },
        { 
          text: "Oui, supprimer", 
          style: "destructive", 
          onPress: () => {
            setPoteauxList(poteauxList.filter(poteau => poteau.id !== poteauId));
          } 
        }
      ]
    );
  };

  const validerDemande = () => {
    Alert.alert("Succès", `${poteauxList.length} poteaux enregistrés.`);
  };

  return {
    location,
    setLocation,
    poteauxList,
    ajouterPoteauIci,
    gererSuppressionPoteau,
    validerDemande
  };
}