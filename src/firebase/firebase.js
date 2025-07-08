// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import {getFirestore} from 'firebase/firestore'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDRBnM5euzNCYGUnyooe0EH__H2ETHyX60",
  authDomain: "shopmate-auth.firebaseapp.com",
  projectId: "shopmate-auth",
  storageBucket: "shopmate-auth.firebasestorage.app",
  messagingSenderId: "870335351654",
  appId: "1:870335351654:web:b878cb765f1612590696a7",
  measurementId: "G-0J7H8XL5CV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const auth = getAuth(app)
export const db = getFirestore(app)