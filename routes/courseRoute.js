const express = require('express');
const Course = require('../models/Course');
const advancedResults = require('../middlewares/advancedResults');

const {
  getCourses,
  getCourse,
  addCourse,
  updateCourse,
  deleteCourse,
} = require('../controllers/courseController');

// Merge route
const router = express.Router({ mergeParams: true });

router
  .route('/')
  .get(
    advancedResults(Course, {
      path: 'bootcamp',
      select: 'name description',
    }),
    getCourses
  )
  .post(addCourse);

router.route('/:id').get(getCourse).patch(updateCourse).delete(deleteCourse);

module.exports = router;
