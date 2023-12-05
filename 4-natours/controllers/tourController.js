const Tour = require('../models/tourModel');

exports.getAllTours = async (req, res) => {
  try {
    // filtering
    const queryObj = { ...req.query };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach((field) => delete queryObj[field]);
    // Advanced filtering
    let queryString = JSON.stringify(queryObj);
    // find occurrence of gte,lt,lte,gt and replace with the mongodb operator (i.e add $ to it's front)
    queryString = queryString.replace(
      /(gte|gt|lte|lt)\b/g,
      (match) => `$${match}`,
    );

    // build query
    const query = Tour.find(JSON.parse(queryString));

    // execute the query
    const tours = await query;

    // return results
    res.status(200).json({
      status: 'success',
      results: tours.length,
      data: {
        tours,
      },
    });

    // {difficulty: 'easy', duration: {$gte: 5}}
    // const tours = await Tour.find()
    //   .where('duration')
    //   .equals(5)
    //   .where('difficulty')
    //   .equals('easy');
  } catch (error) {
    res.status(404).json({
      status: 'fail',
      message: error,
    });
  }
};

// to declare params make it in the pattern "/:{param  name}"
// to make a parameter optional add in a question mark after it's name "/:{param name}?"

exports.getTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);
    res.status(200).json({
      status: 'success',
      data: {
        tour,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error,
    });
  }
};

exports.createTour = async (req, res) => {
  try {
    const newTour = await Tour.create(req.body);
    res.status(201).json({
      status: 'success',
      data: {
        tour: newTour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: 'Invalid data sent',
    });
  }
  // const newTour = new Tour({})
  // newTour.save();
};
exports.updateTour = async (req, res) => {
  const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  try {
    res.status(204).json({
      status: 'success',
      data: {
        tour,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error,
    });
  }
};
exports.deleteTour = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }
};
