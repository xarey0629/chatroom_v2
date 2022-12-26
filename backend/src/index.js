// import express from 'express';
// import http from 'http';
// import WebSocket from 'ws';
// import mongoose from 'mongoose';
// import wsConnect from './wsConnect';
import mongo from './mongo';
import httpServer from './server';

// Data base
mongo.connect();

// http Server
// const port = process.env.PORT || 4000;
// httpServer.listen( {port}, () => {
//     console.log(`Listening on http://localhost:${port}`);
// });

// const app = express();
// const server = http.createServer(app);
// const wss = new WebSocket.Server({server}); // WebSocket Server
// const db = mongoose.connection; // database 的變數名稱

// db.once('open', () => {
//   //
//   console.log("MongoDB connected!");
//   // Define ws format for client side 
//   wss.on('connection', (ws) => {
//     ws.box = '';
//     ws.onmessage = wsConnect.onMessage(wss, ws);
//     // ws.onmessage = (data) => {console.log(data)};
//     // ws.onopen = () => {console.log("WebSocket is connected.")};
//     // ws.onclose = () => {console.log("WebSocket close connection.")};
//   });
// });
