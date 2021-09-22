import firebase from "firebase/compat/app";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_VERCEL_API_KEY,
  authDomain: import.meta.env.VITE_VERCEL_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_VERCEL_PROJECT_ID,
  storageBucket: import.meta.env.VITE_VERCEL_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_VERCEL_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_APP_ID,
  databaseURL: import.meta.env.VITE_VERCEL_DATABASEURL,
};

firebase.initializeApp(firebaseConfig);

export default firebase;
