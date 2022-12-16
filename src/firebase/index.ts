// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
  ApplicationVerifier,
  Auth,
  getAuth,
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAgLrLE5qN9yLHeNXYiBrtZgsiyCWaa0EU",
  authDomain: "ljnm-app.firebaseapp.com",
  projectId: "ljnm-app",
  storageBucket: "ljnm-app.appspot.com",
  messagingSenderId: "560867999210",
  appId: "1:560867999210:web:457dd3ac62beb323fe4693",
  measurementId: "G-C1ZTZ5XWCE",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const getFirebaseFirestoreDB = async () => getFirestore(app);
export const storage = getStorage(app);
export const firebaseAuth: Auth = getAuth(app);

export const getInvisibleRecaptchaVerifier = () => {
  // console.info('RecaptchaVerifier: ')
  const invisibleRecaptchaVerifier: ApplicationVerifier = new RecaptchaVerifier(
    "sign-in-button",
    {
      size: "invisible",
    },
    firebaseAuth
  );
  return invisibleRecaptchaVerifier;
};

export const getSignInWithPhoneNumber = (
  phoneNumber: string,
  appVerifier: ApplicationVerifier
) => {
  return signInWithPhoneNumber(firebaseAuth, phoneNumber, appVerifier);
};
