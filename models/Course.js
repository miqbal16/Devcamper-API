const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a course title'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Please add a course description'],
  },
  weeks: {
    type: String,
    required: [true, 'Please add a number of weeks'],
  },
  tuition: {
    type: Number,
    required: [true, 'Please add a tuition cost'],
  },
  minimumSkill: {
    type: String,
    required: [true, 'Please add a minimum skill'],
    enum: ['beginner', 'intermediate', 'advanced'],
  },
  scholarshipAvailable: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  bootcamp: {
    type: mongoose.Schema.ObjectId,
    ref: 'Bootcamp',
    required: true,
  },
});

// Static Method To Get Average Cost Tuitions
courseSchema.statics.getAverageCost = async function (bootcampId) {
  const obj = await this.aggregate([
    {
      $match: { bootcamp: bootcampId },
    },
    {
      $group: {
        _id: '$bootcamp',
        averageCost: { $avg: '$tuition' },
      },
    },
  ]);

  try {
    await this.model('Bootcamp').findByIdAndUpdate(bootcampId, {
      averageCost: Math.ceil(obj[0].averageCost / 10) * 10,
    });
  } catch (err) {
    console.error(err);
  }
};

// Call getAverageCost After Save
courseSchema.post('save', function () {
  this.constructor.getAverageCost(this.bootcamp);
});

// Call getAverageCost Before Remove
courseSchema.pre('remove', function () {
  this.constructor.getAverageCost(this.bootcamp);
});

module.exports = mongoose.model('Course', courseSchema);
