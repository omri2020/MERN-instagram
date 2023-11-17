const { Server } = require("socket.io");
const { verifyToken } = require("./controllers/authController");
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
        return next(new AppError("Authentication error"));
      }
    } catch (err) {
      return next(new AppError("Authentication error"));
    }
  });

  // Listen for socket connections
  io.on("connection", (socket) => {
    // When a user is authenticated, add their socket to the map
    if (socket.user && socket.user._id) {
      socketMap[socket.user._id] = socket;
      console.log(
        `Socket connected with user ${socket.user.username} and added to socketMap`,
      );
    }

    socket.on("readyForMessages", () => {
      if (!socket.user || !socket.user.username) {
        console.error("User data not available on socket.");
        return; // Exit the function if user is not defined
      }
      io.emit("userLoggedIn", { username: socket.user.username });
      console.log(`User ${socket.user.username} is ready for messages`);
    });

    socket.on("pong", () => {
      console.log(`Pong received from ${socket.id}`);
    });

    socket.on("joinChat", (chatId) => {
      Array.from(socket.rooms).forEach((room) => {
        if (room !== socket.id) {
          socket.leave(room);
        }
      });
      console.log(`User ${socket.user.username} joined chat ${chatId}`);
      socket.join(chatId);
      socket.currentChatId = chatId;
    });

    socket.on("leaveChat", (chatId) => {
      console.log(`User ${socket.user.username} left chat ${chatId}`);
      socket.leave(chatId);
      socket.currentChatId = null;
    });

    socket.on("typing", (chatId) => {
      socket
        .to(chatId)
        .emit("typing", { username: socket.user.username, chatId });
    });

    socket.on("stopped_typing", (chatId) => {
      socket
        .to(chatId)
        .emit("stopped_typing", { username: socket.user.username, chatId });
    });

    socket.on("disconnect_request", () => {
      console.log(`Disconnect request received from ${socket.id}`);
      socket.disconnect(true);
      if (socket.user && socket.user._id) {
        delete socketMap[socket.user._id];
        console.log(`User ${socket.user.username} disconnected upon request`);
      }
    });

    socket.on("disconnect", () => {
      console.log(`Socket disconnect: Socket ${socket.id} disconnected`);
      if (socket.user && socket.user._id) {
        delete socketMap[socket.user._id];
        console.log(
          `Socket disconnect: Socket disconnected with user ${socket.user.username} and removed from socketMap`,
        );
      } else {
        console.log("A socket disconnected");
      }
    });
  });

  setInterval(() => {
    io.emit("ping");
  }, 10000); // every 10 seconds

  return io;
};

function disconnectUserSocket(userId) {
  const socket = socketMap[userId];
  if (socket) {
    socket.disconnect(true);
    console.log(
      `Forcefully disconnected socket ${socket.id} for user ${userId}`,
    );
  }
}

module.exports = { setupSocketIO, socketMap, disconnectUserSocket };
