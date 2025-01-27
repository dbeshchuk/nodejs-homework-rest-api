const mongoose = require("mongoose");
require("dotenv").config();

let uri;

if (process.env.NODE_ENV == "test") {
  uri = process.env.MONGO_TEST_URL;
} else {
  uri = process.env.MONGO_URL;
}

const db = mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.on("connected", () => {
  console.log("Database connection successful");
});

mongoose.connection.on("error", (err) => {
  console.log(`Mongoose connection error: ${err.message}`);
});

process.on("SIGINT", async () => {
  await mongoose.connection.close();
  console.log("Connection to DB closed");
  process.exit();
});

module.exports = db;
