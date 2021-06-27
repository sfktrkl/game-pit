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

        <table class="params" v-if="request.params && request.input == 'word'">
          <thead>
            <tr>
              <th class="paramTitle paramOptional"></th>
              <th class="paramTitle paramName">Parameter</th>
              <th class="paramTitle paramValue">Value</th>
            </tr>
          </thead>

          <tbody>
            <tr class="requestParams" v-for="param in request.params" :key="param">
              <td class="param paramOptional"><input type="checkbox" :checked="param.enabled" :disabled="!param.optional" @click="updateParam(param.value, param, request)"></td>
              <td class="param paramName"><label>{{ param.name }}</label></td>
              <td class="param paramValue"><input class="paramInput" :disabled="!param.enabled" :style="{ width: '100%' }" @keyup="updateURL($event.target.value, param, request)"></td>
            </tr>
          </tbody>
        </table>

        <div class="paramWords" v-if="request.params && request.input == 'text'">
          <textarea v-model="text" class="paramText" placeholder="Text"></textarea>
        </div>

        <div class="paramTable" v-if="request.input == 'table'">
          <input type="file" name="file" id="file" class="paramFile" @change="processFile($event)" accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" /> 
          <label class="paramFileLabel" for="file">Choose a file</label>

          <div class="paramsTable">
            <table class="tableParams" v-for="item in xlsx" :key="item">
              <thead>
                <tr v-if="item.length > 0">
                  <th class="paramTitle" v-for="key in Object.keys(item[0])" :key="key">{{ key }}</th>
                </tr>
              </thead>

              <tbody>
                <tr v-for="word in item" :key="word">
                  <td class="param paramName" v-for="value in word" :key="value">{{ value }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

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
import xlsx from 'xlsx';

export default {
  data () {
    return {

      raw: false,

      getColor: "green",
      postColor: "red",

      requests: [
        { name: 'Print', type:'Get', url: "print", input: "none" },

        { name: 'Print word', type:'Get', url: "print/:word", input: "word",
          params: [{ name: "word", optional: false, enabled: true, value: "" }] },

        { name: 'Get all words', type:'Get', url: "all", input: "none" },

        { name: 'Add word', type:'Get', url: "add/:word/:score?", input: "word",
          params: [{ name: "word", optional: false, enabled: true, value: "" },
                   { name: "score", optional: true, enabled: true, value: "" }] },
        { name: 'Subtract word', type:'Get', url: "subtract/:word/:score?", input: "word",
          params: [{ name: "word", optional: false, enabled: true, value: "" },
                   { name: "score", optional: true, enabled: true, value: "" }] },

        { name: 'Search word', type:'Get', url: "search/:word", input: "word",
          params: [{ name: "word", optional: false, enabled: true, value: "" }] },

        { name: 'Add words', type:'Post', url: "addWords", input: "text",
          params: [{ name: "text", optional: false, enabled: true, value: "" }] },
        { name: 'Subtract words', type:'Post', url: "subtractWords", input: "text",
          params: [{ name: "text", optional: false, enabled: true, value: "" }] },

        { name: 'Add table', type:'Post', url: "addTable", input: "table" },
        { name: 'Subtract table', type:'Post', url: "subtractTable", input: "table" }
      ],
      url: "https://game-pit-poztman-server.herokuapp.com/",
      url2: " ",
      request: {},

      response: "",
      originalResponse: "",

      text: "",
      xlsx: [],
      table: ""
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

      this.text = "";
      this.xlsx = [];
      this.table = "";
    },
    sendKey: function(event) {
      if (event.keyCode == 13) // Enter key code
        this.sendRequest();
    },
    sendRequest: function() {
      let url = this.url + this.url2;
      if (this.request.type == "Get")
      {
        axios.get(url).then((response) => { this.useResponse(response.data); });
      }
      else if (this.request.type == "Post" && this.request.input == "text")
      {
        let text = this.text;
        text = text.replaceAll(/\s/g, ' '); // Replace all whitespaces
        axios.post(url, { text: text }).then((response) => { this.useResponse(response.data); });
      }
      else if (this.request.type == "Post" && this.request.input == "table")
      {
        axios.post(url, { text: this.table }).then((response) => { this.useResponse(response.data); });
      }
    },
    updateURL: function(text, param, request) {
      let activeParam = param.name;
      let url = request.url;

      request.params.forEach((param) => {
        let paramText = ":" + param.name + (param.optional ? "?" : "");
        if (param.enabled)
        {
          if (activeParam == param.name)
          {
            if (text != "")
              url = url.replace(paramText, text);
            param.value = text;
          }
          else
          {
            if (param.value != "")
              url = url.replace(paramText, param.value);
          }
        }
        else
        {
          url = url.replace("/" + paramText, "");
        }
      });
      this.url2 = url;
    },
    updateParam: function(event, param, request) {
      param.enabled = !param.enabled;
      this.updateURL(event, param, request);
    },
    readTableData: function() {
      this.xlsx.forEach((sheet) => {
        sheet.forEach((item) => {
          Object.values(item).forEach((value) => {
            this.table += value + " ";
          })
        });
      });
    },
    readFile: function(event)
    {
      return new Promise((resolve, reject) => {
          this.xlsx.length = 0;
          let files = event.target.files;
          let fileReader = new FileReader();
          fileReader.onload = async (event) => {
            let data = event.target.result;
            let workbook = await xlsx.read(data, { type: "binary" });
            workbook.SheetNames.forEach((sheetName) => {
              this.xlsx.push(xlsx.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]));
            });
            resolve(fileReader.result);
          };
          fileReader.onerror = reject;
          fileReader.readAsBinaryString(files[0]);
        });
    },
    processFile: async function(event) {
      await this.readFile(event);
      this.readTableData();
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
.params {
  border-collapse: collapse;
  margin-top: 20px;
  width: 100%;
}
.param, .paramTitle {
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
.paramWords, .paramTable {
  display: inline-flex;
  margin-top: 20px;
  width: 100%;
}
.paramText {
  resize: none;
  width: 100%;
}
.paramFile {
  height: 0;
  width: 0;
  opacity: 0;
  overflow: hidden;
  position: absolute;
  z-index: -1;
}
.paramFile + .paramFileLabel {
  display: inline-block;
  background: green;
  color: white;
  border: none;
  padding: 18px 18px;
  transition: 0.3s;
  opacity: 0.70;
  cursor: pointer;
  height: 18px;
  width: 10%;
}
.paramFile + .paramFileLabel:hover {
  opacity: 1;
}
.paramsTable {
  display: inline-flex;
  width: 100%;
}
.tableParams {
  border-collapse: collapse;
  margin-bottom: 20px;
  margin-left: 20px;
  width: 100%;
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
