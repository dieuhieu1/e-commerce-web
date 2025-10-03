const { default: mongoose } = require("mongoose");

const dbConnect = async () => {
  try {
    const conn = await mongoose.connect(process.env.DB_URL);
    // Check if the connection is connected mean the readyState equal 1
    if (conn.connection.readyState == 1) {
      console.log("DB connected is sucessfully!");
    } else {
      console.log("DB connecting...");
    }
  } catch (error) {
    console.log("DB connection is failed!");
    throw new Error(error);
  }
};

module.exports = dbConnect;
