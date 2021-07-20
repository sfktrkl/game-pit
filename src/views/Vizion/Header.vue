<template>
  <div class="container">

    <div class="app">
      <router-link to="/Vizion/vizion" exact>Vizion</router-link>
    </div>

    <div class="tutorials">
      <nav>
        <ul>
          <li><router-link to="/Vizion/hand" exact>Hand Tracking</router-link></li>
          <li><router-link to="/Vizion/pose" exact>Pose Estimation</router-link></li>
          <li><router-link to="/Vizion/face" exact>Face Detection</router-link></li>
          <li><router-link to="/Vizion/mesh" exact>Face Mesh</router-link></li>
          <li><router-link to="/Vizion/holistic" exact>Holistic</router-link></li>
        </ul>
      </nav>
    </div>

    <div class="settings">
      <div>
        <input type="checkbox" id="camera" v-model="cameraEnabled">
        <label for="camera">Use Camera</label>
      </div>

      <input type="file" id="file" accept=".mp4" @change="processFile($event)"/>
      <label id="fileLabel" for="file">{{ fileName }}</label>

      <button id="button" @click="update">Update View</button>
    </div>

  </div>
</template>

<script>
export default {
  emits: [
    'on-update'
  ],
  data() {
    return {
      fileName: "Choose a file",
      cameraEnabled: true,
      filePath: ""
    };
  },
  methods: {
    processFile: function(event) {
      this.cameraEnabled = false;

      let files = event.target.files;
      let file = files[0];
      this.fileName = file.name;

      let URL = window.URL || window.webkitURL;
      let src = URL.createObjectURL( file );
      this.filePath = src;

      this.update();
    },
    update: function() {
      this.$emit('on-update', { cameraEnabled: this.cameraEnabled, filePath: this.filePath });
    }
  }
};
</script>

<style scoped>
.container {
  display: grid;
  color: #fff;
  background: blue;
  grid-auto-columns: 1fr;
  grid-template-columns: 2fr 6.7fr 3fr;
  grid-template-rows: 1fr;
  gap: 0px 0px;
  grid-template-areas:
    "app tutorials settings";
}

.app {
  font-size: 20px;
  grid-area: app;
  margin: auto;
}

.tutorials {
  grid-area: tutorials;
}
ul {
  text-align: center;
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
  padding: 8px;
}
.router-link-active{
  background: #eee;
  color: black;
}

.settings {
  grid-area: settings;
  text-align: center;
  display: block;
  margin: auto;
}
#file {
  height: 0;
  width: 0;
  opacity: 0;
  overflow: hidden;
  position: absolute;
  z-index: -1;
}
#button, #file + #fileLabel {
  font-family: 'Courier New', Courier, monospace;
  background-color: white;
  padding: 8px 12px;
  transition: 0.3s;
  cursor: pointer;
  font-size: 12px;
  color: black;
  opacity: 0.85;
  border: none;
  margin: 5px;
}
#file + #fileLabel:hover, #button:hover {
  opacity: 1;
}
</style>