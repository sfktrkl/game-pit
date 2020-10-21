<template>
  <div class="home">
    <h1>{{ message }}</h1>
  </div>
</template>

<script>
export default {
  data () {
    return {
      message: 'Hello World'
    }
  }
}
</script>

<style scoped>
.home {
  margin: 10px;
}
</style>
