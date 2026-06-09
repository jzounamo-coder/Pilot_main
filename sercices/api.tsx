import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { logout } from '../redux/slices/authslices';
import { store } from '../redux/store'; 

// Configuration de base
const api = axios.create({
  baseURL: 'https://control-api1.speedpro.cg/api/v1/dry',
  headers: {
    'Content-Type': 'application/json',
  },
});

//  INTERCEPTEUR DE REQUÊTE : Ajoute le token automatiquement 
api.interceptors.request.use(
  async (config) => {
    const token = await SecureStore.getItemAsync('userToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

//  INTERCEPTEUR DE RÉPONSE : Gère l'expiration (Auto-Logout) 
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Si le serveur renvoie 401 (Non autorisé/Token expiré)
    if (error.response && error.response.status === 401) {
      store.dispatch(logout());
      // Optionnel : Tu peux ajouter une alerte ici
    }
    return Promise.reject(error);
  }
);

export default api;