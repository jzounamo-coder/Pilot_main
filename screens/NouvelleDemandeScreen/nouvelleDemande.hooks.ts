import { useState } from 'react';
import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useCameraPermissions } from 'expo-camera';

export function useNouvelleDemande() {
  const navigation = useNavigation();
  
  const [pboMa, setPboMa] = useState('');
  const [pboNumero, setPboNumero] = useState('');
  const [clientId, setClientId] = useState('');
  // Champs mis en commentaire
  // const [sn, setSn] = useState('');
  // const [reason, setReason] = useState('');
  
  const [modalVisible, setModalVisible] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const [saving, setSaving] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();
  const [activeField, setActiveField] = useState<string | null>(null);

  const RAISONS = ['Échec de stabilisation', 'Port ONT scintille'];

  // Construit l'idPbo final selon ce que l'utilisateur a saisi
  const buildIdPbo = () => {
    if (pboMa.trim() && pboNumero.trim()) {
      return `BZV-${pboMa.trim().toUpperCase()}-PB${pboNumero.trim()}`;
    } else if (pboNumero.trim()) {
      return pboNumero.trim(); // Juste le code si pas de MA
    }
    return '';
  };

  const openScanner = async () => {
    const { granted } = await requestPermission();
    if (granted) {
      setShowScanner(true);
    } else {
      Alert.alert('Permission requise', 'Veuillez autoriser l\'accès à la caméra pour scanner.');
    }
  };

  const handleSubmit = async () => {
    const idPbo = buildIdPbo();

    // Validation mise à jour : seulement ID PBO et Client ID requis
    if (!idPbo || !clientId) {
      Alert.alert('Erreur', 'Veuillez remplir les champs obligatoires.');
      return;
    }

    setSaving(true);

    // 1. Préparation des données (sans SN et Reason)
    const payload = { idPbo, clientId };
    try { 
      const response: any = await fetch('https://control-api-dev.speedpro.cg/api/v1/pilot/ot-recreation', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      
      const rawText = await response.text();
      
      if (response.ok) {
        Alert.alert('Succès', 'Demande créée avec succès !');
        navigation.goBack();
      } else {
        console.error("Erreur serveur :", rawText);
        Alert.alert('Erreur', 'Serveur : ' + response.status + '\nVoir console pour détails.');
      }
    } catch (error) {
      console.error('Erreur Catch (Réseau) :', error);
      Alert.alert('Erreur', 'Impossible de joindre le serveur. Vérifiez votre connexion.');
    } finally {
      setSaving(false);
    }
  };

  return {
    pboMa,
    setPboMa,
    pboNumero,
    setPboNumero,
    clientId,
    setClientId,
    modalVisible,
    setModalVisible,
    showScanner,
    setShowScanner,
    saving,
    activeField,
    setActiveField,
    RAISONS,
    openScanner,
    handleSubmit,
    navigation,
    // sn, setSn, reason, setReason // Laissés ici en commentaire si besoin futur
  };
}