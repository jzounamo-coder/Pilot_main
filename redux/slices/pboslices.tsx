import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

/**
 * 1. Action pour la MISE À JOUR des ports (PUT)
 */
export const updatePboPorts = createAsyncThunk(
  'pbos/updatePorts',
  async ({ id, used, free }: { id: string; used: number; free: number }, { rejectWithValue }) => {
    try {
      const response = await fetch(`https://control-api-dev.speedpro.cg/api/v1/ftth/pbo/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pboNumberUsedPort: used,
          pboNumberFreePort: free,
        }),
      });

      const contentType = response.headers.get("content-type");
 
      if (!response.ok) {
        let errorMsg = `Erreur ${response.status}`;
        if (contentType && contentType.includes("text/html")) {
          return rejectWithValue(`${errorMsg}: Le serveur a renvoyé une page HTML au lieu de JSON.`);
        }
        const errorData = await response.json();
        return rejectWithValue(errorData.message || errorMsg);
      }

      return await response.json(); 
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

/**
 * 2. Action pour l'AJOUT d'un nouveau PBO (POST)
 */
export const addPbo = createAsyncThunk(
  'pbos/addPbo',
  async (pboData: any, { rejectWithValue }) => {
    try {
      const response = await fetch(`https://control-api-dev.speedpro.cg/api/v1/ftth/pbo`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pboData),
      });

      const contentType = response.headers.get("content-type");

      if (!response.ok) {
        let errorMsg = `Erreur ${response.status}`;
        if (contentType && contentType.includes("text/html")) {
          const htmlError = await response.text();
          return rejectWithValue(`${errorMsg}: Erreur serveur (Format HTML).`);
        }
        const errorData = await response.json();
        return rejectWithValue(errorData.message || errorMsg);
      }

      return await response.json();
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

/**
 * 3. Action pour l'enregistrement complet (POST)
 */
export const enregistrerPboFull = createAsyncThunk(
  'pbos/enregistrerPboFull',
  async (donneesTicket: any, { rejectWithValue }) => {
    try {
      const response = await fetch('https://control-api-dev.speedpro.cg/api/v1/pilot/pbo-full', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(donneesTicket),
      });

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.message || 'Erreur lors de l\'enregistrement');
      }
      return await response.json();
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

/**
 * 4. Action pour la Vérification du client par loginId (POST)
 */
export const checkClientByAbn = createAsyncThunk(
  'pbos/checkClientByAbn',
  async (loginId: string, { rejectWithValue }) => {
    try {
      const response = await fetch('https://control-api-dev.speedpro.cg/api/v1/pilot/pbo-full/check-client-by-abn', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ loginId }),
      });

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data.message || 'Client introuvable ou invalide');
      }

      return data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Erreur de connexion réseau');
    }
  }
);

/**
 * 5. NOUVELLE ACTION : Récupération de la saturation (GET)
 */
export const fetchPboSaturation = createAsyncThunk(
  'pbos/fetchPboSaturation',
  async (pboId: string, { rejectWithValue }) => {
    try {
      const response = await fetch(`https://control-api-dev.speedpro.cg/api/v1/pilot/saturation?id=${pboId}`);
      
      const data = await response.json();
      
      if (!response.ok) {
        return rejectWithValue(data.message || 'Erreur lors de la récupération de la saturation');
      }
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Erreur réseau');
    }
  }
);

/**
 * 6. Action pour la Vérification du PBO par son code (GET) - SÉCURISÉE CONTRE LES ERREURS JSON PARSE
 */
export const checkPboByCode = createAsyncThunk(
  'pbos/checkPboByCode',
  async (pboCode: string, { rejectWithValue }) => {
    try {
      const response = await fetch(`https://control-api-dev.speedpro.cg/api/v1/ftth/pbo/check/${pboCode}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      const contentType = response.headers.get("content-type");

      if (!response.ok) {
        let errorMsg = `Erreur ${response.status}`;
        if (contentType && contentType.includes("text/html")) {
          return rejectWithValue(`${errorMsg}: Le serveur a renvoyé une page HTML au lieu de JSON (Code PBO introuvable ou invalide).`);
        }
        const errorData = await response.json();
        return rejectWithValue(errorData.message || errorMsg);
      }

      if (contentType && contentType.includes("application/json")) {
        return await response.json();
      } else {
        return rejectWithValue("Le serveur a répondu avec succès mais le format renvoyé n'est pas du JSON.");
      }
    } catch (error: any) {
      return rejectWithValue(error.message || 'Erreur de connexion réseau');
    }
  }
);

/**
 * 7. Action pour récupérer TOUS les PBOs 
 */
export const fetchPboList = createAsyncThunk(
  'pbos/fetchPboList',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('https://control-api1.speedpro.cg/api/v1/ftth/pbo/pbo-get', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      
      if (!response.ok) {
        return rejectWithValue('Erreur lors de la récupération de la liste des PBOs');
      }
      return await response.json();
    } catch (error: any) {
      return rejectWithValue(error.message || 'Erreur réseau');
    }
  }
);

/**
 * 8. Slice pour la gestion de l'état des PBO
 */
const pboSlice = createSlice({
  name: 'pbos',
  initialState: {
    list: [] as any[], 
    loading: false,
    error: null as string | null,
    
    // États pour la vérification du client
    clientInfo: null as any,
    loadingCheckClient: false,
    errorCheckClient: null as string | null,

    // États pour la saturation
    saturationData: null as any,
    loadingSaturation: false,
    errorSaturation: null as string | null,

    // Nouveaux états pour la vérification du PBO par code
    pboInfo: null as any,
    loadingCheckPbo: false,
    errorCheckPbo: null as string | null,
  },
  reducers: {
    clearClientInfo: (state) => {
      state.clientInfo = null;
      state.errorCheckClient = null;
    },
    clearSaturationData: (state) => {
      state.saturationData = null;
      state.errorSaturation = null;
    },
    clearPboInfo: (state) => {
      state.pboInfo = null;
      state.errorCheckPbo = null;
      state.loadingCheckPbo = false;
    }
  },
  extraReducers: (builder) => {
    builder
      // Cas pour UPDATE
      .addCase(updatePboPorts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePboPorts.fulfilled, (state, action) => {
        state.loading = false;
        const updatedData = action.payload.data || action.payload;
        if (state.list && state.list.length > 0) {
          const index = state.list.findIndex((p: any) => 
            (p._id || p.id) === (updatedData._id || updatedData.id)
          );
          if (index !== -1) {
            const freePorts = parseInt(updatedData.pboNumberFreePort || 0);
            const totalPorts = parseInt(state.list[index].pboNumberTotalPort || 16);
            
            state.list[index] = { 
              ...state.list[index], 
              ...updatedData,
              isSaturated: freePorts === 0,
              saturationRate: ((totalPorts - freePorts) / totalPorts) * 100
            };
          }
        }
      })
      .addCase(updatePboPorts.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || action.error.message || "Une erreur est survenue";
      })
      
      // Cas pour ADD (POST)
      .addCase(addPbo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addPbo.fulfilled, (state, action) => {
        state.loading = false;
        const newPbo = action.payload.data || action.payload;
        
        const free = parseInt(newPbo.pboNumberFreePort || 0);
        const total = parseInt(newPbo.pboNumberTotalPort || 16);
        
        const enhancedNewPbo = {
          ...newPbo,
          isSaturated: free === 0,
          saturationRate: ((total - free) / total) * 100
        };

        state.list.unshift(enhancedNewPbo);
      })
      .addCase(addPbo.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || action.error.message || "Impossible d'ajouter le PBO";
      })

      // Cas pour enregistrerPboFull
      .addCase(enregistrerPboFull.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(enregistrerPboFull.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(enregistrerPboFull.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Erreur lors de l'envoi PBO Full";
      })

      // Cas pour checkClientByAbn
      .addCase(checkClientByAbn.pending, (state) => {
        state.loadingCheckClient = true;
        state.errorCheckClient = null;
        state.clientInfo = null;
      })
      .addCase(checkClientByAbn.fulfilled, (state, action) => {
        state.loadingCheckClient = false;
        state.clientInfo = action.payload;
      })
      .addCase(checkClientByAbn.rejected, (state, action) => {
        state.loadingCheckClient = false;
        state.errorCheckClient = (action.payload as string) || "Erreur de vérification";
      })

      // Cas pour fetchPboSaturation
      .addCase(fetchPboSaturation.pending, (state) => {
        state.loadingSaturation = true;
        state.errorSaturation = null;
        state.saturationData = null;
      })
      .addCase(fetchPboSaturation.fulfilled, (state, action) => {
        state.loadingSaturation = false;
        state.saturationData = action.payload;
      })
      .addCase(fetchPboSaturation.rejected, (state, action) => {
        state.loadingSaturation = false;
        state.errorSaturation = (action.payload as string) || "Erreur lors de la récupération de la saturation";
      })
      
      // Cas pour fetchPboList
      .addCase(fetchPboList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPboList.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchPboList.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Impossible de charger la liste";
      })

      // Cas pour checkPboByCode
      .addCase(checkPboByCode.pending, (state) => {
        state.loadingCheckPbo = true;
        state.errorCheckPbo = null;
        state.pboInfo = null;
      })
      .addCase(checkPboByCode.fulfilled, (state, action) => {
        state.loadingCheckPbo = false;
        state.pboInfo = action.payload;
      })
      .addCase(checkPboByCode.rejected, (state, action) => {
        state.loadingCheckPbo = false;
        state.errorCheckPbo = (action.payload as string) || "Ce PBO n'existe pas ou est invalide.";
      });
  },
});

export const { clearClientInfo, clearSaturationData, clearPboInfo } = pboSlice.actions;
export default pboSlice.reducer;