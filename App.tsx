import React, { useEffect, useRef } from 'react';
import { 
  StyleSheet, Text, View, TouchableOpacity, Animated 
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

// REDUX, PERSIST & SOCKET
import { Provider, useSelector, useDispatch } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react'; 
import { store, persistor, RootState } from './redux/store'; 
import socketService from './sercices/socketservices'; 
import { receiveMessage } from './redux/slices/chatslices'; 

import Navigation from './navigation'; 
import useCachedResources from './hooks/useCachedResources';
import useColorScheme from './hooks/useColorScheme';

//  IMPORTS DES ÉCRANS AUTH 
import LoginScreen from './screens/auth/Login/Login.screen'; 
import ForgotPasswordScreen from './screens/auth/ForgotPassword/ForgotPassword.screen';
import OTPScreen from './screens/auth/OTP/OTP.screen';                     
import ResetPasswordScreen from './screens/auth/ResetPassword/ResetPassword.screen'; 

const Stack = createNativeStackNavigator();

//  fond d'écran animé 
const GodRaysBackground = () => {
  const flickerAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(flickerAnim, { toValue: 1, duration: 2000, useNativeDriver: true }),
        Animated.timing(flickerAnim, { toValue: 0.2, duration: 1500, useNativeDriver: true }),
      ])
    ).start();
  }, []);
  const rayOpacity = flickerAnim.interpolate({ inputRange: [0, 1], outputRange: [0.05, 0.2] });
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <Animated.View style={[styles.rayBeam, { top: -150, left: -150, transform: [{ rotate: '-45deg' }], opacity: rayOpacity }]} />
      <Animated.View style={[styles.rayBeam, { bottom: -150, right: -150, transform: [{ rotate: '-45deg' }], opacity: rayOpacity, backgroundColor: '#2c469c' }]} />
    </View>
  );
};

{/*  ÉCRAN D'ACCUEIL AVEC FOND ANIMÉ ET BOUTON DE NAVIGATION VERS LOGIN 
const WelcomeScreen = ({ navigation }: any) => {
  return (
    <View style={styles.container}>
      <GodRaysBackground />
      <View style={styles.inner}>
        <View style={styles.titleWrapper}>
          <Text style={styles.titleGlow}>Pilot</Text>
          <Text style={styles.title}>Pilot</Text>
        </View>
        <TouchableOpacity  
          style={styles.button} 
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={styles.buttonText}>OPEN</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
*/ }

//  LE COMPOSANT DE NAVIGATION CONDITIONNELLE 
const RootNavigator = () => {
  const colorScheme = useColorScheme();
  const dispatch = useDispatch(); 
  
  const auth = useSelector((state: RootState) => state.auth);
  const token = auth?.token;
  const userId = auth?.user?.id; 

  useEffect(() => {
    if (token && userId) {
      socketService.connect(userId);
      socketService.onMessageReceived((data) => {
        dispatch(receiveMessage(data));
      });
    }
    return () => {
      socketService.disconnect();
    };
  }, [token, userId]);

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!token ? (
        <Stack.Group>
          {/*<Stack.Screen name="Welcome" component={WelcomeScreen} />*/}
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
          <Stack.Screen name="OTP" component={OTPScreen} />
          <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
        </Stack.Group>
      ) : (
        <Stack.Screen name="MainNavigation">
          {(props) => <Navigation {...props} colorScheme={colorScheme} />}
        </Stack.Screen>
      )}
    </Stack.Navigator>
  );
};

export default function App() {
  const isLoadingComplete = useCachedResources();
  
  if (!isLoadingComplete) return null;

  return (
    <SafeAreaProvider>
      <Provider store={store}>
        {/* LE CHANGEMENT EST ICI : On entoure tout avec PersistGate */}
        <PersistGate loading={null} persistor={persistor}>
          <NavigationContainer>
            <RootNavigator /> 
          </NavigationContainer>
        </PersistGate>
      </Provider>
      <StatusBar style="auto" />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  inner: { padding: 30, flex: 1, justifyContent: 'center' },
  titleWrapper: { alignItems: 'center', marginBottom: 60 },
  title: { fontSize: 48, fontWeight: 'bold', color: '#1A237E', textAlign: 'center', zIndex: 2 },
  titleGlow: { fontSize: 48, fontWeight: 'bold', color: '#1A237E', textAlign: 'center', position: 'absolute', top: 3, left: 3, opacity: 0.3, zIndex: 1 },
  button: { backgroundColor: '#1A237E', height: 65, borderRadius: 20, justifyContent: 'center', alignItems: 'center', elevation: 6 },
  buttonText: { color: '#fff', fontSize: 20, fontWeight: 'bold', letterSpacing: 3 },
  rayBeam: { position: 'absolute', width: 400, height: 400, borderRadius: 200, backgroundColor: '#1A237E' }
});