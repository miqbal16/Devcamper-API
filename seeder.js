const dotenv = require('dotenv');
const mongoose = require('mongoose');
const colors = require('colors');
const fs = require('fs');

dotenv.config({ path: './config.env' });

// LOAD MODELS
const Bootcamp = require('./models/Bootcamp');
const Course = require('./models/Course');

// DATABASE
const DB = process.env.MONGO_URI.replace('<PASSWORD>', process.env.DB_PASSWORD);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .catch((err) => console.log(err.message.red));

// IMPORT DATA
const bootcamps = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/bootcamps.json`, 'utf-8')
);

const courses = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/courses.json`, 'utf-8')
);

// FUNCTION ACTION SEEDER
const importData = async () => {
  try {
    await Bootcamp.create(bootcamps);
    await Course.create(courses);
    console.log('Data Imported...'.green.inverse);
    process.exit();
  } catch (err) {
    console.log(err.stack.red);
    process.exit(1);
  }
};

const deleteData = async () => {
  try {
    await Bootcamp.deleteMany();
    await Course.deleteMany();
    console.log('Data Destroyed...'.red.inverse);
    process.exit();
  } catch (err) {
    console.log(err.stack.red);
    process.exit(1);
  }
};

console.log(process.argv[2]);

if (process.argv[2] === '-i') {
  importData();
} else if (process.argv[2] === '-d') {
  deleteData();
}
