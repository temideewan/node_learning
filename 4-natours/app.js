const express = require('express');
const morgan = require('morgan');
const tourRouter = require("./routes/tourRoutes")
const userRouter = require("./routes/userRoutes")

const app = express();
// MIDDLEWARES
app.use(express.json());
app.use(morgan('dev'));

app.use((req, res, next) => {
  console.log('Hello from the middleware 👋');
  next();
});

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});


// ROUTES
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

// SERVER
module.exports = app;


// 201 stands for something new is created
// 204 stands for no content
