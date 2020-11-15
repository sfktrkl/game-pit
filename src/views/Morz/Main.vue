<template>
  <div>
    <morz-header></morz-header>
    <div id="options">
      <h3>Sound Options</h3>
      <div id="type">Wave Type: 
        <select class="input" v-model="oscilliator_type" @change="update_oscilliator">
          <option value="sine">Sine</option>
          <option value="square">Square</option>
          <option value="sawtooth">Sawtooth</option>
          <option value="triangle">Triangle</option>
        </select>
      </div>

      <div id="frequency">Frequency: 
        <input class="input" type="number" min="300" max="1000" step="20" v-model="oscilliator_frequency" @change="update_oscilliator" required>
      </div>

      <div id="wpm">WPM: 
        <input class="input" type="number" min="10" max="60" v-model="wpm" @change="update_wait_times" required>
      </div>
    </div>

    <router-view :code="code" :context="context" :dot="dot" :dash="dash" :word="word"
      @onConnect="connect_oscilliator" @onDisconnect="disconnect_oscilliator" @onPlay="play"></router-view>
  </div>
</template>

<script>
import Header from './Header.vue';

export default {
  data() {
    return {
      // Audio Context
      context: new AudioContext,
      // Oscilliator options
      oscilliator_type: "sine",
      oscilliator_frequency: 400.0,

      // Morse code speed is determined using word 'PARIS'
      // which contains 50 symbols (50 time units),
      // So, for 1 wpm, 60 seconds / 50 time unit
      wpm: 20,
      dot: 0.06,   // Dot is one time unit, (between symbols)
      dash: 0.18,  // Dash is three time units, (between letters)
      word: 0.42,  // Space between words is seven time units

      // Morse code
      code: {
        // Letters
        "a": '.-', "b": '-...', "c": '-.-.', "d": '-..', "e": '.', "f": '..-.',
        "g": '--.', "h": '....', "i": '..', "j": '.---', "k": '-.-', "l": '.-..',
        "m": '--', "n": '-.', "o": '---', "p": '.--.', "q": '--.-', "r": '.-.',
        "s": '...', "t": '-', "u": '..-', "v": '...-', "w": '.--', "x": '-..-',
        "y": '-.--', "z": '--..',
        // Numbers
        "1": '.----', "2": '..---', "3": '...--', "4": '....-', "5": '.....',
        "6": '-....', "7": '--...', "8": '---..', "9": '----.', "0": '-----',
        // Punctuations
        ".": ".-.-.-", ",":"--..--", ":": "---...", ";": "-.-.-.", "?": "..--..",
        "-": "-....-", "_": "..--.-", "(": "-.--.", ")": "-.--.-", "'": ".----.",
        "=": "-...-", "+": ".-.-.", "/": "-..-.", "@": ".--.-."
      }
    };
  },
  components: {
    'morz-header': Header
  },
  methods: {
    update_wait_times: function () {
      // One word (PARIS) is counted as 50 symbols
      this.dot = this.symbol = 60 / 50 / this.wpm; // Dot is one time unit, (between symbols)
      this.dash = this.letter = this.dot * 3; // Dash is three time units, (between letters)
      this.word = this.dot * 7; // Space between words is seven time units
    },
    update_oscilliator: function () {
      this.oscilliator.type = this.oscilliator_type;
      this.oscilliator.frequency.value = this.oscilliator_frequency;
    },
    // Use connect and disconnect methods to generate audio
    // which time is not known (when gain cannot be used)
    // For example, in Write component play duration depends
    // to a hold time of a key. So, to generate a continuous
    // sound connect the oscilliator when key pressed and
    // disconnect it when key is released.
    connect_oscilliator: function () {
      this.oscilliator.connect(this.oscilliator_destination);
    },
    disconnect_oscilliator: function () {
      this.oscilliator.disconnect();
    },
    play: function (text) {
      // Create an oscilliator to generate an audio
      var context = new AudioContext();
      var oscilliator = context.createOscillator();
      oscilliator.type = this.oscilliator_type;
      oscilliator.frequency.value = this.oscilliator_frequency;

      // Using gain property, mute or unmute the audio
      // for given times(times will be calculated using
      // morse code's symbol spaces).
      // So, durations which audio is unmuted will basically
      // create dots and dashes.
      var gainNode = context.createGain();
      var gain = gainNode.gain;
      var time = context.currentTime;
      gain.setValueAtTime(0, time);
      for (let char of text)
      {
        if (char != " ")
        {
          for (let symbol of this.code[char])
          {
            gain.setValueAtTime(1, time);
            if (symbol == ".")
              time += this.dot;
            else if (symbol == "-")
              time += this.dash;
            gain.setValueAtTime(0, time);
            time += this.dot; // Symbol space
          }
          time += this.dot; // Letter space
        }
        else
          time += this.word;
      }
      oscilliator.connect(gainNode).connect(context.destination);
      oscilliator.start();
    }
  },
  created() {
    // Create an oscilliator to generate an audio
    // Share the context and connect and disconnect methods
    // between components, so they can slso play an audio.
    this.oscilliator_destination = this.context.destination;
    this.oscilliator = this.context.createOscillator();
    this.oscilliator.type = this.oscilliator_type;
    this.oscilliator.frequency.value = this.oscilliator_frequency;
    this.oscilliator.start();
  }
}
</script>

<style src='./form.css'></style>
<style scoped>
#options {
  font-family: "Arial Black", Gadget, sans-serif;
  background: gray;
  text-align: center;
  padding: 8px;
}
#type, #wpm, #frequency {
  display: inline-block;
  margin: 4px 6px 0px 6px;
}
</style>