import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyBOwxG4GNp3fK0WEU5OV-G2CToCoOGAXDI",
  authDomain: "harvest-monitor.firebaseapp.com",
  databaseURL: "https://harvest-monitor-default-rtdb.firebaseio.com",
  projectId: "harvest-monitor",
  storageBucket: "harvest-monitor.appspot.com",
  messagingSenderId: "683657136277",
  appId: "1:683657136277:web:5ff931b4c80f380495739c",
  measurementId: "G-8S1MG0WY2Y",
};

export const app = initializeApp(firebaseConfig);
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});
export const db = getDatabase();
