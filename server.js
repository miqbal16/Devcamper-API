const dotenv = require('dotenv');
const mongoose = require('mongoose');
const colors = require('colors');

dotenv.config({ path: './config.env' });

const app = require('./app');

// DATABASE
const DB = process.env.MONGO_URI.replace('<PASSWORD>', process.env.DB_PASSWORD);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((conn) => {
    console.log(
      `${conn.connection.host} has been successfuly connected`.cyan.underline
        .bold
    );
  });

// START SERVER
const port = process.env.PORT || 8080;
const server = app.listen(
  port,
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${port}`.yellow.bold
  )
);

// Handler unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`.red);

  // close server & process exit
  server.close(() => process.exit(1));
});
