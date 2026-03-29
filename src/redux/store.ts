import { configureStore } from "@reduxjs/toolkit";
import { 
  persistStore, 
  persistReducer, 
  FLUSH, 
  REHYDRATE, 
  PAUSE, 
  PERSIST, 
  PURGE, 
  REGISTER,
  createTransform 
} from "redux-persist";
import storage from "redux-persist/lib/storage";
import authReducer from "./features/auth/authSlice";
import { baseAPI } from "./api/baseApi";

// 🟢 CREATE TRANSFORM: Fix null serialization
const nullTransform = createTransform(
  // Transform state coming from redux before being persisted
  (inboundState: any) => {
    return inboundState;
  },
  // Transform state being rehydrated
  (outboundState: any) => {
    // Convert string "null" back to actual null
    const fixed = { ...outboundState };
    
    Object.keys(fixed).forEach(key => {
      if (fixed[key] === "null" || fixed[key] === null) {
        fixed[key] = null;
      }
    });
    
    console.log('🔄 Rehydrating auth state:', fixed);
    return fixed;
  },
  { whitelist: ['auth'] }
);

const persistConfig = { 
  key: "auth", 
  storage,
  transforms: [nullTransform],
  whitelist: ['token', 'refreshToken', 'user'],
};

const persistedAuthReducer = persistReducer(persistConfig, authReducer);

export const store = configureStore({
  reducer: {
    auth: persistedAuthReducer,
    [baseAPI.reducerPath]: baseAPI.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(baseAPI.middleware),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;