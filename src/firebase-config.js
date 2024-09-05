import { initializeApp } from 'firebase/app';
import { getAuth } from "firebase/auth";
import {getStorage} from 'firebase/storage'


// TODO: Replace the following with your app's Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyAYlwe_V2oooxM2ZWfgeGDSsCv-xEQAewY",
  authDomain: "weddingwise-daa83.firebaseapp.com",
  projectId: "weddingwise-daa83",
  storageBucket: "weddingwise-daa83.appspot.com",
  messagingSenderId: "114054934594",
  appId: "1:114054934594:web:5a14ceb750614a25577ddb"
};

const app = initializeApp(firebaseConfig);
export const authentication = getAuth(app);
export const storage = getStorage(app)


export const firebaseNotificationConfig = {
  apiKey: "AIzaSyDfp79kmkeFu7T1U7lKIvEea_5dtIzf2HQ",
  authDomain: "apits-32832.firebaseapp.com",
  projectId: "apits-32832",
  storageBucket: "apits-32832.appspot.com",
  messagingSenderId: "580512757743",
  appId: "1:580512757743:web:5583e929c7cf875d72a81a",
  measurementId: "G-GRKCSDWWSE"
};

