const mongoose = require('mongoose');
const slugify = require('slugify');

const toursSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a name'],
      unique: true,
      trim: true,
      maxLength: [40, 'A tour must have less than or equal to 40 characters'],
      minLength: [
        10,
        'A tour must have greater than or equal to 10 characters',
      ],
    },
    slug: {
      type: String,
    },
    duration: {
      type: Number,
      required: [true, 'A tour must have a duration'],
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'A tour must have a max group size'],
    },
    difficulty: {
      type: String,
      required: [true, 'A tour must have a difficulty'],
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message:
          'Difficulty is either easy, medium or difficult you entered "{VALUE}"',
      },
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must be above 1.0'],
      max: [5, 'Rating must be below 5.0'],
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, 'A tour must have a price'],
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function (val) {
          // this only points to current doc on NEW document creation
          return val < this.price;
        },
        message: 'Discount price ({VALUE}) should be below the price',
      },
    },
    summary: {
      type: String,
      trim: true,
      required: [true, 'A tour must have a summary'],
    },
    description: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String,
      required: [true, 'A tour must have a cover image'],
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    startDates: [Date],
    secretTour: {
      type: Boolean,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);
toursSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7;
});
//DOCUMENT MIDDLEWARE: runs before .save() on document and .create()
toursSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});
// toursSchema.pre('save', function (next) {
//   next();
// });

// toursSchema.post('save', function (doc, next) {
//   console.log(doc);
//   next();
// });

// QUERY MIDDLEWARE
// toursSchema.pre('find', function (next) {
// all the strings that start with 'find' using a regular expression
toursSchema.pre(/^find/, function (next) {
  this.find({ secretTour: { $ne: true } });
  this.start = Date.now();
  next();
});
// toursSchema.post(/^find/, function (docs, next) {
//   console.log(`query took ${Date.now() - this.start} in milliseconds`);
//   console.log(docs);
//   next();
// });

// AGGREGATION MIDDLEWARE
toursSchema.pre('aggregate', function (next) {
  // this.pipeline() returns an array of the aggregation pipeline
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
  next();
});
const Tour = mongoose.model('Tour', toursSchema);

module.exports = Tour;
