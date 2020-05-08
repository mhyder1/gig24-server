require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const helmet = require("helmet");
const { NODE_ENV } = require('./config')
const errorHandler = require('./error-handler')
const eventsRouter = require('./events/events-router')
const usersRouter = require('./users/users-router')


const app = express();
const morganOption = (NODE_ENV === 'production') ? "tiny" : "common";

app.use(morgan(morganOption));
app.use(cors());
app.use(helmet());

app.use('/api/events', eventsRouter);
app.use('/api/users', usersRouter);

app.get("/", (req, res) => {
  res.send("Hello, world!");
});



app.use(errorHandler)

module.exports = app;
