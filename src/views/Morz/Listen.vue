<template>
  <div id="body">

    <h3>Listen Morse Code</h3>
    <div id="info">
      <div>Sample audio options</div>
      <div id="options">
        Sentences: <input class="input white-border" type="number" min="1" max="20" v-model="sentences" required>
        <input type="checkbox" v-model="punctuations"> Punctuations
      </div>
      <div style="font-size: 1.2rem;"><input type="checkbox" v-model="enable_hints">Hints</div>
      <button class="play" @click="play_sample">Play</button>
    </div>

    <textarea placeholder="Write what you listen. Press {Enter} or Play button to start." ref="area" @keypress="update($event)"></textarea>

    <div id="text">
      <div id="sample">
        <span v-for="item in output" :key="item">
          <span :style="{color: item.color}">{{item.char}}</span>
        </span>
      </div>

      <div>
        <div id="hint" v-for="(key, value) in hints" :key="key">
          {{key}}<br>
          {{value.toUpperCase()}}<br>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import axios from 'axios'

export default {
  props: {
    code: { type: Object }
  },
  data() {
    return {
      // Sample audio options
      punctuations: false,
      enable_hints: true,
      sentences: 2,

      // To show text with colors according
      // to true or false inputs(also for hints)
      sample: "",
      text: [],
      output: [],
      hints: {},
    };
  },
  methods: {
    update: async function (event) {
      // If enter is pressed start playing sample.
      if (event.key == "Enter")
      {
        await this.play_sample();
        return;
      }

      // Check whether last input character matches with the
      // text's character. After showing the output play the
      // next character.
      var current_char = this.text[0];
      if (current_char) 
      {
        if (event.key.toLowerCase() == current_char.toLowerCase())
        {
          this.output.push({ color: "lime", char: current_char });
          if (this.enable_hints) delete this.hints[current_char];
        }
        else
        {
          this.output.push({ color: "red", char: current_char });
          if (current_char != " " && this.enable_hints)
            this.hints[current_char] = this.code[current_char.toLowerCase()];
        }
        this.text = this.text.substring(1);
        this.$emit('on-play', this.text[0].toLowerCase());
      }
    },
    play_sample: async function () {
      // Clear everything
      this.text = "";
      this.output.length = 0;
      this.hints = {};

      // Get a sample text from an API
      var url = 'https://baconipsum.com/api/?type=meat-and-filler&format=text';
      url += '&sentences=' + this.sentences;
      await axios.get(url).then((data) => { this.sample = data.data; });

      if (!this.punctuations)
      {
        for (let char of this.sample)
        {
          // Except the punctiations, get all
          // characters including spaces, to 
          // replace text with the one without 
          // punctuations.
          if (char.match(/[a-zA-Z0-9 ]/))
            this.text += char;
        }
      }
      else
        this.text = this.sample;

      this.$emit('on-play', this.text[0].toLowerCase());

      // Clear and focus the textarea, so user can directly start writing.
      this.$refs["area"].value = "";
      this.$refs["area"].focus();
    }
  },
  mounted() {
    // Focus the textarea, so user can directly start writing.
    this.$refs["area"].focus();
  }
}
</script>

<style src='./form.css'></style>
<style scoped>
.play {
  margin-top: 10px;
}
textarea {
  font-family: "Arial Black", Gadget, sans-serif;
  border: 2px solid black;
  text-align: center;
  min-height: 200px;
  margin: 20px 0px;
  width: 70%;
}
#sample {
  margin-bottom: 20px;
}
</style>