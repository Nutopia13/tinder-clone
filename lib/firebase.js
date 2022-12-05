import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBArLP6exkVzAbG7qhFzoVgX2U1e0ypC6A",
  authDomain: "tinder-clone-aebe3.firebaseapp.com",
  projectId: "tinder-clone-aebe3",
  storageBucket: "tinder-clone-aebe3.appspot.com",
  messagingSenderId: "989442885943",
  appId: "1:989442885943:web:b0c84397b858c01ebdf2b2",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore();


export { auth, db };

// Path: lib\firebase.js
