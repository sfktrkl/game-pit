<template>
  <div>
    <aidl-header></aidl-header>

    <template v-if="user.loggedIn">
      <div id="info">
          <div id="name">Name
            <div>{{aidl.name}}</div>
          </div>

          <div id="level">Level
            <div>{{aidl.level}}</div>
          </div>

          <div id="experience">Experience
            <div id="bar">
              <div id="bar-text">{{aidl.experience[0]}}/{{aidl.experience[1]}}</div>
              <div id="bar-fill" :style="{background: 'cyan', width: aidl.experience[0] / aidl.experience[1] * 100 + '%'}"></div>
            </div>
          </div>

          <div id="health">Health
            <div id="bar">
              <div id="bar-text">{{aidl.health[0]}}/{{aidl.health[1]}}</div>
              <div id="bar-fill" :style="{background: 'red', width: aidl.health[0] / aidl.health[1] * 100 + '%'}"></div>
            </div>
          </div>

          <div id="stamina">Stamina
            <div id="bar">
              <div id="bar-text">{{aidl.stamina[0]}}/{{aidl.stamina[1]}}</div>
              <div id="bar-fill" :style="{background: 'yellow', width: aidl.stamina[0] / aidl.stamina[1] * 100 + '%'}"></div>
            </div>
          </div>
      </div>
    </template>

    <router-view></router-view>
  </div>
</template>

<script>
import Header from './Header.vue';

export default {
  components: {
    'aidl-header': Header
  },
  computed: {
    aidl: function () {
      return this.$store.state.aidl;
    },
    user: function () {
      return this.$store.state.user;
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