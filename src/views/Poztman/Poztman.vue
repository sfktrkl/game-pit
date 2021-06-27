<template>
  <div id="poztman" @keyup="sendKey($event)" tabindex="0">

    <div id="name">Poztman</div>

    <div class="container">

      <div class="list">
        <div class="listTitle">Poztman API</div>
        <div class="requests" v-for="request in requests" :key="request">
          <div class="requestItem" @click="updateRequest(request)">
            <div class="requestType" v-if="request.type == 'Get'" :style="{ color: getColor }"> {{ request.type }} </div>
            <div class="requestType" v-else :style="{ color: postColor }"> {{ request.type }} </div>
            <div class="requestName">{{ request.name }}</div>
          </div>
        </div>
      </div>

      <div class="request" >
        <div class="title">Request</div>
        <div class="requestUrl">
          <input class="url" v-model="url" disabled="true" :size="url.length">
          <input class="url2" v-model="url2" disabled="true">
          <button class="send" @click="sendRequest">Send</button>
        </div>

        <table v-if="request.params">
          <thead>
            <tr>
              <th class="paramOptional"></th>
              <th class="paramName">Parameter</th>
              <th class="paramValue">Value</th>
            </tr>
          </thead>

          <tbody>
            <tr class="requestParams" v-for="param in request.params" :key="param">
              <td class="paramOptional"><input type="checkbox" :checked="!param.optional" :disabled="!param.optional"></td>
              <td class="paramName"><label>{{ param.name }}</label></td>
              <td class="paramValue"><input class="paramInput" :size="param.value.length" :style="{ width: '100%' }" @keyup="updateURL($event, param)"></td>
            </tr>
          </tbody>
        </table>

      </div>

      <div class="response">
        <div class="title">Response</div>
        <button class="responseState active" @click="updateResponseState($event, false)">Lovely</button>
        <button class="responseState" @click="updateResponseState($event, true)">Raw</button>
        <div class="responseText"><div class="text" v-html="response"></div></div>
      </div>

    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data () {
    return {

      raw: false,

      getColor: "green",
      postColor: "red",

      requests: [
        { name: 'Print', type:'Get', url: "print" },
        { name: 'Print word', type:'Get', url: "print/:word", params: [{ name: "word", optional: false, type: "word", value:"word" }] },
        { name: 'Get all words', type:'Get', url: "all" },
        { name: 'Add word', type:'Get' },
        { name: 'Subtract word', type:'Get' },
        { name: 'Search word', type:'Get' },
        { name: 'Add words', type:'Post' },
        { name: 'Subtract words', type:'Post' },
        { name: 'Add table', type:'Post' },
        { name: 'Subtract table', type:'Post' },
      ],
      url: "https://game-pit-poztman-server.herokuapp.com/",
      url2: " ",
      request: {},

      response: "",
      originalResponse: ""
    }
  },
  methods: {
    updateResponseText: function(text) {
      let s = text;
      if (s.charAt(0) == "\"")
      {
        s = s.slice(1);
        s = s.slice(0, -1);
      }
      if (!this.raw)
      {
        s = s.replaceAll('\n', '<br>');
        s = s.replaceAll(' ', '&nbsp');
      }
      return s;
    },
    useResponse: function(data) {
      this.originalResponse = JSON.stringify(data, null, 4);
      this.response = this.updateResponseText(this.originalResponse);
    },
    updateResponseState: function(event, state) {
      this.raw = state;
      document.getElementsByClassName("responseState").forEach(element => {
        element.classList.toggle('active');
      });
      this.response = this.updateResponseText(this.originalResponse);
    },
    updateRequest: function(request) {
      this.response = "";
      this.originalResponse = "";
      this.request = request;
      this.url2 = request.url;
    },
    sendKey: function(event) {
      if (event.keyCode == 13) // Enter key code
        this.sendRequest();
    },
    sendRequest: function() {
      let url = this.url + this.url2;
      if (Object.keys(this.request).length == 0 || this.request.type == "Get")
        axios.get(url).then((response) => { this.useResponse(response.data); });
      else
        axios.get(url).then((response) => { console.log(response); });
    },
    updateURL: function(event, param) {
      let text = event.target.value;
      let paramName = ":" + param.name;
      if (this.url2.includes(paramName))
        this.url2 = this.url2.replace(paramName, text);
      else if (this.url2.includes(param.value))
        this.url2 = this.url2.replace(param.value, text);
      param.value = text;
    }
  }
}
</script>

<style scoped>
#name {
  text-align: center;
  line-height: 60px;
  font-size: 50px;
}
button {
  background: blueviolet;
  color: white;
  border: none;
  padding: 10px 18px;
  font-size: 16px;
  transition: 0.3s;
  opacity: 0.70;
  cursor: pointer;
  display: inline-block;
}
button:hover {
  opacity: 1;
}
table {
  border-collapse: collapse;
  margin-top: 20px;
  width: 100%;
}
th, td {
  border: 1px double #ddd;
  padding: 8px 16px;
  font-size: 16px;
}
.container {
  display: grid;
  grid-template-columns: 1fr 8fr;
  grid-template-rows: 2fr 8fr;
  grid-template-areas:
    "list request"
    "list response";
  /* header is 60px, #name is also 60px */
  height: calc(100vh - 60px - 60px);
}
.list {
  border: 1px double #ddd;
  grid-area: list;
}
.request {
  border-bottom: 1px double #ddd;
  border-top: 1px double #ddd;
  grid-area: request;
  padding: 20px;
}
.response {
  border-collapse: collapse;
  grid-area: response;
  display: table;
  margin: 20px;
}

.listTitle {
  font-weight: bold;
  font-size: 20px;
  margin: 20px 0px;
  padding: 0 8px;
}
.title {
  margin-bottom: 16px;
  font-weight: bold;
  font-size: 20px;
}

.requests {
  user-select: none;
  padding: 0 12px;
  margin: 6px 0;
}
.requestItem {
  border: 1px double #ddd;
}
.requestItem:hover {
  background: gray;
  cursor: pointer;
}
.requestType {
  display: inline-block;
  text-align: right;
  font-weight: bold;
  width: 30px;
}
.requestName {
  display: inline-block;
  margin: 6px;
}

.requestUrl {
  display: inline-flex;
  width: 100%;
}
.url, .url2 {
  display: inline-block;
  border-style: double;
  padding: 8px 16px;
  font-size: 16px;
}
.url2 {
  background: white;
  color: black;
  flex-grow: 1;
  width: auto;
}
.requestParamTable {
  margin: 20px;
}
.paramOptional {
  text-align: center;
  margin: 0px 8px;
  height: 16px;
  width: 10%;
}
.paramName {
  text-align: center;
  width: 10%;
}
.paramValue {
  width: 80%;
}
.paramInput {
  border-style: double;
  padding: 8px 0px;
}

.responseState {
  background: gray;
  margin-right: 20px;
  margin-bottom: 12px;
}
.responseState.active {
  background: green;
  opacity: 1;
}
.responseState:hover {
  background: blue;
}
.responseText {
  border: 1px double #ddd;
  display: table-row;
  height: 100%;
}
.text {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  font-size: 14px;
  margin: 12px;
}
</style>
