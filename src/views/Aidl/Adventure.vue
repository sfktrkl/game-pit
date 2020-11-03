<template>
  <div id="adventure">
      Adventure
      <div id="info">
        Adventure Level 1
        <button @click="gainExperience()">Go to Adventure</button>
      </div>
  </div>
</template>

<script>
export default {
  methods: {
    gainExperience: function () {
      this.$store.commit('gainExperience', 10);
    }
  }
}
</script>

<style scoped>
#adventure {
  margin: 10px;
  text-align: center;
  font-family: "Arial Black", Gadget, sans-serif;
}
#info {
  margin: 10px;
  text-align: center;
}
#info button {
  background-color: blue;
  color: white;
  border: none;
  padding: 16px 32px;
  font-size: 16px;
  transition: 0.3s;
  opacity: 0.75;
  cursor: pointer;
  display: block;
  margin: auto;
}
#info button:hover {
  opacity: 1;
}
</style>