<template>
  <div id="character">
      Character
      <div id="container">
        <div id="status">
          <div id="information">
            Character Information
            <div class="info">Character Name: {{aidl.name}}</div>
            <div class="info">Level: {{aidl.level}}</div>
            <div class="info">Gold: {{aidl.gold}}</div>
            <div class="info">Experience: {{aidl.experience[0]}}/{{aidl.experience[1]}}</div>
            <div class="info">Stamina: {{aidl.stamina[0]}}/{{aidl.stamina[1]}}</div>
          </div>
          <div id="attributes">
            Attributes
            <div class="points">Attribute points: {{aidl.attribute_point}}</div>
            <div class="attribute">Intelligence: {{aidl.intelligence}}</div>
            <div class="attribute">Endurance: {{aidl.endurance}}</div>
            <div class="attribute">Strength: {{aidl.strength}}</div>
            <div class="attribute">Dexterity: {{aidl.dexterity}}</div>
            <div class="attribute">Charisma: {{aidl.charisma}}</div>
            <div class="attribute">Luck: {{aidl.luck}}</div>
          </div>
        </div>

        <div id="items">
          <div id="row">
            <div class="item x22 blue center">
              <div class="centered">Helmet
                <span class="help">Helmet Information</span>
              </div>
            </div>
          </div>
          <div id="row">
            <div class="item x21 orange">
              <div class="centered">Necklace
                <span class="help">Necklace Information</span>
              </div>
            </div>
          </div>
          <div id="row">
            <div class="item x23 red">
              <div class="centered">Sword
                <span class="help">Sword Information</span>
              </div>
            </div>
            <div class="item x23 blue">
              <div class="centered">Armour
                <span class="help">Armour Information</span>
              </div>
            </div>
            <div class="item x23 red">
              <div class="centered">Shield
                <span class="help">Shield Information</span>
              </div>
            </div>
          </div>
          <div id="row">
            <div class="item x11 orange">
              <div class="centered">Ring
                <span class="help">Ring Information</span>
              </div>
            </div>
            <div class="item x21 brown">
              <div class="centered">Belt
                <span class="help">Belt Information</span>
              </div>
            </div>
            <div class="item x11 orange">
              <div class="centered">Ring
                <span class="help">Ring Information</span>
              </div>
            </div>
          </div>
          <div id="row">
            <div class="item x22 blue">
              <div class="centered">Gloves
                <span class="help">Gloves Information</span>
              </div>
            </div>
            <div class="item x23 blue">
              <div class="centered">Leggings
                <span class="help">Leggings Information</span>
              </div>
            </div>
            <div class="item x22 blue">
              <div class="centered">Bracers
                <span class="help">Bracers Information</span>
              </div>
            </div>
          </div>
          <div id="row">
            <div class="item x22 blue">
              <div class="centered">Shoes
                <span class="help">Shoes Information</span>
              </div>
            </div>
          </div>
        </div>
      </div>
  </div>
</template>

<script>
import mixin from './mixin'

export default {
  mixins: [
    mixin
  ]
}
</script>

<style scoped>
#character {
  margin: 10px;
  text-align: center;
  font-family: "Arial Black", Gadget, sans-serif;
}
#container {
  margin: 16px auto;
}
#status {
  display: inline-block;
  margin: 0px 30px;
  padding: 0px 65px;
  vertical-align: top;
}
#information, #attributes {
  padding-top: 5px;
  padding-bottom: 20px;
  color: blue;
}
.info, .attribute {
  text-align: left;
  margin: 16px 0px;
  color: black;
}
.points {
  margin: 10px;
  color: lime;
}
#items {
  display: inline-block;
  vertical-align: top;
}
#row {
  margin: 8px 0px;
}
.item {
  display: inline-block;
  margin: 0px 10px;
  cursor: help;
}
.item:hover .help {
  visibility: visible;
}
.centered {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.help {
  background-color: gray;
  visibility: hidden;
  text-align: center;
  border-radius: 6px;
  padding: 10px 10px;
  position: absolute;
  z-index: 1;
}
.x11 {
  width: 50px;
  height: 50px;
}
.x21 {
  width: 100px;
  height: 50px;
}
.x22 {
  width: 100px;
  height: 100px;
}
.x23 {
  width: 100px;
  height: 150px;
}
.red {
  border: 2px solid red;
  color: red;
}
.blue {
  border: 2px solid blue;
  color: blue;
}
.brown {
  border: 2px solid brown;
  color: brown;
}
.orange {
  border: 2px solid orange;
  color: orange;
}
.green {
  border: 2px solid lime;
  color: lime;
}
</style>