exports.maxLoginRetries = 5;

exports.validUpdateProperties = ['name', 'email'];

exports.anHourAgo = Date.now() - 60 * 60 * 1000;

exports.whiteListedParams = [
  'duration',
  'ratingsQuantity',
  'ratingsAverage',
  'maxGroupSize',
  'difficulty',
  'price',
];
