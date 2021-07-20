<template>
  <div>
    <vizion-header @onUpdate="childUpdate"></vizion-header>

    <router-view v-slot="{ Component }">
      <component ref="view" :is="Component" :cameraEnabled="cameraEnabled" :filePath="filePath" />
    </router-view>

  </div>
</template>

<script>
import Header from './Header.vue';

export default {
  data() {
    return {
      cameraEnabled: true,
      filePath: ""
    };
  },
  components: {
    'vizion-header': Header
  },
  methods: {
    childUpdate: function(data) {
      this.cameraEnabled = data.cameraEnabled;
      this.filePath = data.filePath;
      this.$refs.view.updateView(this.cameraEnabled, this.filePath);
    }
  }
}
</script>