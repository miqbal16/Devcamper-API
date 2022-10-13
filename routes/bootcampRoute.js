const express = require('express');
const advancedResults = require('../middlewares/advancedResults');
const Bootcamp = require('../models/Bootcamp');

const {
  getBootcamps,
  createNewBootcamp,
  getBootcamp,
  updateBootcamp,
  deleteBootcamp,
  getBootcampInRadius,
  bootcampPhotoUpload,
} = require('../controllers/bootcampController');

// Include other resource router
const courseRouter = require('./courseRoute');

const router = express.Router();

// Re-route into other resource router (nested routes)
router.use('/:bootcampId/courses', courseRouter);

// eslint-disable-next-line prettier/prettier
router
  .route('/')
  .get(advancedResults(Bootcamp, 'courses'), getBootcamps)
  .post(createNewBootcamp);

router.route('/radius/:zipcode/:distance').get(getBootcampInRadius);

router.route('/:id/photo').patch(bootcampPhotoUpload);

router
  .route('/:id')
  .get(getBootcamp)
  .patch(updateBootcamp)
  .delete(deleteBootcamp);

module.exports = router;
