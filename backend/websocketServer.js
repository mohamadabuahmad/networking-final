websocket :
const WebSocket = require('ws');

// Use an environment variable for the port or default to 8080
const port = process.env.PORT || 24523;
const wss = new WebSocket.Server({ port });

wss.on('connection', (ws, req) => {
  console.log('New WebSocket client connected');

  ws.on('message', (message) => {
    console.log(`Received message => ${message}`);

    // Broadcast the message to all clients except the sender
    wss.clients.forEach((client) => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(message);
        console.log(`Sent message to client: ${client._socket.remoteAddress}`);
      }
    });
  });

  ws.on('close', () => {
    console.log('WebSocket client disconnected');
  });
});

console.log(`WebSocket server running on port ${port}`);