<template>
  <div id="adventure">
    <label>Adventure</label>
    <div id="container">

        <div id="status">Status
          <div v-for="info in informations" :key="info">
            <div class="info response" v-if="info" :style="{color: info.color}">{{info.text}}</div>
          </div>
        </div>

        <div id="move">Move
          <div id="difficulty">
            <div>Adventure Difficulty</div>
            <input class="input" type="number" v-model="difficulty" min="1" :max="aidl.level" @change="update($event)" required>
            <div class="response" v-for="response in responses.difficulty" :key="response">
              <div v-if="response" :style="{color: response.color}">{{response.text}}</div>
            </div>
          </div>

          <div id="adv">
            <button class="button adv" :disabled="responses.disable_adventure" @click="execute(adventure)">Go to Adventure</button>
            <div class="response" v-for="response in responses.adventure" :key="response">
              <div v-if="response" :style="{color: response.color}">{{response.text}}</div>
            </div>
          </div>

          <div id="eat">
            <button class="button eat" :disabled="responses.disable_eat" @click="execute(eat)">Eat</button>
            <div class="response" v-for="response in responses.eat" :key="response">
              <div v-if="response" :style="{color: response.color}">{{response.text}}</div>
            </div>
          </div>

          <div id="rest">
            <button class="button rest" :disabled="responses.disable_rest" @click="execute(rest)">Rest</button>
            <div class="response" v-for="response in responses.rest" :key="response">
              <div v-if="response" :style="{color: response.color}">{{response.text}}</div>
            </div>
          </div>
        </div>

    </div>
  </div>
</template>

<script>
import mixin from './mixin'

export default {
  data() {
    return {
      // Adventure difficulty
      difficulty: 1,

      // These responses are used to inform about 
      // result of the user's last moves.
      responses: {
        difficulty: [],
        adventure: [],
        disable_adventure: false,
        eat: [],
        disable_eat: false,
        rest: [],
        disable_rest: false
      },
    };
  },
  methods: {
    update: function (move) {
      this.update_adventure(move);
      this.update_difficulty(move);
      this.update_eat(move);
      this.update_rest(move);
    },
    update_difficulty: function (move) {
      this.responses.difficulty.length = 0;
      if (move && move.difficulty) this.responses.difficulty.push(move);

      if (!move || !move.target) return; // If it is an event (this update can be called through an input) it should have target.
      if (move.target.value > this.aidl.level)
        this.responses.difficulty.push({ color: "red", text: "You can't go to an adventure higher than your level!"});
      else if (move.target.value <= 0)
        this.responses.difficulty.push({ color: "red", text: "You can't go to a zero or negative level adventure!"});
      else
        this.responses.difficulty.push({ color: "green", text: "Adventure difficulty updated as " + this.difficulty + "."});
    },
    update_adventure: function (move) {
      this.responses.adventure.length = 0;
      this.responses.disable_adventure = false;
      if (move && move.adventure) this.responses.adventure.push(move);

      var stamina_needed = 5 * this.difficulty;
      if (this.aidl.stamina[0] < stamina_needed)
      {
        this.responses.adventure.push({color: "red", text: "Not enough stamina!" });
        this.responses.adventure.push({color: "blue", text: "Stamina needed: " + stamina_needed });
        this.responses.disable_adventure = true;
      }
    },
    update_eat: function (move) {
      this.responses.eat.length = 0;
      this.responses.disable_eat = false;
      if (move && move.eat) this.responses.eat.push(move);

      if (this.aidl.gold < 5) {
        this.responses.eat.push({color: "red", text: "Not enough gold!" });
        this.responses.eat.push({color: "blue", text: "Gold needed: 5" });
        this.responses.disable_eat = true
      }
      else if (this.aidl.health[0] == this.aidl.health[1] && this.aidl.stamina[0] == this.aidl.stamina[1])
      {
        this.responses.eat.push({color: "red", text: "You can't eat more!" });
        this.responses.disable_eat = true
      }
    },
    update_rest: function (move) {
      this.responses.rest.length = 0;
      this.responses.disable_rest = false;
      if (move && move.rest) this.responses.rest.push(move);

      if (this.aidl.health[0] == this.aidl.health[1] && this.aidl.stamina[0] == this.aidl.stamina[1])
      {
        this.responses.rest.push({color: "red", text: "You can't rest more!" })
        this.responses.disable_rest = true;
      }
    },
    execute: function (move) {
      // Clear all informations.
      // Since they need to be overriden according to the moves.
      this.informations.length = 0;
      // Any move can return a response.
      // For example, after going to an adventure,
      // user has to be informed about he was able to
      // go to the adventure.
      // Hence, pass this response to update methods,
      // so they can be added to corresponding response type.
      this.update(move());
    },
    adventure: function () {
      var experience = this.get_random_int(5, 10) * this.difficulty;
      this.gain_experience(experience);

      var gold_gained = this.get_random_int(1, 2 + this.aidl.luck);
      this.update_gold(gold_gained);

      var damage_taken = this.get_random_int(1, 10) * this.difficulty;
      this.update_health(-damage_taken);

      this.update_stamina(-5 * this.difficulty);

      return { adventure: true, color: "green", text: "You went to an adventure." };
    },
    eat: function () {
      this.update_gold(-5);

      var health_restored = this.aidl.health[1] * 0.2;
      this.update_health(health_restored);

      var stamina_restored = this.aidl.health[1] * 0.2;
      this.update_stamina(stamina_restored);

      return { eat: true, color: "green", text: "You ate." };
    },
    rest: function () {
      // Based on maximum luck
      var health_restored = this.aidl.health[1] * this.get_random_int(1, this.aidl.luck) / 100;
      this.update_health(health_restored);

      var stamina_restored = this.aidl.stamina[1] * this.get_random_int(1, this.aidl.luck) / 100;
      this.update_stamina(stamina_restored);

      return { rest: true, color: "green", text: "You rested." };
    },
    get_random_int: function (min, max) {
      return Math.floor(Math.random() * (max - min)) + min; // max excluded
    }
  },
  mounted() {
    this.update(null);
  },
  mixins: [
    mixin
  ]
}
</script>

<style scoped>
#adventure {
  margin: 10px;
  text-align: center;
  font-family: "Arial Black", Gadget, sans-serif;
}
#container {
  margin: 16px auto;
}
#status, #move {
  width: 400px;
  display: inline-block;
  vertical-align: top;
  color: blueviolet;
}
.info {
  margin: 16px 0px;
}
.input {
  background-color: darkcyan;
  color: white;
  transition: 0.3s;
  opacity: 0.7;
  padding: 12px 20px;
  margin: 4px 8px;
  border: 3px solid white;
  box-sizing: border-box; 
}
.button {
  color: white;
  border: none;
  padding: 16px 32px;
  margin: 4px 8px;
  font-size: 16px;
  transition: 0.3s;
  opacity: 0.70;
  cursor: pointer;
  display: inline-block;
}
.input:focus {
  border: 3px solid gray;
}
.button:hover, .input:hover, .input:focus {
  opacity: 1;
}
.adv {
  background-color: blue;
}
.eat {
  background-color: blueviolet;
}
.rest {
  background-color: green;
}
.button:disabled {
  background-color: gray;
  cursor: default;
  opacity: 1;
}
#difficulty, #adv, #eat, #rest {
  min-height: 120px;
}
.response {
  opacity: 1;
}
.response:nth-of-type(1) {
  animation-name: translate;
  animation-duration: 1.5s;
}
.response:nth-of-type(2) {
  animation-name: translate;
  animation-duration: 1.5s;
}
@keyframes translate {
  0% {
    opacity: 0;
    transform: translate3d(0, 10px, 0);
  }

  20%, 100% {
    opacity: 1;
    transform: translate3d(0, 0, 0);
  }
}
</style>