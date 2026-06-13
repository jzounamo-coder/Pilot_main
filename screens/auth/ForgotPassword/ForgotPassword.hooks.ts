import { useState } from 'react';
import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export const ForgotPasswordHooks = () => {
  const navigation = useNavigation<any>();
  const [email, setEmail] = useState('');

  const handleSendCode = () => {
    // Validation rudimentaire (présence du @) avant envoi
    if (email.trim().includes('@')) {
      // On navigue vers l'écran OTP
      navigation.navigate('OTP');
    } else {
      Alert.alert("Format incorrect", "Veuillez entrer une adresse email valide.");
    }
  };

  const handleGoBack = () => {
    navigation.goBack();
  };

  return {
    email,
    setEmail,
    handleSendCode,
    handleGoBack,
  };
};