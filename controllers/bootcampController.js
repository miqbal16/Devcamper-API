const path = require('path');
const ErrorResponse = require('../utils/ErrorResponse');
const Bootcamp = require('../models/Bootcamp');
const asyncHandler = require('../middlewares/asyncHandler');
const geocoder = require('../utils/geocoder');

// @desc        Get All Bootcamps
// @router      GET /api/v1/bootcamps
// @access      Public
exports.getBootcamps = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

// @desc        Get Single Bootcamp
// @route       GET /api/v1/bootcamps/:id
// @access      Public
exports.getBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id).populate('courses');

  if (!bootcamp)
    return next(
      new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
    );

  res.status(200).json({
    status: 'success',
    data: {
      bootcamp,
    },
  });
});

// @desc        Create New Bootcamp
// @route       POST /api/v1/bootcamps
// @access      Private
exports.createNewBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      bootcamp,
    },
  });
});

// @desc        Update Bootcamp
// @route       PATCH /api/v1/bootcamps/:id
// @access      Private
exports.updateBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!bootcamp)
    return next(
      new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
    );

  res.status(200).json({
    status: 'success',
    data: {
      bootcamp,
    },
  });
});

// @desc        Delete Bootcamp
// @route       DELETE /api/v1/bootcamps/:id
// @access      Private
exports.deleteBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);

  if (!bootcamp)
    return next(
      new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
    );

  bootcamp.remove();

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

// @desc      Get Bootcamp within a radius
// @route     GET /api/v1/bootcamps/radius/:zipcode/:distance
// @access    Public
exports.getBootcampInRadius = asyncHandler(async (req, res, next) => {
  const { zipcode, distance } = req.params;

  // Get ltd/lng from geocoder
  const loc = await geocoder.geocode(zipcode);
  const lat = loc[0].latitude;
  const lng = loc[0].longitude;

  // Calc Radius using radians
  // Divide dist by radius of earth
  // Earth radius = 3.959 mi / 6.371 km

  const radius = distance / 3959;

  const bootcamps = await Bootcamp.find({
    location: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
  });

  res.status(200).json({
    status: 'success',
    count: bootcamps.length,
    data: {
      bootcamps,
    },
  });
});

// @desc      Upload Photo For Bootcamp
// @route     PATCH /api/v1/bootcamps/:id/photo
// @access    Private
exports.bootcampPhotoUpload = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);

  if (!bootcamp)
    return next(
      new ErrorResponse(`No bootcamp found with id of ${req.params.id}`, 404)
    );

  if (!req.files) return next(new ErrorResponse(`Please upload a photo`, 400));

  const { photo } = req.files;

  // MAKE SURE THE IMAGE IS A PHOTO
  if (!photo.mimetype.startsWith('image')) {
    return next(new ErrorResponse(`Please upload an image file`, 400));
  }

  // MAKE SURE THE IMAGE SIZE IS LOWER THEN OR EQUAL FROM 5 MB
  if (photo.size > process.env.MAX_FILE_UPLOAD) {
    return next(
      new ErrorResponse(
        `Please upload an image less then ${
          process.env.MAX_FILE_UPLOAD / 1000000
        } mb`,
        400
      )
    );
  }

  // CREATE COSTUME NAME
  photo.name = `photo_${bootcamp._id}${path.parse(photo.name).ext}`;

  // SAVE IMAGE UPLOAD
  photo.mv(`${process.env.FILE_UPLOAD_PATH}/${photo.name}`, async (err) => {
    if (err) {
      console.error(err);
      return next(new ErrorResponse(`Problem with file upload`, 500));
    }

    await Bootcamp.findByIdAndUpdate(req.params.id, {
      photo: photo.name,
    });

    res.status(200).json({
      status: 'success',
      data: {
        photo: photo.name,
      },
    });
  });
});
