const mongoose = require("mongoose");
const dotenv = require("dotenv");
const app = require("./app");
const http = require('http');
const { setupSocketIO, socketMap } = require("./socket");  // Adjusted path for modified socket.js
const server = http.createServer(app);
const io = setupSocketIO(server);

dotenv.config({ path: "config.env" });

app.set('io', io);
app.set('socketMap', socketMap); 

const DB = process.env.DATABASE.replace(
  "<password>",
  process.env.MONGODB_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
  })
  .then(() => {
    console.log("DB connection successful");
  })
  .catch((err) => {
    console.log("DB connection error:", err);
  });

const port = process.env.PORT || 5000;

server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
  console.log(`Socket.IO running at http://localhost:${port}`);
});
