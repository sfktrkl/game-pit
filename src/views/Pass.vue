<template>
  <div class="pass">

    <h1>Password Generator</h1>

    <span>
      <label for="passLength">Password Length: </label>
      <input id="passLength" type="number" min="6" max="50" v-model.number="passLength">
    </span>

    <span>
      <label for="includeNumbers">Include Numbers: </label>
      <input type="checkbox" id="includeNumbers" v-model="includeNumbers">
      <label for="includeNumbers">(e.g. 123456)</label>
    </span>

    <span>
      <label for="includeLowercase">Include Lowercase Characters: </label>
      <input type="checkbox" id="includeLowercase" v-model="includeLowercase">
      <label for="includeLowercase">(e.g. abcdefgh)</label>
    </span>

    <span>
      <label for="includeUppercase">Include Uppercase Characters: </label>
      <input type="checkbox" id="includeUppercase" v-model="includeUppercase">
      <label for="includeUppercase">(e.g. ABCDEFGH)</label>
    </span>

    <span>
      <label for="beginWithLetter">Begin With A Letter: </label>
      <input type="checkbox" id="beginWithLetter" v-model="beginWithLetter">
      <label for="beginWithLetter">(don't begin with a number or symbol)</label>
    </span>

    <span>
      <label for="noSimilarChars">No Similar Characters: </label>
      <input type="checkbox" id="noSimilarChars" v-model="noSimilarChars">
      <label for="noSimilarChars">(don't use characters like i, l, 1, L, o, 0, O, etc.)</label>
    </span>

    <span>
      <label for="noDuplicateChars">No Duplicate Characters: </label>
      <input type="checkbox" id="noDuplicateChars" v-model="noDuplicateChars">
      <label for="noDuplicateChars">(don't use the same character more than once)</label>
    </span>

    <span>
      <label for="noSequentialChars">No Sequential Characters: </label>
      <input type="checkbox" id="noSequentialChars" v-model="noSequentialChars">
      <label for="noSequentialChars">(don't use sequential characters, e.g. abc, 789)</label>
    </span>

    <span>
      <label for="includeSymbols">Include Symbols: </label>
      <input id="includeSymbols" v-model="includeSymbols">
    </span>

    <span>
      <button @click.stop.prevent="generate_password()">Generate password</button>
    </span>

    <span>
      <textarea v-model="password" disabled="true" ></textarea>
    </span>

  </div>
</template>

<script>
export default {
  data () {
    return {
      // Password settings
      passLength: 16,
      includeNumbers: true,
      includeLowercase: true,
      includeUppercase: true,
      beginWithLetter: true,
      includeSymbols: '!\'";#$%&()*+,-./:;<=>?@[]^_`{|}~',
      noSimilarChars: true,
      noDuplicateChars: true,
      noSequentialChars: true,
      password: "Generated password",
    }
  },
  methods: {
    generate_password: function () {

      var chars = [];
      chars.push("0123456789");
      chars.push("abcdefghijkmnopqrstuvwxyz");
      chars.push("ABCDEFGHJKLMNOPQRSTUVWXYZ");
      chars.push(this.includeSymbols);

      var allowedChars = (startWithLetter) => 
      {
        var allowed = "";
        if (this.includeNumbers && !startWithLetter)
          allowed += chars[0];
        if (this.includeLowercase)
          allowed += chars[1];
        if (this.includeUppercase)
          allowed += chars[2];
        if (!startWithLetter)
          allowed += chars[3];
        return allowed;
      };

      var removeChar = (str, char) => {
        var index = str.indexOf(char);
        if (index != -1)
          str = str.slice(0, index) + str.slice(index + 1);
        return str;
      }

      var allowed = allowedChars(this.beginWithLetter);

      var password = "";
      var sequentialCharCodes = [];
      var duplicateChars = [];
      var similarChars = ["i", "l", "1", "L", "o", "0", "O"];
      var random = (max) => { return Math.floor(Math.random() * max); };
      for (let i = 0; i < this.passLength; i++)
      {
        if (this.noSimilarChars)
          similarChars.forEach(char => allowed = removeChar(allowed, char));

        sequentialCharCodes.forEach(charCode => allowed = removeChar(allowed, String.fromCharCode(charCode)));
        sequentialCharCodes.length = 0;

        duplicateChars.forEach(char => allowed = removeChar(allowed, char));

        var randomIndex = random(allowed.length);
        var char = allowed[randomIndex];
        if (char == undefined)
        {
          this.password = "ERROR";
          return
        }

        if (this.noSequentialChars)
        {
          sequentialCharCodes.push(char.charCodeAt(0) - 1);
          sequentialCharCodes.push(char.charCodeAt(0));
          sequentialCharCodes.push(char.charCodeAt(0) + 1);
        }

        if (this.noDuplicateChars)
          duplicateChars.push(char);

        password += char;

        allowed = allowedChars(false);
      }

      this.password = password;
      this.copy_to_clipboard(this.password);
    },
    copy_to_clipboard: function (str) {
      // Create a temporary element to select it
      // and copy its value to clipboard
      const el = document.createElement('textarea');
      el.value = str;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
    }
  }
}
</script>

<style scoped>
.pass {
  margin: 10px;
}
span {
    display: inline-block;
    line-height: 2rem;
    width: 100%;
}
</style>