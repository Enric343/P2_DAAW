
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue, set } from 'firebase/database';

const firebaseConfig = {
    apiKey: "AIzaSyDqh5sAqEF2RO8nZh7F3NTF6CYZoXLli8k",
    authDomain: "snake-game-887a0.firebaseapp.com",
    projectId: "snake-game-887a0",
    storageBucket: "snake-game-887a0.firebasestorage.app",
    messagingSenderId: "548285459676",
    databaseURL: "https://snake-game-887a0-default-rtdb.europe-west1.firebasedatabase.app",
    appId: "1:548285459676:web:8607f7fad4fa1766af9819"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export { db, ref, onValue, set };
