<template>
  <div id="register">
    <div id="error" v-if="error">{{error}}</div>
    <form @submit.prevent="submit">
      <label>Name</label>
      <div id="input"><input type="name" v-model="form.name" required /></div>

      <label>Email</label>
      <div id="input"><input type="email" v-model="form.email" required /></div>

      <label>Password</label>
      <div id="input"><input type="password" v-model="form.password" required /></div>

      <div id="submit"><button type="submit">Register</button></div>
    </form>
  </div>
</template>

<script>
import * as fb from '@/firebase'
import mixin from './mixin'

export default {
  data() {
    return {
      form: {
        name: "",
        email: "",
        password: ""
      },
      error: null
    };
  },
  methods: {
    submit() {
      fb.auth
        .createUserWithEmailAndPassword(this.form.email, this.form.password)
        .then(data => { 
          // After signing up, use user's information to set the game state (default state)
          this.$store.commit('reset_aidl', { name: this.form.name, aidl: null });
          // Also, send this information to database, to create user's first game save basically.
          fb.db.ref(data.user.uid).set(this.aidl);
        })
          // Redirect to Adventure page, so user can start the game.
          .then(() => { this.$router.replace({ name: "Adventure" }); })
          .catch(err => { this.error = err.message; });
    }
  },
  mixins: [
    mixin
  ]
}
</script>

<style src='./form.css'></style>