// Your web app's Firebase configuration

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

import { getFirestore } from "@firebase/firestore";
import { getStorage } from "firebase/storage";
import "firebase/storage";



const firebaseConfig = {
    apiKey: "AIzaSyA1HHmtLYQq0Fc1jWSpG5mSSUDIVFyy30M",
    authDomain: "sidandleo.firebaseapp.com",
    projectId: "sidandleo",
    storageBucket: "sidandleo.appspot.com",
    messagingSenderId: "424338338047",
    appId: "1:424338338047:web:175592b363513cc035dcca",
    measurementId: "G-DE1E9Y7419"
  };

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

export const db = getFirestore(app);
export const storage = getStorage(app);