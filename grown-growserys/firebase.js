// firebaseConfig.ts
import { initializeApp } from "firebase/app";
import { getAuth , initializeAuth,  getReactNativePersistence } from "firebase/auth";

import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
  apiKey: "AIzaSyDqn8Opi7YT3VckiZSITgcZZsKm2om64BA",
  authDomain: "grown-groceries.firebaseapp.com",
  projectId: "grown-groceries",
  storageBucket: "grown-groceries.firebasestorage.app",
  messagingSenderId: "199905905793",
  appId: "1:199905905793:web:f6572ca1336bc1e0ced180",
  measurementId: "G-401KQMVW7X"
};

const app = initializeApp(firebaseConfig);


export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});

export const db = getFirestore(app);
export const storage = getStorage(app);

