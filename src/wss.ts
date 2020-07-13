import socketIo, { Server } from 'socket.io';
import http from 'http';
let wss: Server

export function init(server: http.Server) {
    wss = socketIo(server)
};

export function serverIo(): Server {
    return wss;
};
