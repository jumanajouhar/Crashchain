// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAu8flScBmDzG8q97kibU_7fQw-IXLB5p8",
  authDomain: "crashchain.firebaseapp.com",
  projectId: "crashchain",
  storageBucket: "crashchain.appspot.com",
  messagingSenderId: "402747656561",
  appId: "1:402747656561:web:78bb3c5fa2ef9f20718ed0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };