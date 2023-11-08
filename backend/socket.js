const { Server } = require("socket.io");
const { verifyToken } = require('./controllers/authController');
const AppError = require("./utils/appError");

const socketMap = {};

const setupSocketIO = (server) => {
    const io = new Server(server, {
      cors: {
        origin: ["http://localhost:5173"],
        methods: ["GET", "POST", "PATCH", "DELETE", "PUT", "HEAD"],
        credentials: true,
      },
    });

    // Add a middleware to authenticate users before they can connect to the socket
    io.use(async (socket, next) => {
      try { 
        const token = socket.handshake.query.token;
        const user = await verifyToken(token);
        if (user) {
          socket.user = user;
          return next();
        } else {
          return next(new AppError('Authentication error'));
        } 
      } catch (err) {
        return next(new AppError('Authentication error'));
      }
    })


    // Listen for socket connections
    io.on('connection', (socket) => {
      console.log(`Socket connected with user: ${socket.user.username}`);
       // When a user is authenticated, add their socket to the map
       if (socket.user && socket.user._id) {
        socketMap[socket.user._id] = socket;
        console.log(`Socket connected with user ${socket.user.username} and added to socketMap`);
       }
      
        socket.on('readyForMessages', () => {
          if (!socket.user || !socket.user.username) {
            console.error('User data not available on socket.');
            return; // Exit the function if user is not defined
          }
          io.emit('userLoggedIn', { username: socket.user.username });
          console.log(`User ${socket.user.username} is ready for messages`);
        });
      
        socket.on('disconnect', () => {
          if (socket.user && socket.user._id) {
            delete socketMap[socket.user._id];
            console.log(`Socket disconnected with user ${socket.user.username} and removed from socketMap`);
          } else {
            console.log('A socket disconnected');
          }
        });

      }); 

      return io 
  };
    // Export both the setupSocketIO function and the socketMap
  module.exports = { setupSocketIO, socketMap };
