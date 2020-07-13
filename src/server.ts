import express from 'express';
import http from 'http';
import cors from 'cors';
import { SECRET } from "./routers/secret";
import { users } from './routers/userRouter'
import { vacations } from './routers/vacationRouter'
import expressJwt from 'express-jwt';
import { init, serverIo } from './wss';
import socketiojwt from 'socketio-jwt';

const PORT = 3001;


const app = express();
const server = http.createServer(app);

init(server);

app.use(express.json());
app.use(cors());
app.use(expressJwt({ secret: SECRET }).unless({ path: ['/users/register', '/users/login'] }));

app.use('/users', users);
app.use('/vacations', vacations);


serverIo().sockets.on('connection', socketiojwt.authorize({ secret: SECRET }))
    .on('authenticated', (socket: any) => {
        const { userType } = socket.decoded_token;
        console.log(userType);
        if (userType === 'user') {
            socket.join('users');
        } else {
            socket.join('admins');
        }
    });



server.listen(PORT, () => console.log(`Server is up at ${PORT}`));