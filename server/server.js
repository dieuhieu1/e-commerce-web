const express = require("express");
const { default: mongoose } = require("mongoose");
require("dot.env").config();
const port = process.env.PORT || 3000;

const server = express();

mongoose.connect("mongodb://localhost:27017/").then(() => {
  console.log("Connected to MongoDB");
});

// Middleware

// Parse JSON bodies (as sent by API clients)
server.use(express.json());
// Parse URL-encoded bodies (as sent by HTML forms)
server.use(express.urlencoded({ extended: true }));

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
