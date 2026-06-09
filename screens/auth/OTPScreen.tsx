import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TextInput, 
  TouchableOpacity, 
  SafeAreaView 
} from 'react-native';

const OTPScreen = ({ navigation }: any) => {
  const [otp, setOtp] = useState('');

  const handleVerify = () => {
    if (otp.length === 6) {

      // Si le code a 6 chiffres, on passe à la suite
      navigation.navigate('ResetPassword');
    } else {
      alert("Veuillez entrer les 6 chiffres du code.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.inner}>
        
        {/* Bouton retour */}
        <TouchableOpacity onPress={() => navigation.goBack()}>
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

        <TouchableOpacity style={styles.resendContainer}>
          <Text style={styles.resendText}>Vous n'avez pas reçu le code ? </Text>
          <Text style={styles.resendLink}>Renvoyer</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  inner: {
    padding: 24,
  },
  backButton: {
    fontSize: 18,
    color: '#1A237E',
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 10,
  },
  instructions: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
    lineHeight: 22,
  },
  otpInput: {
    height: 60,
    backgroundColor: '#F6F6F6',
    borderRadius: 10,
    textAlign: 'center',
    fontSize: 28,
    fontWeight: 'bold',
    letterSpacing: 10, 
    marginBottom: 30,
    borderWidth: 1,
    borderColor: '#E8E8E8',
  },
  button: {
    backgroundColor: '#1A237E',
    height: 55,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  resendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 25,
  },
  resendText: {
    color: '#666',
  },
  resendLink: {
    color: '#1A237E',
    fontWeight: 'bold',
  },
});

export default OTPScreen;