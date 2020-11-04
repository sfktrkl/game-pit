import { firebase } from '@firebase/app'
import '@firebase/auth'
import '@firebase/database'
import '@firebase/firestore'

var firebaseConfig = {
  projectId: "game-pit",
  authDomain: "game-pit.firebaseapp.com",
  apiKey: process.env.VUE_APP_FIREBASE_API_KEY,
  databaseURL: process.env.VUE_APP_FIREBASE_DATABASE_URL,
  storageBucket: process.env.VUE_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VUE_APP_FIREBASE_MESSAGE_SENDER_ID,
  appId: process.env.VUE_APP_FIREBASE_APP_ID,
  measurementId: process.env.VUE_APP_FIREBASE_MEASUREMENT_ID
};
const firebaseApp = firebase.initializeApp(firebaseConfig);

// utils
const db = firebaseApp.database();
const auth = firebase.auth();

// export utils/refs
export { db, auth }
