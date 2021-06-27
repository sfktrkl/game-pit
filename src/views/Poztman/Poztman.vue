<template>
  <div id="poztman">

    <div id="name">Poztman</div>

    <div class="container">

      <div class="list">
      </div>

      <div class="request">
      </div>

      <div class="response">
      </div>

    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
    }
  },
  methods: {
  }
}
</script>

<style scoped>
#name {
  text-align: center;
  line-height: 60px;
  font-size: 50px;
}
.container {
  display: grid;
  grid-template-columns: 1fr 8fr;
  grid-template-rows: 1fr 8fr;
  grid-template-areas:
    "list request"
    "list response";
  /* header is 60px, #name is also 60px */
  height: calc(100vh - 60px - 60px);
}
.list {
  background: red;
  grid-area: list;
}
.request {
  background: blue;
  grid-area: request;
}
.response {
  background: cyan;
  grid-area: response;
}
</style>
