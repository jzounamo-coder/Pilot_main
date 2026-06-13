import React from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  SafeAreaView, 
  KeyboardAvoidingView, 
  Platform 
} from 'react-native';
import { styles } from './ForgotPassword.styles';
import { ForgotPasswordHooks } from './ForgotPassword.hooks';

export default function ForgotPasswordScreen() {
  const { email, setEmail, handleSendCode, handleGoBack } = ForgotPasswordHooks();

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.flex}
      >
        <View style={styles.inner}>
          
          {/* Bouton pour revenir au Login */}
          <TouchableOpacity onPress={handleGoBack} style={styles.backArea}>
            <Text style={styles.backButton}>← Retour</Text>
          </TouchableOpacity>

          <View style={styles.header}>
            <Text style={styles.title}>Mot de passe oublié</Text>
            <Text style={styles.instructions}>
              Pas de panique ! Entrez votre email pour recevoir un code de récupération.
            </Text>
          </View>

          <View style={styles.form}>
            <TextInput
              style={styles.input}
              placeholder="Votre email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />

            <TouchableOpacity style={styles.button} onPress={handleSendCode}>
              <Text style={styles.buttonText}>Envoyer le code</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}