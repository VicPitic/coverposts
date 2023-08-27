import { initializeApp } from "firebase/app";

import { getAnalytics } from "firebase/analytics";

// TODO: Add SDKs for Firebase products that you want to use

// https://firebase.google.com/docs/web/setup#available-libraries

import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; // Import Firestore
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const firebaseConfig = {

  apiKey: "AIzaSyCnfjkULrNHhPR7gRnIZglyZgf_jA4AutA",

  authDomain: "coverpost-b7d00.firebaseapp.com",

  databaseURL: "https://coverpost-b7d00-default-rtdb.firebaseio.com",

  projectId: "coverpost-b7d00",

  storageBucket: "coverpost-b7d00.appspot.com",

  messagingSenderId: "856715177804",

  appId: "1:856715177804:web:dd0d2cfc98d6bf2a4ee9e9",

  measurementId: "G-Y4YD0WLYCQ"

};

  



// Initialize Firebase

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app); //
export default app;