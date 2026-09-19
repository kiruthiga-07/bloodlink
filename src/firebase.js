import { initializeApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"
import { getAuth } from "firebase/auth"

const firebaseConfig = {
  apiKey: "AIzaSyBEk_SsTfJeFQePFR9UBHS08JXZ7nilAzo",
  authDomain: "bloodlink-a21b2.firebaseapp.com",
  projectId: "bloodlink-a21b2",
  storageBucket: "bloodlink-a21b2.firebasestorage.app",
  messagingSenderId: "724016441995",
  appId: "1:724016441995:web:2c05c30042ac2baee6828e"
}

const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)
export const auth = getAuth(app)