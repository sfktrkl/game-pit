const PORT = process.env.PORT || 3000;

const app = require("express")();
app.use(require("cors")());
const server = app.listen(PORT, () => console.log(`Listening on ${PORT}`));
const io = require("socket.io")(server, { cors: { origin: "*" } });

function toArray(room, socketId) {
  let value = {};
  value.users = [];
  value.messages = [];
  value.socketId = socketId;
  value.messages = room.messages;
  room.users.forEach((v, k) => value.users.push({ name: v, id: k }));
  return value;
}

let rooms = new Map();

io.on("connection", function(socket) {
  socket.on("join_room", function(data) {
    if (!rooms.has(data.room)) {
      rooms.set(data.room, {});
      rooms.get(data.room).users = new Map();
      rooms.get(data.room).messages = [];
    }
    rooms.get(data.room).users.set(socket.id, data.user);
    io.emit(data.room, toArray(rooms.get(data.room), socket.id));
  });

  socket.on("new_message", function(data) {
    if (rooms.has(data.room)) {
      rooms.get(data.room).messages.push(data.message);
      io.emit(data.room, toArray(rooms.get(data.room), socket.id));
    }
  });

  socket.on("exit_room", function(data) {
    if (rooms.has(data.room)) {
      rooms.get(data.room).users.delete(data.socketId);
      if (rooms.get(data.room).users.size == 0) rooms.delete(data.room);
      if (rooms.has(data.room)) io.emit(data.room, toArray(rooms.get(data.room), socket.id));
    }
  });
});

export default app;
