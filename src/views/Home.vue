<template>
  <div class="home">
    <div id="name">Applications</div>
    <div class="parent">

      <router-link class="link" to="/Zneyk" exact>
        <div class="application">
          <div class="title">Zneyk</div>
          <img class="image" src="./../../public/assets/home/zneyk.jpg">
          <div class="text">Zneyk is a very simple snake game. Try to eat foods, do not hit any blocks which you placed and make a good score.</div>
        </div>
      </router-link>

      <router-link class="link" to="/Zhips" exact>
        <div class="application">
          <div class="title">Zhips</div>
          <img class="image" src="./../../public/assets/home/zhips.jpg">
          <div class="text">Zhips is a battleship game. Place your ships to tiles and attack to enemy tiles.</div>
        </div>
      </router-link>

      <router-link class="link" to="/Aidl" exact>
        <div class="application">
          <div class="title">Aidl</div>
          <img class="image" src="./../../public/assets/home/aidl.jpg">
          <div class="text">Aidl is an idle rpg game game. Create your character, go to adventures and level up!</div>
          <div class="additional">(Under construction)</div>
        </div>
      </router-link>

      <router-link class="link" to="/Morz" exact>
        <div class="application">
          <div class="title">Morz</div>
          <img class="image" src="./../../public/assets/home/morz.jpg">
          <div class="text">Morz is an application which may help you to learn morse code.</div>
        </div>
      </router-link>

      <router-link class="link" to="/Pass" exact>
        <div class="application">
          <div class="title">Pass</div>
          <img class="image" src="./../../public/assets/home/pass.jpg">
          <div class="text">Pass is a password generator which you can create your own unique password and send encrypted version of your password to your e-mail.</div>
        </div>
      </router-link>

      <router-link class="link" to="/Chat" exact>
        <div class="application">
          <div class="title">Chat</div>
          <img class="image" src="./../../public/assets/home/chat.jpg">
          <div class="text">Chat application which you can join to a room and chat with your friends.</div>
        </div>
      </router-link>

      <router-link class="link" to="/Poztman" exact>
        <div class="application">
          <div class="title">Poztman</div>
          <img class="image" src="./../../public/assets/home/poztman.jpg">
          <div class="text">A postman clone which uses its own api. Try the requests and add your words to the api.</div>
        </div>
      </router-link>

      <router-link class="link" to="/Vizion" exact>
        <div class="application">
          <div class="title">Vizion</div>
          <img class="image" src="./../../public/assets/home/vizion.jpg">
          <div class="text">Vizion is an application which contains pose estimation, hand tracking, face detection and face meshing solutions using MediaPipe.</div>
        </div>
      </router-link>

    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
    }
  }
}
</script>

<style scoped>
#name {
  text-align: center;
  font-size: 50px;
}

.parent {
  display: grid;
  margin-top: 4px;
  margin-right: 3em;
  margin-left: 3em;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: repeat(2, 1fr);
  grid-column-gap: 2em;
  grid-row-gap: 2em;
}

.application {
  min-height: 360px;
  padding-top: 4px;
  padding-left: 2em;
  padding-right: 2em;
  border-radius: 1em;
  transition: .5s;
  text-align: center;
  color: #ffffff;
}
.application:hover {
  border-radius: 3em;
}

.link {
  text-decoration: none;
}

.title {
  display: block;
  line-height: 1;
  padding-bottom: 8px;
  margin-bottom: 4px;
  margin-top: 4px;
  font-size: 40px;
}

.image {
  min-height: 200px;
  max-width: 100%;
  height: auto;
}

.text {
  font-family: 'Noto Sans JP', sans-serif;
  font-weight: 500;
  line-height: 1.6;
  margin-top: 4px;
}

.additional {
  line-height: 1.6;
  font-size: 14px;
}
</style>
