import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { ThunkDispatch, AnyAction } from '@reduxjs/toolkit';
import * as ImagePicker from 'expo-image-picker';
import { enregistrerPboFull, checkClientByAbn, clearClientInfo, clearPboInfo } from '../../redux/slices/pboslices';

export function usePboFull() {
  const navigation = useNavigation<any>();
  const dispatch: ThunkDispatch<any, any, AnyAction> = useDispatch();
  
  const { loading, clientInfo, loadingCheckClient, errorCheckClient } = useSelector((state: any) => state.pbos);

  // États locaux
  const [localPboInfo, setLocalPboInfo] = useState<any>(null);
  const [localLoadingCheckPbo, setLocalLoadingCheckPbo] = useState(false);
  const [localErrorCheckPbo, setLocalErrorCheckPbo] = useState<string | null>(null);
  const [pboCheckDone, setPboCheckDone] = useState(false);
  const [loginCheckDone, setLoginCheckDone] = useState(false);

  const [activeField, setActiveField] = useState<string | null>(null);
  const [isPboNomme, setIsPboNomme] = useState<boolean | null>(null);
  const [pboMa, setPboMa] = useState('');
  const [pboNumero, setPboNumero] = useState('');
  const [nomClient, setNomClient] = useState('');
  const [phoneNumber, setPhoneNumber] = useState(''); 
  const [loginId, setLoginId] = useState('');         
  const [photoPboUri, setPhotoPboUri] = useState<string | null>(null);
  const [photoEnvironnementUri, setPhotoEnvironnementUri] = useState<string | null>(null);

  const isClientFound = !!clientInfo;
  const isPboFound = !!localPboInfo;

//fonction annulation retour automatique
// Dans pboFull.hooks.js
  const resetCheckStatus = () => {
  setLocalPboInfo(null);
  setLocalErrorCheckPbo(null);
  setPboCheckDone(false);
  dispatch(clearPboInfo());
    };

  // Synchro des infos clients
  useEffect(() => {
    if (clientInfo) {
      const details = clientInfo.data || {};
      const nom = clientInfo.label || details.lastName || "";
      const tel = clientInfo.officePhone || details.officePhone || clientInfo.homePhone || "";
      setNomClient(nom);
      setPhoneNumber(tel);
    } else {
      setNomClient('');
      setPhoneNumber('');
    }
  }, [clientInfo]);

  // Validation formulaire statique
  const pboConditionOk = isPboNomme === false || (isPboNomme === true && isPboFound);
  const auMoinsUnCheckFait = pboCheckDone || loginCheckDone;
  const canSubmit = !loading && pboConditionOk && auMoinsUnCheckFait;

  const handlePickPhoto = async (type: 'pbo' | 'env') => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission requise', "Nous avons besoin de l'accès à l'appareil photo pour continuer.");
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      if (type === 'pbo') setPhotoPboUri(result.assets[0].uri);
      else setPhotoEnvironnementUri(result.assets[0].uri);
    }
  };

  const resetPbo = () => {
    setLocalPboInfo(null);
    setLocalErrorCheckPbo(null);
    setPboCheckDone(false);
    setPboMa('');
    setPboNumero('');
    dispatch(clearPboInfo());
  };

  const resetLogin = () => {
    dispatch(clearClientInfo());
    setLoginCheckDone(false);
    setLoginId('');
    setNomClient('');
    setPhoneNumber('');
  };

  const handleCheckPbo = async () => {
    if (!pboMa.trim() || !pboNumero.trim()) {
      Alert.alert('Erreur', 'Veuillez remplir le code MA et le numéro du PBO.');
      return;
    }
    const pboFinal = `BZV-${pboMa.trim().toUpperCase()}-PB${pboNumero.trim()}`;
    setLocalLoadingCheckPbo(true);
    setLocalErrorCheckPbo(null);
    setLocalPboInfo(null);
    try {
      const response = await fetch('https://control-api-dev.speedpro.cg/api/v1/ftth/pbo/check-by-idpbo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idPbo: pboFinal }),
      });
      const rawText = await response.text();
      let json: any;
      try { json = JSON.parse(rawText); } catch (e) {
        setLocalErrorCheckPbo('Réponse invalide du serveur.');
        setPboCheckDone(true);
        return;
      }
      if (json && json.success === true && json.data) {
        setLocalPboInfo(json.data);
        setLocalErrorCheckPbo(null);
      } else {
        setLocalErrorCheckPbo(json?.message || 'PBO non Marqué ou invalide.');
      }
    } catch (err) {
      setLocalErrorCheckPbo('Erreur de connexion au serveur.');
    } finally {
      setLocalLoadingCheckPbo(false);
      setPboCheckDone(true);
    }
  };

  const handleCheckLogin = async () => {
    if (!loginId.trim()) {
      Alert.alert('Erreur', 'Veuillez saisir un Login ID.');
      return;
    }
    await dispatch(checkClientByAbn(loginId.trim()) as any);
    setLoginCheckDone(true);
  };

  const handleValider = async () => {
    if (isPboNomme === null) {
      Alert.alert('Erreur', 'Veuillez spécifier si le PBO est nommé ou non.');
      return;
    }
    let pboFinal = '';
    if (isPboNomme) {
      if (!isPboFound) {
        Alert.alert('Vérification requise', "Veuillez valider le PBO à l'aide du bouton de recherche avant d'enregistrer.");
        return;
      }
      pboFinal = `BZV-${pboMa.trim().toUpperCase()}-PB${pboNumero.trim()}`;
    }
    const donneesTicket = {
      isPboNomme,
      pbo: isPboNomme ? pboFinal : null,
      nomClient: nomClient.trim(),
      phoneNumber: phoneNumber.trim(),
      loginId: loginId.trim(),
      photoPbo: photoPboUri,
      photoEnvironnement: photoEnvironnementUri
    };
    try {
      await dispatch(enregistrerPboFull(donneesTicket) as any).unwrap();
      Alert.alert('Succès', 'Enregistré avec succès !', [{
        text: 'OK', onPress: () => {
          dispatch(clearClientInfo());
          dispatch(clearPboInfo());
          setLocalPboInfo(null); setLocalErrorCheckPbo(null);
          setPboCheckDone(false); setLoginCheckDone(false);
          setLoginId(''); setPboMa(''); setPboNumero('');
          setPhotoPboUri(null); setPhotoEnvironnementUri(null);
          navigation.goBack();
        }
      }]);
    } catch (error: any) {
      Alert.alert('Erreur', error || "Une erreur est survenue lors de l'enregistrement.");
    }
  };

  return {
    loading,
    clientInfo,
    loadingCheckClient,
    errorCheckClient,
    localPboInfo,
    localLoadingCheckPbo,
    localErrorCheckPbo,
    pboCheckDone,
    loginCheckDone,
    isClientFound,
    isPboFound,
    activeField,
    setActiveField,
    isPboNomme,
    setIsPboNomme,
    pboMa,
    setPboMa,
    pboNumero,
    setPboNumero,
    nomClient,
    setNomClient,
    phoneNumber,
    setPhoneNumber,
    loginId,
    setLoginId,
    photoPboUri,
    setPhotoPboUri,
    photoEnvironnementUri,
    setPhotoEnvironnementUri,
    canSubmit,
    handlePickPhoto,
    resetPbo,
    resetLogin,
    handleCheckPbo,
    handleCheckLogin,
    handleValider,
    navigation
  };
}