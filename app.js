const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const fileupload = require('express-fileupload');
const errorHandler = require('./middlewares/error');

// IMPORT ROUTER
const bootcampRouter = require('./routes/bootcampRoute');
const courseRouter = require('./routes/courseRoute');
const authRouter = require('./routes/authRoute');

const app = express();

// USING MIDDLEWARE
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// FILE UPLOADING
app.use(fileupload());

app.use(express.json());
app.use(express.static(`${__dirname}/public`));
app.use(cookieParser());

// ROUTER
app.use('/api/v1/bootcamps', bootcampRouter);
app.use('/api/v1/courses', courseRouter);
app.use('/api/v1/auth', authRouter);

// ERROR HANDLER MIDDLEWARE
app.use(errorHandler);

module.exports = app;
