<template>
  <div id="body">

    <h3>Write Morse Code</h3>
    <div id="info">
      <div>Sample text options</div>
      <div id="options">
        Sentences: <input class="input white-border" type="number" min="1" max="20" v-model="sentences" @change="get_sample" required>
        <input type="checkbox" v-model="punctuations" @change="update_punctuations"> Punctuations
        <button class="play" @click="get_sample">Generate</button>
      </div>
      <span style="font-size: 1.2rem;"><input type="checkbox" v-model="disable_code">Hide code</span>
      <span style="font-size: 1.2rem;"><input type="checkbox" v-model="enable_hints">Hints</span>
    </div>

    <div id="text">
      <h3 id="sample">Sample Text</h3>

      <span v-for="item in output" :key="item">
        <span :style="{color: item.color}">{{item.char}}</span>
      </span>
      <span>{{text}}</span>

      <div id="char">{{current_char.toUpperCase()}}</div>
      <span v-if="!disable_code" :text="input" id="morse" @onchange="update_text()">{{input}}</span>

      <!-- Do not prevent mouse events, so textarea can get focus an keys can be pressed -->
      <textarea id="morsearea" @keydown.prevent="down()" @keyup.prevent="up()" @mousedown="down()" @mouseup="up()"
                placeholder="Write here morse code by pressing a key or mouse." ref="area"></textarea><br>

      <div v-if="enable_hints">
        <div id="hint"  v-for="(key, value) in hints" :key="key">
          {{value.toUpperCase()}}<br>
          {{key}}<br>
        </div>
      </div>

    </div>

  </div>
</template>

<script>
import mixin from './mixin';
import axios from 'axios';

export default {
  data() {
    return {
      // Sample text options
      punctuations: false,
      disable_code: false,
      enable_hints: true,
      sentences: 2,

      // Text update mode
      mode: "write",

      // To show text with colors according
      // to true or false inputs(also for hints)
      text: "",
      input: "",
      output: [],
      hints: {},
      current_char: ""
    };
  },
  methods: {
    get_sample: async function () {
      // Get a sample text from an API
      var url = 'https://baconipsum.com/api/?type=meat-and-filler&format=text';
      url += '&sentences=' + this.sentences;
      await axios.get(url).then((data) => { this.sample = data.data; });
      // Update the sample text according to options
      this.update_punctuations();
    },
    update_punctuations: function () {
      if (!this.punctuations)
      {
        var text = "";
        for (let char of this.sample)
        {
          // Except the punctiations, get all
          // characters including spaces, to 
          // replace text with the one without 
          // punctuations.
          if (char.match(/[a-zA-Z0-9 ]/))
            text += char;
        }
        this.update_text(true, text);
      }
      else
        this.update_text(true, this.sample);
      // Since text is updated clear the hints.
      this.hints = {};
    }
  },
  mixins: [
    mixin,
  ],
}
</script>

<style src='./form.css'></style>
<style scoped>
.play {
  padding: 8px 16px;
  display: inline;
}
#sample {
  text-decoration: underline;
  margin: 8px
}
#char {
  margin: 8px 0px 0px 0px;
  font-size: 3rem;
  color: blue;
}
#morse {
  font-family: 'Courier New', Courier, monospace;
  min-height: 54px;
  font-size: 3rem;
  display: block;
}
textarea {
  border: 2px solid black;
  text-align: center;
  font-size: 2.70rem;
  margin: 8px;
  height: 100px;
  width: inherit;
  caret-color: white;
  cursor: crosshair;
}
</style>