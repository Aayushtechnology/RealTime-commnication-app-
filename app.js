const express = require('express');
const { createServer } = require('node:http');
const { join } = require('node:path');
const { Server } = require('socket.io');

const app = express();
const port = process.env.port || 5000;
const server = createServer(app);
const io = new Server(server);
const connectDB = require('./db/dbconnct');
connectDB();

app.get('/', (req, res) => {
    res.sendFile(join(__dirname, 'index.html'));
});

io.on('connection', (socket) => {
    console.log('a user connected');
});

server.listen(port, () => {
    console.log(`server running at http://localhost:${port}`);
});