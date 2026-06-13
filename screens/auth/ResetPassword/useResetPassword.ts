import { useState } from 'react';
import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export const useResetPassword = () => {
  const navigation = useNavigation<any>();
  
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleReset = () => {
    // 1. Validation de la longueur du mot de passe
    if (newPassword.length < 6) {
      Alert.alert("Erreur", "Le mot de passe doit contenir au moins 6 caractères.");
      return;
    }

    // 2. Vérification de la correspondance des champs
    if (newPassword === confirmPassword) {
      Alert.alert(
        "Succès !", 
        "Votre mot de passe a été réinitialisé avec succès.",
        [{ text: "OK", onPress: () => navigation.navigate('Login') }]
      );
    } else {
      Alert.alert("Erreur", "Les mots de passe ne correspondent pas.");
    }
  };

  return {
    newPassword,
    setNewPassword,
    confirmPassword,
    setConfirmPassword,
    handleReset,
  };
};