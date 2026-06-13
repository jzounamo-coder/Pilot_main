import React from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  SafeAreaView 
} from 'react-native';
import { OTPHooks } from './OTP.hooks';
import { styles } from './OTP.styles';

export default function OTPScreen() {
  const { otp, setOtp, handleVerify, handleGoBack, handleResendCode } = OTPHooks();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.inner}>
        
        {/* Bouton retour */}
        <TouchableOpacity onPress={handleGoBack}>
          <Text style={styles.backButton}>← Retour</Text>
        </TouchableOpacity>

        <Text style={styles.title}>Vérification</Text>
        <Text style={styles.instructions}>
          Nous avons envoyé un code de vérification à votre adresse email.
        </Text>

        {/* Champ de saisie OTP */}
        <TextInput
          style={styles.otpInput}
          placeholder="000000"
          value={otp}
          onChangeText={setOtp}
          keyboardType="numeric" 
          maxLength={6}          
        />

        <TouchableOpacity style={styles.button} onPress={handleVerify}>
          <Text style={styles.buttonText}>Vérifier le code</Text>
        </TouchableOpacity>

        {/* Demande de renvoi */}
        <TouchableOpacity style={styles.resendContainer} onPress={handleResendCode}>
          <Text style={styles.resendText}>Vous n'avez pas reçu le code ? </Text>
          <Text style={styles.resendLink}>Renvoyer</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}