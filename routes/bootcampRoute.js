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

// PROTECT ROUTE
const { protect, authorize } = require('../middlewares/auth');

// Re-route into other resource router (nested routes)
router.use('/:bootcampId/courses', courseRouter);

// eslint-disable-next-line prettier/prettier
router
  .route('/')
  .get(advancedResults(Bootcamp, 'courses'), getBootcamps)
  .post(protect, authorize('publisher', 'admin'), createNewBootcamp);

router.route('/radius/:zipcode/:distance').get(getBootcampInRadius);

router
  .route('/:id/photo')
  .patch(protect, authorize('publisher', 'admin'), bootcampPhotoUpload);

router
  .route('/:id')
  .get(getBootcamp)
  .patch(protect, authorize('publisher', 'admin'), updateBootcamp)
  .delete(protect, authorize('publisher', 'admin'), deleteBootcamp);

module.exports = router;
