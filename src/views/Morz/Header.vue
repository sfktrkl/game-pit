<template>
  <nav>
    <ul>
      <li><router-link to="/Morz/morse" exact>Morse Code</router-link></li>
      <li><router-link to="/Morz/learn" exact>Learn</router-link></li>
      <li><router-link to="/Morz/write" exact>Write</router-link></li>
      <li><router-link to="/Morz/listen" exact>Listen</router-link></li>
    </ul>
  </nav>
</template>

<script>
export default {

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