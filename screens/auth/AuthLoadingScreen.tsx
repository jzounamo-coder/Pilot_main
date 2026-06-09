import React, { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet, Image } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { useDispatch } from 'react-redux';
import { restoreToken } from '../../redux/slices/authslices'; 

const AuthLoadingScreen = ({ navigation }: any) => {
  const dispatch = useDispatch();

  useEffect(() => {
    const checkSession = async () => {
      try {
        // 1. On cherche si un token existe dans le stockage sécurisé 
        const token = await SecureStore.getItemAsync('userToken');
        
        // Optionnel : on peut aussi stocker et récupérer le rôle
        const role = await SecureStore.getItemAsync('userRole') || 'PILOT';

        if (token) {
          // 2. Si on trouve un token, on restaure la session dans Redux
          dispatch(restoreToken({ token, role }));
          
          // 3. On redirige vers l'application principale
          navigation.replace('Root'); 
        } else {
          // 4. Sinon, on va vers l'écran de connexion
          navigation.replace('Login');
        }
      } catch (e) {
        // En cas d'erreur, on sécurise en renvoyant au Login
        navigation.replace('Login');
      }
    };

    checkSession();
  }, [dispatch, navigation]);

  return (
    <View style={styles.container}>
      {/*  logo de SpeedPro ou un simple chargement */}
      <ActivityIndicator size="large" color="#1A237E" />
      <Image source={require('../../assets/logo.png')} style={styles.logo} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 100,
    height: 100,
    marginTop: 20,
    opacity: 0.5
  }
});

export default AuthLoadingScreen;