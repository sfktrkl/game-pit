<template>
  <div id="zombiez">
    <div id="name">Zombiez</div>

    <span>
      <textarea id="input" placeholder="Input" v-model="input"></textarea>
      <textarea id="output" placeholder="Output" v-model="output" disabled="true"></textarea>
    </span>

    <span>
      <button @click="get">Get</button>
    </span>

  </div>
</template>

<script>
import * as rust from "./zombiez/pkg";

export default {
  data() {
    return {
      input: "Grasshopper,Terrestrial plants\nHarvest mouse,Grasshopper,Terrestrial plants\nHawk,Harvest mouse,Rat,Shrew,Vole\nHeron,Shrimp,Smelt\nMallard,Grasshopper,Terrestrial plants,Shrimp\nOwl,Rat,Sparrow,Mallard,Sandpiper\nRat,Grasshopper,Terrestrial plants,Sparrow\nSandpiper,Shrimp\nShrew,Grasshopper\nShrimp,Aquatic plants\nSmelt,Aquatic plants,Shrimp\nSparrow,Grasshopper,Terrestrial plants\nVole,Terrestrial plants,Grasshopper\n",
      output: "",
    };
  },
  methods: {
    async get() {
        this.output = rust.get(this.input);
    }
  },
};
</script>

<style scoped>
#zombiez {
  margin: auto;
  width: 50%;
}
#name {
  text-align: center;
  font-size: 50px;
}
span {
  display: block;
  line-height: 2rem;
}
textarea {
  resize: none;
  width: 100%;
}
#input {
  min-height: 60px;
  height: calc(30vh - 100px);
}
#output {
  min-height: 100px;
  height: calc(60vh - 100px);
}
button {
  background-color: blue;
  color: white;
  border: none;
  padding: 16px 32px;
  font-size: 16px;
  transition: 0.3s;
  opacity: 0.75;
  cursor: pointer;
  display: block;
  margin: 12px auto;
}

</style>
