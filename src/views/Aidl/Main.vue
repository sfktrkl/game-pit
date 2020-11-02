<template>
  <div>
    <aidl-header></aidl-header>

    <div id="info">
        <div id="name">Name
          <div>{{name}}</div>
        </div>

        <div id="level">Level
          <div>{{level}}</div>
        </div>

        <div id="experience">Experience
          <div id="bar">
            <div id="bar-text">{{experience}}/{{maxExperience}}</div>
            <div id="bar-fill" :style="{background: 'cyan', width: experience + '%'}"></div>
          </div>
        </div>

        <div id="health">Health
          <div id="bar">
            <div id="bar-text">{{health}}/{{maxHealth}}</div>
            <div id="bar-fill" :style="{background: 'red', width: health + '%'}"></div>
          </div>
        </div>

        <div id="stamina">Stamina
          <div id="bar">
            <div id="bar-text">{{stamina}}/{{maxStamina}}</div>
            <div id="bar-fill" :style="{background: 'yellow', width: stamina + '%'}"></div>
          </div>
        </div>
    </div>

    <router-view></router-view>
  </div>
</template>

<script>
import Header from './Header.vue';

export default {
  components: {
    'aidl-header': Header
  },
  data () {
    return {
      // Character name
      name: 'Noob',

      // Level and stats
      level: 1,
      maxExperience: 100,
      experience: 0,
      maxHealth: 100,
      health: 100,
      maxStamina: 100,
      stamina: 100
    }
  }
}
</script>

<style scoped>
#info {
  padding: 10px;
  background: gray;
  text-align: center;
  font-family: "Arial Black", Gadget, sans-serif;
}
#name, #level, #experience, #health, #stamina {
  width: 200px;
  display: inline-block;
  margin: 0px 12px;
}
#name {
  width: 150px;
}
#level {
  width: 100px;
}
#bar {
  width: 200px;
  height: 20px;
  border: 2px solid #000;
  position: relative;
}
#bar-text {
  width: 100%;
  height: 100%;
  position: relative;
  z-index: 1;
}
#bar-fill {
  height: 100%;
  position: absolute;
  top: 0;
}
</style>