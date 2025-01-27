const express = require("express");
const logger = require("morgan");
const cors = require("cors");
const helmet = require("helmet");

const usersRouter = require("./routes/api/users");
const contactsRouter = require("./routes/api/contacts");

const app = express();

const formatsLogger = app.get("env") === "development" ? "dev" : "short";

app.use(express.static("public"));

app.use(helmet());

app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());

app.use("/api/users", usersRouter);
app.use("/api/contacts", contactsRouter);

app.use((_req, res) => {
  res.status(404).json({ status: "error", code: 404, message: "Not found" });
});

app.use((err, _req, res, _next) => {
  if (err.name === "ValidationError") {
    return res.status(400).json({
      status: "error",
      code: 400,
      message: err.message,
    });
  }

  console.log(err.name);

  res.status(500).json({ status: "error", code: 500, message: err.message });
});

module.exports = app;
