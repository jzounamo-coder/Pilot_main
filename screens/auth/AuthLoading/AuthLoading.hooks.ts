import { useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import * as SecureStore from 'expo-secure-store';
import { useDispatch } from 'react-redux';
import { restoreToken } from '../../../redux/slices/authslices';

export const AuthLoadingHooks = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation<any>();

  useEffect(() => {
    const checkSession = async () => {
      try {
        // 1. Recherche du token dans le stockage sécurisé
        const token = await SecureStore.getItemAsync('userToken');
        
        // 2. Récupération optionnelle du rôle (par défaut 'PILOT')
        const role = (await SecureStore.getItemAsync('userRole')) || 'PILOT';

        if (token) {
          // 3. Session trouvée -> Restauration dans Redux
          dispatch(restoreToken({ token, role }));
          
          // 4. Redirection vers l'application principale
          navigation.replace('Root');
        } else {
          // 5. Pas de token -> Redirection vers la Connexion
          navigation.replace('Login');
        }
      } catch (e) {
        // En cas d'erreur de lecture, sécurité maximale : retour au Login
        navigation.replace('Login');
      }
    };

    checkSession();
  }, [dispatch, navigation]);
};