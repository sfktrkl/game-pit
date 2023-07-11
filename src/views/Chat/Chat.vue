<template>
  <div id="chat">
    <div id="name">Chat</div>
    <div v-if="!login">
      <div id="form">
        <form @submit.prevent="joinRoom()">
          <label>Room</label>
          <div id="input"><input v-model="room" placeholder="Room" required></div>

          <label>Nick</label>
          <div id="input"><input v-model="username" placeholder="Nickname" required></div>
          <div id="submit"><input type="submit" value="Login"></div>
        </form>
      </div>
    </div>
    <div v-else>
      <div id="room">Room: {{ room }}</div>
      <div id="title">Online</div>
      <div id="people">
        <div id="you"> {{ username }} </div>
        <div v-for="(user, index) in users" :key="index">
          <div id="users">
            <div id="online" v-if="user.id != socketId">
              {{ user.name }}
            </div>
          </div>
        </div>
      </div>

      <div id="title">Chat</div>
      <div id="chats">
        <div v-for="(message, index) in messages" :key="index">
          <div v-if="message.user.id != socketId">
            <div id="theirChat">
              <div id="small"> {{message.user.id}} </div>
              <div> {{ message.user.username }}: {{ message.message }}</div>
            </div>
          </div>
          <div id="yourChat" v-else>
            {{ message.message }}
          </div>
        </div>
      </div>

      <div id="form">
        <form @submit.prevent="sendMessage()">
          <div ><input id="text" type="text" v-model="message" autocomplete="off" required></div>
          <div id="submit"><input type="submit" value="Send"></div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import io from 'socket.io-client';

export default {
  data () {
    return {
      login: false,
      room: "",
      username: "",
      users: [],
      message: "",
      messages: [],
      socket: io("https://18.195.50.181:3000"),
      socketId : ""
    }
  },
  methods: {
    joinRoom() {
      this.login = true;
      this.socket.emit('join_room', { room: this.room, user: this.username });
      this.socket.on(this.room, (room) => {
        this.messages = room.messages;
        if (this.socketId == "")
          this.socketId = room.socketId;
        this.users = room.users;
      });
    },
    sendMessage() {
        this.socket.emit('new_message', { room: this.room, message: { user: { username: this.username, id: this.socketId }, message: this.message } });
        this.message = ''
    }
  },
  beforeUnmount() {
    this.socket.emit('exit_room', { room: this.room, socketId: this.socketId });
  },
  updated()
  {
    var container = this.$el.querySelector("#chats");
    if (container)
      container.scrollTop = container.scrollHeight;
  }
}
</script>

<style scoped>
#chat {
  margin-left: 50px;
  margin-right: 50px;
  font-family: "Arial Black", Gadget, sans-serif;
}
#name {
  text-align: center;
  font-family: none;
  line-height: 60px;
  font-size: 50px;
}
#input {
  margin: 5px 0px;
}
#submit input {
  background-color: blue;
  color: white;
  border: none;
  padding: 16px 32px;
  font-size: 16px;
  transition: 0.3s;
  opacity: 0.75;
  cursor: pointer;
  display: block;
  margin: auto;
}
#form {
  text-align: center;
  margin: 0px 20px;
}
#room {
  font-size: 120%;
  margin: 10px;
  color: red;
  text-align: center;
}
#title {
  margin: 10px;
  color: blue;
  text-align: center;
}
#people {
  height: 50px;
  border: solid 2px;
  padding: 12px;
  border-color: blue;
  overflow: auto;
}
#users {
  float: left;
}
#online {
  margin: 4px 4px 10px 10px;
}
#you {
  text-align: center;
  color: lime;
}
#yourChat {
  padding: 0px 12px 4px 12px;
  margin: 8px 0px 8px 0px;
  text-align: right;
  border: solid 1px;
  color: lime;
}
#theirChat {
  padding: 0px 12px 4px 12px;
  margin: 8px 0px 8px 0px;
  border: solid 1px;
  margin-top: 4px;
  color: black;
}
#chats {
  height: 400px;
  border: solid 2px;
  padding: 12px;
  border-color: blue;
  overflow: auto;
}
#small {
  display: inline-block;
  color: gray;
  margin-top: 2px;
  font-size: 75%;
}
#text {
  width: 100%;
  margin: 10px auto;
  text-align: right;
}
</style>
