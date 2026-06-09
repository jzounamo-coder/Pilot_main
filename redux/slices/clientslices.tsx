import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

interface ClientState {
  list: any[];
  loading: boolean;
  error: string | null;
}

const initialState: ClientState = {
  list: [],
  loading: false,
  error: null,
};

// LA FONCTION QUI VA CHERCHER LES CLIENTS
export const fetchClients = createAsyncThunk(
  'clients/fetchClients',
  async (_, thunkAPI) => {
    try {
      // On récupère le token de connexion stocké dans ton authSlice
      const state = thunkAPI.getState() as any;
      const token = state.auth.token;

      const response = await fetch('https://control-api-dev.speedpro.cg/api/v1/ftth/clients', {
        method: 'GET',
        headers: { 
          'Authorization': `Bearer ${token}`, 
          'Content-Type': 'application/json' 
        },
      });

      const data = await response.json();

      // On vérifie si l'API répond avec succès
      if (data.success || response.ok) {

       
        return data.data || data.clients || data; 
      } else {
        throw new Error(data.message || "Erreur lors de la récupération");
      }
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

const clientSlice = createSlice({
  name: 'clients',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchClients.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchClients.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload; 
      })
      .addCase(fetchClients.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default clientSlice.reducer;