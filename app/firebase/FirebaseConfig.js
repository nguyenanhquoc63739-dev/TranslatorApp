import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBpThA4yz3nYl3dgsZbEOC-wCwHgPW9jOk",
  authDomain: "translator-app-c9c86.firebaseapp.com",
  projectId: "translator-app-c9c86",
  storageBucket: "translator-app-c9c86.firebasestorage.app",
  messagingSenderId: "577396776805",
  appId: "1:577396776805:web:54ca22a3ada0d117b80b8c",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
