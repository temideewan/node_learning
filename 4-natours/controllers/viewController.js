const Tour = require('../models/tourModel');

const catchAsync = require('../Utils/catchAsync');

exports.getOverview = catchAsync(async (req, res, next) => {
  //  get tour data from collection
  const tours = await Tour.find();

  // build template

  // render template using the tour
  res.status(200).render('overview', {
    title: 'All Tours',
    tours,
  });
});

exports.getTour = (req, res) => {
  res.status(200).render('tour', {
    title: 'The Forest Hiker',
  });
};
