import React from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  KeyboardAvoidingView, 
  Platform, 
  ActivityIndicator, 
  SafeAreaView 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles, MAIN_BLUE } from './Login.styles';
import { LoginHooks } from './Login.hooks';

export default function LoginScreen() {
  const {
    email,
    setEmail,
    password,
    setPassword,
    loading,
    handleLogin,
    handleForgotPassword
  } = LoginHooks();

  return (
    <SafeAreaView style={styles.container}>
      {/* Cercles de fond décoratifs */}
      <View style={[styles.circle, styles.topCircle]} />
      <View style={[styles.circle, styles.bottomCircle]} />

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        style={{ flex: 1 }}
      >
        <View style={styles.inner}>
          
          {/* Section En-tête */}
          <View style={styles.headerContainer}>
            <Text style={styles.brandTextBack}>Pilot</Text>
            <Text style={styles.brandTextFront}>Pilot</Text>
            <Text style={styles.subtitle}>SYSTÈME DE CONNEXION</Text>
          </View>

          {/* Formulaire */}
          <View style={styles.form}>
            <View style={styles.inputWrapper}>
              <Ionicons name="person-outline" size={20} color={MAIN_BLUE} style={{ marginRight: 10 }} />
              <TextInput
                style={styles.input}
                placeholder="Identifiant"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                textContentType="emailAddress" 
                autoComplete="email"
                keyboardType="email-address"
              />
            </View>
            
            <View style={styles.inputWrapper}>
              <Ionicons name="lock-closed-outline" size={20} color={MAIN_BLUE} style={{ marginRight: 10 }} />
              <TextInput
                style={styles.input}
                placeholder="Mot de passe"
                value={password}
                onChangeText={setPassword}
                secureTextEntry 
                textContentType="password"
                autoComplete="password"
              />
            </View>

            <TouchableOpacity 
              style={[styles.button, { backgroundColor: MAIN_BLUE }]} 
              onPress={handleLogin} 
              disabled={loading} 
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>SE CONNECTER</Text>
              )}
            </TouchableOpacity>

            {/* Lien Mot de passe oublié */}
            <View style={styles.recoveryContainer}>
              <TouchableOpacity 
                onPress={handleForgotPassword}
                style={styles.recoveryLink}
              >
                <Text style={[styles.recoveryText, { color: MAIN_BLUE }]}>Mot de passe oublié ?</Text>
              </TouchableOpacity>
              <View style={styles.divider} />
            </View>
          </View>

        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}