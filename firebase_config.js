// File: firebase_config.js

//Import required Firebase modules
import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from "firebase/storage";

//Import AsyncStorage for caching
import AsyncStorage from '@react-native-async-storage/async-storage';

//Firebase config (Enter your config here for your Firebase account)
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_INFO.firebaseapp.com",
  projectId: "YOUR_INFO",
  storageBucket: "YOUR_INFO.firebasestorage.app",
  messagingSenderId: "YOUR_INFO",
  appId: "YOUR_INFO"
};

//Initialize the Firebase app
const app = initializeApp(firebaseConfig);

//Initialize auth with persistence so users can retain their uid
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

//Get the database and storage references
const db = getFirestore(app);
const storage = getStorage(app);


//Export instances
export { app, auth, db, storage };
