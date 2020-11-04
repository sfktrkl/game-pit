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
import firebase from "firebase";

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
  computed: {
    user: function () {
      return this.$store.state.user;
    }
  },
  methods: {
    sign_out() {
      firebase.auth().signOut().then(() => { this.$router.replace({ name: "Login" }); });
    }
  }
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