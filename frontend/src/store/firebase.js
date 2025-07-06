// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getFirestore} from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDy7aXplIM65OWT_LHhFHtcOKUiaHsRIes",
  authDomain: "arcc-759fb.firebaseapp.com",
  projectId: "arcc-759fb",
  storageBucket: "arcc-759fb.firebasestorage.app",
  messagingSenderId: "595983790687",
  appId: "1:595983790687:web:36f90e41a51ee78ebee1ea",
  measurementId: "G-XDVJVLE15Q"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db=getFirestore(app)
// const analytics = getAnalytics(app);