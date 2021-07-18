<template>
  <div>
    <vizion-header></vizion-header>
    <router-view></router-view>
  </div>
</template>

<script>
import Header from './Header.vue';

export default {
  data() {
    return {

    };
  },
  components: {
    'vizion-header': Header
  },
  methods: {

  }
}
</script>

<style scoped>

</style>