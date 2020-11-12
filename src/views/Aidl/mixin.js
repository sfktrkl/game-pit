// Use mixins to externalize popular pieces of codes
// which are used in different components.
export default {
  computed: {
    // aidl and user are used in,
    // Main, Header, Register and Adventure components
    aidl: function () {
      return this.$store.state.aidl;
    },
    user: function () {
      return this.$store.state.user;
    },
    // Used in Adventure component
    informations: function() {
      return this.$store.state.informations;
    }
  },
  methods: {
    add_information: function (value, stat) {
      if (value > 0)
        this.informations.push({ color: "blue", text: value + " " + stat + " gained."})
      if (value < 0)
        this.informations.push({ color: "orange", text: value + " " + stat + " lost."})
    },
    gain_experience: function (experience) {
      this.aidl.experience[0] += experience;
      if (this.aidl.experience[0] >= this.aidl.experience[1])
      {
        this.aidl.level++;
        this.aidl.attribute_point += 5;
        this.aidl.experience[0] -= this.aidl.experience[1];
        this.aidl.experience[1] *= Math.ceil(1.05**this.aidl.level);
        this.informations.push({ color: "green", text: "Level Up!" });
      }
      this.add_information(experience, "experience");
    },
    update_health: function (health) {
      this.aidl.health[0] += health;
      if (this.aidl.health[0] >= this.aidl.health[1])
      {
        this.aidl.health[0] = this.aidl.health[1];
        this.informations.push({ color: "green", text: "Maximum health reached."});
      }
      else if (this.aidl.health[0] <= 0) {
        this.aidl.health[0] = this.aidl.health[1];
        this.aidl.stamina[0] = this.aidl.stamina[1];
        this.aidl.experience[0] = 0;
        this.aidl.gold = Math.floor(this.aidl.gold / 2);
        this.informations.push({ color: "red", text: "You are dead!" });
      }
      else
      {
        this.add_information(health, "health");
      }
    },
    update_stamina: function (stamina) {
      this.aidl.stamina[0] += stamina;
      if (this.aidl.stamina[0] >= this.aidl.stamina[1])
      {
        this.aidl.stamina[0] = this.aidl.stamina[1];
        this.informations.push({ color: "green", text: "Maximum stamina reached." });
      }
      else
      {
        this.add_information(stamina, "stamina");
      }
    },
    update_gold: function (gold) {
      this.aidl.gold += gold;
      this.add_information(gold, "gold");
    }
  }
}
