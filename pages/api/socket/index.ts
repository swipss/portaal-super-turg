import { Server } from 'socket.io';

const SocketHandler = (req, res) => {
  const users = {};
  if (res.socket.server.io) {
    console.log('Socket is already running');
  } else {
    console.log('Socket is initializing');
    const io = new Server(res.socket.server);
    res.socket.server.io = io;

    io.on('connection', (socket) => {
      socket.on('disconnect', () => {
        console.log('DISCONNECTED');
        console.log('user ' + users[socket.id] + ' disconnected');
        delete users[socket.id];
        console.log(users);
      });

      socket.on('login', (id) => {
        console.log('user ' + id + ' connected');
        if (!Object.values(users).includes(id)) {
          users[socket.id] = id;
        }
        console.log(users);
      });

      socket.on('get-online-users', () => {
        console.log('HERE');
        socket.emit('online-users', users);
      });
    });
  }
  res.end();
};

export const config = {
  api: {
    bodyParser: false,
  },
};

export default SocketHandler;
