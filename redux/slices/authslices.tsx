import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import * as SecureStore from 'expo-secure-store'; 
import { Platform } from 'react-native';

interface AuthState {
  user: any | null;
  token: string | null;
  role: string | null;
  loading: boolean;
  error: string | null | any; 
  isAuthenticated: boolean; 
}

const initialState: AuthState = {
  user: null,
  token: null,
  role: null,
  loading: false,
  error: null,
  isAuthenticated: false,
};

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (credentials: any, thunkAPI) => {
    try {
      
     const response = await fetch(
  Platform.OS === 'web' 
    ? '/api/v1/dry/dry-auth/login'
    : 'https://control-api-dev.speedpro.cg/api/v1/dry/dry-auth/login',
  {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        return thunkAPI.rejectWithValue(data.message || 'Identifiants invalides');
      }

      //  Vérification du compte désactivé 
      if (data.data.status === 'DISABLED') {
        return thunkAPI.rejectWithValue("Compte désactivé par l'administrateur.");
      }

      //  Chiffrement et stockage du token 
      await SecureStore.setItemAsync('userToken', data.token);
      await SecureStore.setItemAsync('user', JSON.stringify(data.data));

      return data; 
    } catch (error:any) {
      console.error("Erreur lors de la connexion :", error.message );
      return thunkAPI.rejectWithValue('Erreur réseau : impossible de joindre le serveur');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // RESTAURATION DE SESSION 
    restoreToken: (state, action: PayloadAction<{ token: string; role: string }>) => {
      state.token = action.payload.token;
      state.role = action.payload.role;
      state.isAuthenticated = true;
      state.loading = false;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.role = null;
      state.error = null;
      state.isAuthenticated = false;
      SecureStore.deleteItemAsync('userToken'); 
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.data;
        state.token = action.payload.token;
        state.role = action.payload.data.role; 
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string; 
        state.isAuthenticated = false;
      });
  },
});

export const { logout, restoreToken } = authSlice.actions;
export default authSlice.reducer;