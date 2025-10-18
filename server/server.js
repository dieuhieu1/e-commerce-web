const express = require("express");
require("dotenv").config();
const dbConnect = require("./config/dbconnect");
const initRoutes = require("./routes");
const cookerParser = require("cookie-parser");
const cors = require("cors");
const port = process.env.PORT || 3000;

const app = express();

// Middleware
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    methods: ["POST", "PUT", "DELETE", "GET"],
    credentials: true,
  })
);
// Parse Cookie bodies
app.use(cookerParser());
// Parse JSON bodies (as sent by API clients)
app.use(express.json());
// Parse URL-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded({ extended: true }));

// DB Connection
dbConnect();
// Create sub route for the API
initRoutes(app);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
