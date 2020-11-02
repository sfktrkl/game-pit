<template>
  <nav>
    <ul>
      <li><router-link to="/Aidl/adventure" exact>Adventure</router-link></li>
      <li><router-link to="/Aidl/char" exact>Character</router-link></li>
      <li><router-link to="/Aidl/shop" exact>Shop</router-link></li>
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
  background: blue;
  padding: 16px 0;
}
.router-link-active{
  background: #eee;
  color: black;
}
</style>