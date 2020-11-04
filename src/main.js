import { createApp } from 'vue'
import App from './App.vue'
import Router from './router'
import Store from './store'
import { auth } from './firebase'

// Fetch user when authentication state is changed
// (to be able to get the state of login and user id info.)
auth.onAuthStateChanged(user => {
  Store.dispatch("fetch_user", user);
});

createApp(App).use(Router).use(Store).mount('#app')
