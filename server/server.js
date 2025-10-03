const express = require("express");
require("dotenv").config();
const dbConnect = require("./config/dbconnect");
const initRoutes = require("./routes");
const port = process.env.PORT || 3000;

const app = express();

// Middleware

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
