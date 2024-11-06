// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyA6teJs7cvFo9hRVJgpe1iECgoNa2AxgNA",
    authDomain: "react-chat-59276.firebaseapp.com",
    projectId: "react-chat-59276",
    storageBucket: "react-chat-59276.firebasestorage.app",
    messagingSenderId: "209891683572",
    appId: "1:209891683572:web:ac2c2aef369dc3166b82a1",
    measurementId: "G-HTD98XNV86"
  };

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
