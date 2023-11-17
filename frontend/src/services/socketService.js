import { io } from "socket.io-client";
import { getToken } from "./tokenService";

export const connectSocket = () => {
  console.log("Attempting to connect socket...");

  const socket = io("http://localhost:5000", {
    withCredentials: true,
    query: {
      token: getToken(),
    },
  });

  socket.on("connect", () => {
    console.log("Socket.IO connected!", socket);
  });

  return socket;
};

// export const disconnectSocket = (socket) => {
//   if (socket) {
//     console.log("Disconnecting socket...");
//     socket.off();
//     socket.disconnect();
//   }
// };

export const disconnectSocket = (socket) => {
  if (socket) {
    console.log(`Disconnecting socket with ID ${socket.id}...`);
    socket.emit("disconnect_request");
  }
};
