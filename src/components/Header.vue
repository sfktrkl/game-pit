<template>
  <nav>
    <ul>
      <li><router-link to="/" exact>Home</router-link></li>
      <li><router-link to="/Zneyk" exact>Zneyk</router-link></li>
      <li><router-link to="/Zhips" exact>Zhips</router-link></li>
      <li><router-link to="/Aidl" exact>Aidl</router-link></li>
      <li><router-link to="/Morz" exact>Morz</router-link></li>
      <li><router-link to="/Pass" exact>Pass</router-link></li>
      </ul>
  </nav>
</template>

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
  background: green;
  padding: 16px 0;
}
.router-link-active{
  background: #eee;
  color: black;
}
</style>
