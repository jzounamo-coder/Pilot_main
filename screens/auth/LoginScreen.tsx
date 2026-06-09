import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, Text, View, TextInput, TouchableOpacity, 
  KeyboardAvoidingView, Platform, Alert, ActivityIndicator, Dimensions, SafeAreaView 
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { Ionicons } from '@expo/vector-icons';

// --- AJOUTS REDUX ---
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../../redux/slices/authslices'; 
import { RootState, AppDispatch } from '../../redux/store'; 

const { width, height } = Dimensions.get('window');
const MAIN_BLUE = '#1A237E';
  
const LoginScreen = ({ navigation }: any) => {
  const [email, setEmail] = useState('smile.mbambi@congotelecom.cg');
  const [password, setPassword] = useState('admin');

  // --- LOGIQUE REDUX ---
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error, token, role } = useSelector((state: RootState) => state.auth);

  // CHARGEMENT DE L'EMAIL SAUVEGARDÉ AU DÉMARRAGE
  useEffect(() => {
    const checkSavedUser = async () => {
      const savedEmail = await AsyncStorage.getItem('userEmail');
      if (savedEmail) setEmail(savedEmail);
    };
    checkSavedUser();
  }, []);

  useEffect(() => {
    const saveSession = async () => {
      if (token) {
        await AsyncStorage.setItem('userEmail', email.trim());
        
        await SecureStore.setItemAsync('userToken', token);
        
        if (role === 'PILOT') {
          navigation.replace('Root'); 
        } else {
          navigation.replace('Root'); 
        }
        return;
      }
    };
    saveSession();
  }, [token, role]);

  useEffect(() => {
    if (error) {
      Alert.alert("Erreur de connexion", error);
    }
  }, [error]);

  const handleLogin = () => {
    if (!email || !password) {
      Alert.alert("Champs manquants", "Veuillez entrer vos identifiants.");
      return;
    }

    // On lance l'action Redux (qui gère le fetch en interne)
    dispatch(loginUser({ email: email.trim(), password: password }));
  };

  

  return (
    <SafeAreaView style={styles.container}>
      <View style={[styles.circle, styles.topCircle]} />
      <View style={[styles.circle, styles.bottomCircle]} />

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <View style={styles.inner}>
          
          <View style={styles.headerContainer}>
            <Text style={styles.brandTextBack}>Pilot</Text>
            <Text style={styles.brandTextFront}>Pilot</Text>
            <Text style={styles.subtitle}>SYSTÈME DE CONNEXION</Text>
          </View>

          <View style={styles.form}>
            <View style={styles.inputWrapper}>
              <Ionicons name="person-outline" size={20} color={MAIN_BLUE} style={{marginRight: 10}} />
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
              <Ionicons name="lock-closed-outline" size={20} color={MAIN_BLUE} style={{marginRight: 10}} />
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

            <View style={styles.recoveryContainer}>
                <TouchableOpacity 
                    onPress={() => navigation.navigate('ForgotPassword')}
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
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  topCircle: { width: width * 1.2, height: width * 1.2, borderRadius: width, backgroundColor: '#E8EAF6', position: 'absolute', top: -height * 0.15, left: -width * 0.2 },
  bottomCircle: { width: width * 1.2, height: width * 1.2, borderRadius: width, backgroundColor: '#EDF1F7', position: 'absolute', bottom: -height * 0.2, right: -width * 0.3 },
  circle: { position: 'absolute' },
  inner: { padding: 24, flex: 1, justifyContent: 'center', alignItems: 'center' },
  headerContainer: { marginBottom: 40, alignItems: 'center' },
  brandTextBack: { fontSize: 80, fontWeight: 'bold', color: '#E8EAF6', position: 'absolute', opacity: 0.5, top: -25 },
  brandTextFront: { fontSize: 45, fontWeight: 'bold', color: MAIN_BLUE },
  subtitle: { fontSize: 10, color: '#666', letterSpacing: 3, marginTop: 5 },
  form: { width: '100%' },
  inputWrapper: { flexDirection: 'row', alignItems: 'center', height: 60, backgroundColor: '#fff', borderRadius: 15, paddingHorizontal: 15, marginBottom: 15, borderWidth: 1, borderColor: '#E8E8E8' },
  input: { flex: 1, fontSize: 16 },
  button: { height: 60, borderRadius: 15, justifyContent: 'center', alignItems: 'center', marginTop: 10 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  recoveryContainer: { marginTop: 30, alignItems: 'center' },
  recoveryLink: { paddingVertical: 8 },
  recoveryText: { fontWeight: 'bold', fontSize: 14 },
  divider: { height: 1, width: 50, backgroundColor: '#EEE', marginVertical: 5 }
});

export default LoginScreen;