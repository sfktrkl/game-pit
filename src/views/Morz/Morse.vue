<template>
  <div id="body">

    <h3>Morse Code</h3>
    <div id="code">
      <div id="item" v-for="(items, title) in seperated_code" :key="items">{{title}}<br>
        <div id="item" v-for="(value, index) in items" :key="index">
          <button class="play" @click="play(index)">{{index.toUpperCase()}}</button>
          <div>{{value}}</div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
export default {
  props: {
    code: { type: Object }
  },
  data() {
    return {
        seperated_code:
        {
          Letters: {},
          Numbers: {},
          Punctuations: {}
        }
    };
  },
  methods: {
    play: function (text) {
      this.$emit('on-play', text);
    }
  },
  mounted() {
    // Seperate letters, numbers and punctiations.
    // So, new object can be directly used with v-for.
    for (let item in this.code)
    {
      if (item.match(/[a-z]/))
       this.seperated_code.Letters[item] = this.code[item];
      else if (item.match(/[0-9]/))
       this.seperated_code.Numbers[item] = this.code[item];
      else
       this.seperated_code.Punctuations[item] = this.code[item];
    }
  }
}
</script>

<style src='./form.css'></style>
<style scoped>
#code {
  font-family: 'Courier New', Courier, monospace;
  display: block;
  margin: auto;
}
#item {
  display: inline-block;
  margin: 10px;
}
.play {
  font-size: 1.2rem;
  min-width: 100px;
  height: 60px;
  padding: 0;
}
</style>