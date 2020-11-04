<template>
  <div id="register">
    <div id="error" v-if="error">{{error}}</div>
    <form @submit.prevent="submit">
        <label for="name">Name</label>
        <div id="input"><input type="name" v-model="form.name" required /></div>

        <label for="email">Email</label>
        <div id="input"><input type="email" v-model="form.email" required /></div>

        <label for="password">Password</label>
        <div id="input"><input type="password" v-model="form.password" required /></div>

        <div id="submit"><button type="submit">Register</button></div>
    </form>
  </div>
</template>

<script>
import { firebase } from '@firebase/app';

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
      firebase.auth()
        .createUserWithEmailAndPassword(this.form.email, this.form.password)
        .then(data => { data.user.updateProfile({ displayName: this.form.name })
        .then(() => { this.$store.commit('set_name', this.form.name) })
        .then(() => { this.$router.replace({ name: "Adventure" }); }) })
        .catch(err => { this.error = err.message; });
    }
  }
}
</script>

<style src='./form.css'></style>