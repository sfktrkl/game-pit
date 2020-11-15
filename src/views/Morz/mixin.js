// We can use mixins to externalize popular pieces of codes
// which are used in different components.

// This mixin used in Learn and Write components
export default {
  props: {
    code: { type: Object },
    context: { type: Object },
    dot: { type: Number },
    dash: { type: Number },
    word: { type: Number }
  },
  emits: [
    'on-connect',
    'on-disconnect'
  ],
  methods: {
    update_text: function (clear = false, sample = "") {
      if (sample != "")
        this.text = sample;
      if (clear)
        this.output.length = 0;

      // If output does not contain any letter to show,
      // new text should be generated or page should be
      // loaded for the firts time, so take the first
      // letter from the text and make it blue, to inform
      // user about current text.
      if (this.output.length == 0 && !(this.mode == "learn" && !this.enable_learn))
      {
        this.remove_space();
        this.output.push({ color: "blue", char: this.text[0] });
        this.current_char = this.text[0];
        this.text = this.text.substring(1);
        this.remove_space();
      }

      // If there is no current character and text remained.
      if (this.text.length == 0 && this.output[this.output.length - 1].color != "blue")
      {
        this.input = "";
        this.started = false;
        this.current_char = "Finished!"
        this.get_sample(false);
        return;
      }

      if (this.input)
      {
        var last = this.output[this.output.length - 1];
        var last_char = last.char.toLowerCase();
        var input_char = this.swapped_code[this.input];
        // Compare input taken by user and the current char.
        // If they match make output green (it is like success)
        // and remove the hint of that letter if any exist.
        if (input_char && input_char == last_char)
        {
          last.color = "green";
          if (this.mode == "learn" && this.current_letters[last_char])
          {
            // In learn mode, increase each known letters' row amount by 1
            this.current_letters[last_char].row += 1;
            // When letter is typed correctly,
            // Two times in a row, remove hint
            if (this.current_letters[last_char].row == 2)
              delete this.hints[last_char];
            // Ten times in a row, assume it is learned and add a new letter
            else if (this.current_letters[last_char].row == 10)
            {
              this.learned_letters[last_char] = this.current_letters[last_char];
              delete this.current_letters[last_char];
              // When there is no letter left, finish.
              if (Object.keys(this.current_letters).length == 0)
              {
                this.clear_all();
                this.text = "Finished!";
                return;
              }
              this.update_current();
            }
          }
          if (this.enable_hints) delete this.hints[last_char];
        }
        else
        {
          last.color = "red";
          // In learn mode, reset row counter when letter entered wrong
          // So, it can be tracked how many times in a row letter is typed correctly
          if (this.mode == "learn" && this.current_letters[last_char])
          {
            this.current_letters[last_char].row = 0;
            this.hints[last_char] = this.code[last_char];
          }
          if (this.enable_hints) this.hints[last_char] = this.code[last_char];
        }

        if (this.text.length == 0) return;
        // Remove spaces before getting the new character
        // as current one.
        this.remove_space();
        this.output.push({ color: "blue", char: this.text[0] });
        this.current_char = this.text[0];
        this.text = this.text.substring(1);
        this.input = "";
      }
    },
    remove_space: function () {
      // If there is a white-space in the text.
      // append it to output and recurse to find
      // next letter.
      if (this.text[0] == " ")
      {
        this.output.push({ color: "black", char: this.text[0] });
        this.text = this.text.substring(1);
        this.remove_space();
      }
    },
    up: function () {
      var newTime = this.context.currentTime;
      // Discnnect the oscillator, so audio can stop.
      this.$emit('on-disconnect');
      // According to elapsed time, either
      // append a dot or a dash to input.
      // Check two dot space for dash,
      // to ease catching a it.
      if (newTime - this.time > this.dot * 2)
        this.input += "-";
      else
        this.input += ".";
      // Stop ticking, so next key can be pressed.
      this.ticking = false;
      this.time = this.context.currentTime;
    },
    down: function () {
      if (this.ticking) return;
      // Start ticking, so user cannot press
      // more than one key at the same time.
      this.ticking = true;
      // Start taking inputs, so it can be counted
      // to end the letter(by an interval in mounted hook).
      this.started = true;
      this.time = this.context.currentTime;
      // Connect the oscillator, so audio will play
      // until it is disconnected(when keyup)
      this.$emit('on-connect');
    },

  },
  async mounted() {
    await this.get_sample();

    // Swap the keys and values of the code
    // so it can be used to determine given input
    // corresponds to which symbol.
    this.swapped_code = {};
    for (let item in this.code)
      this.swapped_code[this.code[item]] = item;

    // Focus the textarea, so user can directly start writing.
    this.$refs["area"].focus();

    // Set an interval(as a dot duration) to check
    // user constantly about whether he finished giving
    // inputs or not. So, it can be understood current
    // letter is completed and the next one can be passed.
    setInterval(() => {
      if (this.started)
      {
        var newTime = this.context.currentTime;
        if (newTime - this.time > this.word)
          this.update_text();
      }
    }, this.dot * 1000);
  }
}