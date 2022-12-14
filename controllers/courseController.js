const Course = require('../models/Course');
const asyncHandler = require('../middlewares/asyncHandler');
const ErrorResponse = require('../utils/ErrorResponse');
const Bootcamp = require('../models/Bootcamp');

// @desc        Get All Courses
// @route 1     GET /api/v1/courses
// @route 2     GET /api/v1/bootcamps/:bootcampId/course
// @access      Public
exports.getCourses = asyncHandler(async (req, res, next) => {
  if (req.params.bootcampId) {
    const courses = await Course.find({ bootcamp: req.params.bootcampId });

    return res.status(200).json({
      status: 'success',
      count: courses.length,
      data: courses,
    });
  } else {
    res.status(200).json(res.advancedResults);
  }
});

// @desc        Get Single Course
// @route 1     GET /api/v1/courses/:id
// @route 2     GET /api/v1/bootcamps/:bootcampId/courses/:id
// @access      Public
exports.getCourse = asyncHandler(async (req, res, next) => {
  const course = await Course.findById(req.params.id);

  if (!course)
    return next(
      new ErrorResponse(`Course not found with id of ${req.params.id}`, 404)
    );

  res.status(200).json({
    status: 'success',
    data: { course },
  });
});

// @desc        Add Course
// @route       POST /api/v1/bootcamps/:bootcampId/courses
// @access      Private
exports.addCourse = asyncHandler(async (req, res, next) => {
  req.body.bootcamp = req.params.bootcampId;

  const bootcamp = await Bootcamp.findById(req.params.bootcampId);

  if (!bootcamp)
    return next(
      new ErrorResponse(`No bootcamp with id of ${req.params.bootcampId}`, 404)
    );

  const course = await Course.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      course,
    },
  });
});

// @desc        Update Course
// @route       PATCH /api/v1/courses/:id
// @access      Private
exports.updateCourse = asyncHandler(async (req, res, next) => {
  const course = await Course.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!course)
    return next(
      new ErrorResponse(`Course not found with id of ${req.params.id}}`, 404)
    );

  res.status(200).json({
    status: 'success',
    data: { course },
  });
});

// @desc        Delete Course
// @route       DELETE /api/v1/courses/:id
// @access      Private
exports.deleteCourse = asyncHandler(async (req, res, next) => {
  const course = await Course.findById(req.params.id);

  if (!course)
    return next(
      new ErrorResponse(`Course not found with id of ${req.params.id}`)
    );

  course.remove();

  res.status(204).json({
    status: 'success',
    data: null,
  });
});
