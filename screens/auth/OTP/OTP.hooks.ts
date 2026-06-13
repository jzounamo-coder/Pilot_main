import { useState } from 'react';
import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export const OTPHooks = () => {
  const navigation = useNavigation<any>();
  const [otp, setOtp] = useState('');

  const handleVerify = () => {
    // Vérification de la complétude du code à 6 chiffres
    if (otp.trim().length === 6) {
      navigation.navigate('ResetPassword');
    } else {
      Alert.alert("Code incomplet", "Veuillez entrer les 6 chiffres du code.");
    }
  };

  const handleGoBack = () => {
    navigation.goBack();
  };

  const handleResendCode = () => {
    console.log("[OTP] Demande de renvoi du code de vérification");
    // Emplacement pour ajouter l'appel API de renvoi d'email ultérieurement
    Alert.alert("Code renvoyé", "Un nouveau code de vérification a été envoyé sur votre email.");
  };

  return {
    otp,
    setOtp,
    handleVerify,
    handleGoBack,
    handleResendCode,
  };
};