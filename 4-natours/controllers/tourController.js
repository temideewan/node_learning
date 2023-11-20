const fs = require('fs');
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
);

exports.getAllTours = (req, res) => {
  res.status(200).json({
    status: 'success',
    requestedAt: req.requestTime,
    results: tours.length,
    data: {
      tours,
    },
  });
};

// to declare params make it in the pattern "/:{param  name}"
// to make a parameter optional add in a question mark after it's name "/:{param name}?"

exports.getTour = (req, res) => {
  const id = req.params.id * 1;
  const tour = tours.find((tour) => tour.id === id);
  // if(id > tours.length) {
  if (!tour) {
    return res
      .status(404)
      .json({ status: 'failed', data: { message: 'tour not found' } });
  }
  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
};

exports.createTour = (req, res) => {
  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body);

  tours.push(newTour);
  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      res.status(201).json({
        status: 'success',
        data: {
          tour: newTour,
        },
      });
    }
  );
};
exports.updateTour = (req, res) => {
  const id = req.params.id * 1;
  if (id > tours.length) {
    return res
      .status(404)
      .json({ status: 'failed', data: { message: 'tour not found' } });
  }
  res.status(200).json({
    status: 'success',
    data: {
      tour: 'Updated the tour successfully here',
    },
  });
};
exports.deleteTour = (req, res) => {
  const id = req.params.id * 1;
  if (id > tours.length) {
    return res
      .status(404)
      .json({ status: 'failed', data: { message: 'tour not found' } });
  }
  res.status(204).json({
    status: 'success',
    data: null,
  });
};
