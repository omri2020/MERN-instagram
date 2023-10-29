import { io } from "socket.io-client";

let socket;

export const connectSocket = (token) => {
  socket = io("http://localhost:5000", {
    withCredentials: true,
    query: {
      token,
    },
  });

  socket.on("connect", () => {
    console.log("Socket.IO connected!");
  });
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
  }
};

export const getSocket = () => socket;

export default socket;
