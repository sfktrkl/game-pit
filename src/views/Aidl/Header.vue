<template>
  <nav>
    <ul>
      <template v-if="user.loggedIn">
        <li><router-link to="/Aidl/adventure" exact>Adventure</router-link></li>
        <li><router-link to="/Aidl/char" exact>Character</router-link></li>
        <li><router-link to="/Aidl/shop" exact>Shop</router-link></li>
        <li><a href="" @click.prevent="sign_out">Sign out</a></li>
      </template>
      <template v-else>
        <li><router-link to="/Aidl/login" exact>Login</router-link></li>
        <li><router-link to="/Aidl/register" exact>Register</router-link></li>
      </template>
    </ul>
  </nav>
</template>

<script>
import * as fb from '@/firebase'
import mixin from './mixin'

export default {
  data() {
    return {
      form: {
        email: "",
        password: ""
      },
      error: null
    };
  },
  methods: {
    sign_out() {
      fb.auth.signOut()
        // After sign out, send aidl state to database(like save and exit).
        .then(() => { fb.db.ref(this.user.uid).set(this.aidl)
        // Reset the state, since there should be no information about game, after logging out.
        .then(() => { this.$store.commit('reset_aidl', { name: null, aidl: null }) })
        // Redirect to login page, since user just signed out and there is nothing to show.
        .then(() => { this.$router.replace({ name: "Login" }) }) });
    }
  },
  mixins: [
    mixin
  ]
};
</script>

<style scoped>
ul {
  text-align: center;
  margin: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #fff;
  text-decoration: none;
  border-radius: 10px;
  padding: 6px;
}
nav {
  background: blue;
  padding: 16px 0;
}
.router-link-active{
  background: #eee;
  color: black;
}
</style>