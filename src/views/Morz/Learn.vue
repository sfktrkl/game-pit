<template>
  <div id="body">

    <h3>Learn Morse Code</h3>
    <div id="info">
      <div id="options">
        <input type="checkbox" v-model="letters" @change="get_sample"> Letters
        <input type="checkbox" v-model="numbers" @change="get_sample"> Numbers
        <input type="checkbox" v-model="punctuations" @change="get_sample"> Punctuations
      </div>
      <button v-if="enable_learn || text == 'Finished!'" class="play" @click="get_sample">Restart</button>
    </div>

    <div id="text">
      <div v-if="enable_learn">Current Letters: 
        <span v-for="(item, key) in current_letters" :key="item">
          <span style="color orange">{{key.toUpperCase() + " "}} </span>
        </span>
      </div>
      <div v-if="enable_learn">Learned Letters: 
        <span v-for="(item, key) in learned_letters" :key="item">
          <span style="color: green">{{key.toUpperCase() + " "}}</span>
        </span>
      </div>

      <h3 id="sample">
        <span v-for="item in output" :key="item">
          <span :style="{color: item.color}">{{item.char}}</span>
        </span>
        <span v-if="text">{{text}}</span>
      </h3>

      <div v-if="enable_learn" id="char">{{current_char.toUpperCase()}}</div>
      <span v-if="enable_learn" :text="input" id="morse" @onchange="update_text()">{{input}}</span>

      <!-- Do not prevent mouse events, so textarea can get focus an keys can be pressed -->
      <textarea id="morsearea" @keydown.prevent="down()" @keyup.prevent="up()" @mousedown="down()" @mouseup="up()"
                v-if="enable_learn" placeholder="Write here morse code by pressing a key or mouse." ref="area"></textarea><br>

      <div id="hint" v-for="(key, value) in hints" :key="key">
        {{value.toUpperCase()}}<br>
        {{key}}<br>
      </div>
    </div>

  </div>
</template>

<script>
import mixin from './mixin';

export default {
  data() {
    return {
      // Sample text options
      letters: true,
      numbers: false,
      punctuations: false,
      enable_learn: false,

      // Text update mode
      mode: "learn",

      // To show text with colors according
      // to true or false inputs(also for hints)
      text: "",
      input: "",
      output: [],
      hints: {},
      current_char: "",

      // Selected letters
      // remove ones which are used
      selection: {},
      // Stores letters which are active
      // When a letter written correctly;
      // Two in a row, hide hints,
      // Ten in a row, remove it(assume learned)
      // Show them as a information
      current_letters: {},
      learned_letters: {},
    };
  },
  methods: {
    update_selection: function () {
      // step: array of letters according to symbol counts
      this.selection = { 1: {}, 2: {}, 3: {}, 4: {}, 5: {}, 6: {} };
      for (var key in this.code)
        this.selection[this.code[key].length][key] = this.code[key];
      this.update_current(true);
    },
    update_current: function (clear = false) {
      if (clear)
        this.current_letters = {};
      // Add a letter until no letter left,
      // Also, for each five letter learned, increase current letters by one
      var no_letter = false;
      while (!no_letter && Object.keys(this.current_letters).length <= 3 + Math.floor(Object.keys(this.learned_letters).length / 5))
        no_letter = this.add_letter();
    },
    add_letter: function () {
      for (var current_step in this.selection)
      {
        var current = this.selection[current_step];
        if (Object.keys(current).length > 0)
        {
          // According to selections, find a proper letter
          var item = this.random_item(current);
          if ((this.letters && item.key.match(/[a-z]/)) ||
              (this.numbers && item.key.match(/[0-9]/)) ||
              (this.punctuations && !item.key.match(/[a-z0-9]/)))
          {
            this.current_letters[item.key] = { code: item.value, row: 0 };
            this.hints[item.key] = item.value;
            delete current[item.key];
            return false;
          }
        }
      }
      return true;
    },
    get_sample: function (clear = true) {
      // If nothing is selected, clear the screen and alert user.
      if (!this.letters && !this.numbers && !this.punctuations)
      {
        this.clear_all();
        this.text = "Select at least one option.";
        return;
      }

      // For first initialization, or when restart pressed,
      // clear everything and create a selected letters
      // object using selections
      if (clear)
      {
        this.clear_all(true);
        this.update_selection();
      }

      // Using selected letters, create a sample word and update the text.
      this.sample = "";
      // Sample text's length is 3 as minimum and increased for each 5 letters learned
      for (var i = 0; i < 3 + Math.floor(Object.keys(this.learned_letters).length / 5); i++) {
        var item = this.random_item(this.current_letters);
        if (i == 0) this.current_char = item.key.toUpperCase();
        this.sample += item.key.toUpperCase();
      }
      this.update_text(true, this.sample);
    },
    clear_all: function (enable = false) {
      this.enable_learn = enable;
      this.current_letters = {};
      this.learned_letters = {};
      this.output.length = 0;
      this.current_char = "";
      this.hints = {};
      this.input = "";
      this.text = "";
    },
    random_item: function (obj) {
      var entries = Object.entries(obj);
      var index = entries.length * Math.random() << 0;
      return { key: entries[index][0], value: entries[index][1] };
    },
  },
  mixins: [
    mixin,
  ]
}
</script>

<style src='./form.css'></style>
<style scoped>
.play {
  margin-top: 10px;
}
#sample {
  font-size: 4rem;
  font-weight: bolder;
  margin: 8px
}
</style>