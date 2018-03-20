var WebSocket = require("ws");
var WebSocketServer = WebSocket.Server;
var port = 3001;
var ws = new WebSocketServer({
  port: port
});
var messages = [];
var topic = "";

console.log("websockets server started");

ws.on("connection", function(socket) {
  console.log("client connection established");
  socket.send("*** Topic is '" + topic + "'");

  messages.forEach(function(msg) {
    socket.send(msg);
  });

  socket.on("message", function(data) {
    console.log("message received: " + data);
    var regex = /\/topic/;
    var result = data.match(regex);
    if (result == null) {
      messages.push(data);
      ws.clients.forEach(function(clientSocket) {
        clientSocket.send(data);
      });
    } else {
      topic = data.substring(6).trim();
      var newData = "*** Topic has changed to '" + topic + "'";
      if (topic !== "") {
        ws.clients.forEach(function(clientSocket) {
          clientSocket.send(newData);
        });
      }
    }
  });
});
