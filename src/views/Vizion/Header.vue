<template>
  <nav>
    <ul>
      <li><router-link to="/Vizion/hand" exact>Hand Tracking</router-link></li>
      <li><router-link to="/Vizion/pose" exact>Pose Estimation</router-link></li>
      <li><router-link to="/Vizion/face" exact>Face Detection</router-link></li>
      <li><router-link to="/Vizion/mesh" exact>Face Mesh</router-link></li>
      <li><router-link to="/Vizion/holistic" exact>Holistic</router-link></li>
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
  margin: 8px 10px;
}
a {
  color: #fff;
  text-decoration: none;
  border-radius: 10px;
  padding: 6px;
}
nav {
  background: blue;
  padding: 8px;
}
.router-link-active{
  background: #eee;
  color: black;
}
</style>