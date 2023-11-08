const { Server } = require("socket.io");
const { verifyToken } = require('./controllers/authController');
const AppError = require("./utils/appError");

const setupSocketIO = (server) => {
    const io = new Server(server, {
      cors: {
        origin: ["http://localhost:5173"],
        methods: ["GET", "POST", "PATCH", "DELETE", "PUT", "HEAD"],
        credentials: true,
      },
    });

    io.use(async (socket, next) => {
        // Parse the cookie to retrieve the token
        const token = socket.handshake.headers.cookie;
        const jwt = token?.split('; ').find(row => row.startsWith('token='))?.split('=')[1];
        if (jwt) {
          try {
            const user = await verifyToken(jwt); // Implement verifyToken to decode and verify your JWT
            if (user) {
              socket.user = user;
              console.log('Socket connected with user:', socket.user?.username);
              return next();
            }
          } catch (err) {
            console.error('Token verification failed:', err);
          }
        }
        return next(new AppError('Authentication error'));        
      });

      io.on('connection', (socket) => {
        console.log('A user connected:', socket.user.username);
      
        socket.on('readyForMessages', () => {
          io.emit('userLoggedIn', { username: socket.user.username })
        });
      
        socket.on('disconnect', () => {
          if (socket.user) {
            console.log('User disconnected:', socket.user.username);
          } else {
            console.log('A socket disconnected, but user was not set');
          }
        });
      });

      return io 
    }; 

  
  module.exports = setupSocketIO;