import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC23Ylh0WAuAGQvWtqddmP9wN0eEJqtTMQ",
  authDomain: "glam-n-go-development.firebaseapp.com",
  projectId: "glam-n-go-development",
  storageBucket: "glam-n-go-development.appspot.com",
  messagingSenderId: "808258835068",
  appId: "1:808258835068:web:0f62278da9c999623d2ff9",
  measurementId: "G-107Q5H4HJN",
};

export const app = initializeApp(firebaseConfig);
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});
export const db = getFirestore(app);
