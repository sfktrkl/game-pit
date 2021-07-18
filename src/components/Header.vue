<template>
  <nav>
    <input type="checkbox" id="menucheckbox"> 
    <label for="menucheckbox" class="menubutton">
      <i class="fas fa-bars"></i>
    </label>
    <a class="logo" href="/">Game-Pit</a>
    <ul>
      <li><router-link to="/Zneyk" exact>Zneyk</router-link></li>
      <li><router-link to="/Zhips" exact>Zhips</router-link></li>
      <li><router-link to="/Aidl" exact>Aidl</router-link></li>
      <li><router-link to="/Morz" exact>Morz</router-link></li>
      <li><router-link to="/Pass" exact>Pass</router-link></li>
      <li><router-link to="/Chat" exact>Chat</router-link></li>
      <li><router-link to="/Poztman" exact>Poztman</router-link></li>
      <li><router-link to="/Vizion" exact>Vizion</router-link></li>
    </ul>
  </nav>
</template>

<style scoped>
* {
  text-decoration: none;
  padding: 0;
  margin: 0;
}
nav {
  background: #008000;
  height: 60px;
}
.logo {
  color: #000B80;
  font-size: 32px;
  line-height: 60px;
  padding: 0 120px;
  font-weight: bold;
}
nav ul {
  float: right;
  margin-right: 120px;
}
nav ul li {
  display: inline-block;
  line-height: 60px;
  margin: 0 8px;
}
nav ul li a {
  color: #000B80;
  font-size: 17px;
  padding: 6px 12px;
  border-radius: 8px;
  font-weight: bold;
}
nav ul li a:hover {
  background: #4FC2CC;
  color: white;
  transition: .5s;
}
.router-link-active {
  background: #4FC2CC;
}
.menubutton {
  display: none;
  font-size: 26px;
  color: #000B80;
  float: right;
  line-height: 60px;
  margin-right: 40px;
  cursor: pointer;
}
#menucheckbox {
  display: none;
}
@media (max-width: 980px){
  .logo {
    padding-left: 40px;
  }
  .menubutton {
    display: block;
  }
  nav ul {
    position: fixed;
    z-index: 2;
    width: 20%;
    right: -100%;
    margin: 0;
    background: green;
    text-align: center;
    transition: .5s;
  }
  nav ul li {
    display: block;
    margin: 30px 0;
    line-height: 30px;
  }
  nav ul li a {
    font-size: 20px;
  }
  nav ul li a:hover {
    background: none;
    color: white;
    transition: .5s;
  }
  .router-link-active {
    background: none;
    color: #4FC2CC;
  }
  #menucheckbox:checked ~ ul {
    right: 0;
  }
}
</style>
