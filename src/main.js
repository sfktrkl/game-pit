import { createApp } from 'vue'
import App from './App.vue'
import Router from './router'
import Store from './store'

import { firebase } from '@firebase/app'
import '@firebase/auth'
import '@firebase/firestore'
import '@firebase/analytics'

var firebaseConfig = {
  apiKey: "AIzaSyBUsEuGPCGJvbsZh1m2wTm9rReJzNznfTM",
  authDomain: "game-pit.firebaseapp.com",
  databaseURL: "https://game-pit.firebaseio.com",
  projectId: "game-pit",
  storageBucket: "game-pit.appspot.com",
  messagingSenderId: "889086777719",
  appId: "1:889086777719:web:c53aa28c45a1f0b8f52972",
  measurementId: "G-QVWCFV656E"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();

firebase.auth().onAuthStateChanged(user => {
  Store.dispatch("fetch_user", user);
});

createApp(App).use(Router).use(Store).mount('#app')
