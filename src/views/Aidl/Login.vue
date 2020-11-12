<template>
  <div id="login">
    <div id="error" v-if="error">{{error}}</div>
    <form @submit.prevent="submit">
        <label>Email</label>
        <div id="input"><input type="email" v-model="form.email" required /></div>

        <label>Password</label>
        <div id="input"><input type="password" v-model="form.password" required /></div>

        <div id="submit"><button type="submit">Login</button></div>
    </form>
  </div>
</template>

<script>
import * as fb from '@/firebase'

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
      fb.auth.signInWithEmailAndPassword(this.form.email, this.form.password)
        // Once signed in, use user id to fetch data.
        .then(data => { fb.db.ref(data.user.uid).once('value')
        // Reset the game state with data taken from database.
        .then(data => { this.$store.commit('reset_aidl', { name: data.val().name, aidl: data.val() }); }) })
        // Redirect to Adventure page, since game should start.
        .then(() => { this.$router.replace({ name: "Adventure" }) })
        .catch(err => { this.error = err.message; });
    }
  }
};
</script>

<style src='./form.css'></style>