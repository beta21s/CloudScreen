const fs = require('fs');
var key = fs.readFileSync(__dirname + '/ssl/selfsigned.key');
var cert = fs.readFileSync(__dirname + '/ssl/selfsigned.crt');
var options = {
  key: key,
  cert: cert
};

const express = require("express");
const app = express();
const server = require("https").Server(options, app);
const { v4: uuidv4 } = require("uuid");
const io = require("socket.io")(server);


const { ExpressPeerServer } = require("peer");
const peerServer = ExpressPeerServer(server, {
  debug: true,
});

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use("/peerjs", peerServer);

app.get("/share", (req, res) => {
  res.render("share");
});

app.get("/view", (req, res) => {
  res.render("view");
});


// app.get("/", (req, rsp) => {
//   rsp.redirect(`/${uuidv4()}`);
// });

// app.get("/:room", (req, res) => {
//   res.render("room", { roomId: req.params.room });
// });

// io.on("connection", (socket) => {
//   socket.on("room", (roomId, userId) => {
//     socket.join(roomId);
//     socket.to(roomId).broadcast.emit("newView", userId);
//   });
// });

io.on('connection', function (socket) {
  console.log('IO Connect: ' + socket.id);
  socket.use(async (packet, next) => {
      let topic = packet[0];
      let data = packet[1];
      io.sockets.emit(topic, data);
  });
});

server.listen(443, () => console.log('Server running in port ' + 443));
