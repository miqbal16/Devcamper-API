const express = require('express');
const morgan = require('morgan');
const fileupload = require('express-fileupload');
const errorHandler = require('./middlewares/error');

// IMPORT ROUTER
const bootcampRouter = require('./routes/bootcampRoute');
const courseRouter = require('./routes/courseRoute');

const app = express();

// USING MIDDLEWARE
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// FILE UPLOADING
app.use(fileupload());

app.use(express.json());
app.use(express.static(`${__dirname}/public`));

// ROUTER
app.use('/api/v1/bootcamps', bootcampRouter);
app.use('/api/v1/courses', courseRouter);

// ERROR HANDLER MIDDLEWARE
app.use(errorHandler);

module.exports = app;
