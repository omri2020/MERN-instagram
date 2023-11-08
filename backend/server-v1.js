const mongoose = require("mongoose");
const dotenv = require("dotenv");
const app = require("./app");
const http = require('http');
const setupSocketIO = require("./socket");
const server = http.createServer(app);
const io = setupSocketIO(server);

dotenv.config({ path: "config.env" });

app.set('io', io);

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
  });

const port = process.env.PORT || 5000;

server.listen(port, () => console.log(`Server running at http://localhost:${port}`));
