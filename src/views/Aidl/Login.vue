<template>
  <div id="login">
    <div id="error" v-if="error">{{error}}</div>
    <form @submit.prevent="submit">
        <label for="email">Email</label>
        <div id="input"><input type="email" v-model="form.email" required /></div>

        <label for="password">Password</label>
        <div id="input"><input type="password" v-model="form.password" required /></div>

        <div id="submit"><button type="submit">Login</button></div>
    </form>
  </div>
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
  methods: {
    submit() {
      firebase.auth().signInWithEmailAndPassword(this.form.email, this.form.password)
        .then(() => { this.$router.replace({ name: "Adventure" }); })
        .catch(err => { this.error = err.message; });
    }
  }
};
</script>

<style src='./form.css'></style>