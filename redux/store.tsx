import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { 
  persistStore, 
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';

//  reducers
import chatReducer from './slices/chatslices';
import authReducer from './slices/authslices'; 
import clientReducer from './slices/clientslices';
import pboReducer from './slices/pboslices';

// 1. Configuration de la persistance
const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['auth', 'pbos'] 
};

// 2. combine tous les reducers
const rootReducer = combineReducers({
  auth: authReducer,
  chats: chatReducer,
  clients: clientReducer,
  pbos: pboReducer,
});

// 3.  crée le reducer persistant
const persistedReducer = persistReducer(persistConfig, rootReducer);

// 4. Configuration du Store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

// 5.  exporte le persistor (utilisé dans App.tsx)
export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;