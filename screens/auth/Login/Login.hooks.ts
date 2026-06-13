import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { useNavigation } from '@react-navigation/native';

// --- ENTRAILLES REDUX ---
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../../../redux/slices/authslices'; // À adapter selon l'arborescence finale
import { RootState, AppDispatch } from '../../../redux/store'; // À adapter selon l'arborescence finale

export const LoginHooks = () => {
  const navigation = useNavigation<any>();
  const dispatch = useDispatch<AppDispatch>();

  const [email, setEmail] = useState('dis.wortis2@gmail.com');
  const [password, setPassword] = useState('12345');

  const { loading, error, token, user, role } = useSelector((state: RootState) => state.auth);

  // 1. SURVEILLANCE DE L'ÉTAT REDUX AUTH EN TEMPS RÉEL
  useEffect(() => {
    console.log("==================================================");
    console.log("🔄 [ÉCOUTEUR REDUX] L'état de l'authentification a changé :");
    console.log("➡️ loading :", loading);
    console.log("➡️ error   :", error || "Aucune erreur");
    console.log("➡️ token   :", token ? `Reçu (Tronqué : ${token.substring(0, 15)}...)` : "Aucun token");
    console.log("==================================================");
  }, [loading, error, token, user, role]);

  // CHARGEMENT DE L'EMAIL SAUVEGARDÉ AU DÉMARRAGE
  useEffect(() => {
    const checkSavedUser = async () => {
      console.log(" [DÉMARRAGE] Vérification d'un email sauvegardé...");
      const savedEmail = await AsyncStorage.getItem('userEmail');
      if (savedEmail) {
        console.log(" [DÉMARRAGE] Email trouvé et pré-rempli :", savedEmail);
        setEmail(savedEmail);
      } else {
        console.log(" [DÉMARRAGE] Aucun email en mémoire.");
      }
    };
    checkSavedUser();
  }, []);

  // 2. SURVEILLANCE DE LA RÉUSSITE DE LA CONNEXION (TOKEN)
  useEffect(() => {
    const saveSession = async () => {
      if (token) {
        console.log(" [SESSION] Un token valide est détecté, écriture en mémoire...");
        try {
          await AsyncStorage.setItem('userEmail', email.trim());
          await SecureStore.setItemAsync('userToken', token);
          console.log(" [SESSION] Stockage local réussi.");
          console.log(" [NAVIGATION] Le fichier Navigation.tsx va t'ouvrir l'application automatiquement.");
        } catch (e) {
          console.error(" [SESSION] Échec de la sauvegarde locale :", e);
        }
      }
    };
    saveSession();
  }, [token, role, email]);

  // 3. SURVEILLANCE ET AFFICHAGE DES ERREURS API
  useEffect(() => {
    if (error) {
      console.error(" [ALERTE ERREUR ERGONOMIQUE] Affichage de la boîte de dialogue :", error);
      Alert.alert("Erreur de connexion", error);
    }
  }, [error]);

  const handleLogin = () => {
    console.log(" [ACTION] Clic sur le bouton 'SE CONNECTER'");
    if (!email || !password) {
      console.warn(" [VALIDATION] Saisie incomplète : Email ou Mot de passe vide.");
      Alert.alert("Champs manquants", "Veuillez entrer vos identifiants.");
      return;
    }

    console.log(` [REQUÊTE] Dispatch de loginUser pour : ${email.trim()}`);
    dispatch(loginUser({ email: email.trim(), password: password }));
  };

  const handleForgotPassword = () => {
    navigation.navigate('ForgotPassword');
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    loading,
    handleLogin,
    handleForgotPassword,
  };
};