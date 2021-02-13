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
      <button>Generate password</button>
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