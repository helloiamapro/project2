const WebSocket = require('websocket').server;
const http = require('http');

const server = http.createServer((request, response) => {
    console.log(new Date() + ' Received request for ' + request.url);
    response.writeHead(404);
    response.end();
});

server.listen(port, '0.0.0.0', () => {
  console.log(`Server is running on http://0.0.0.0:${port}`);
});

const wsServer = new WebSocket({
    httpServer: server,
});

wsServer.on('request', (request) => {
    const connection = request.accept(null, request.origin);

    connection.on('message', (message) => {
        if (message.type === 'utf8') {
            console.log('Received Message:', message.utf8Data);
            wsServer.broadcastUTF(message.utf8Data);
        }
    });

    connection.on('close', (reasonCode, description) => {
        console.log('Connection closed:', reasonCode, description);
    });
});
