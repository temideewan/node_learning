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

exports.paystackInitializeEndpoint =
  'https://api.paystack.co/transaction/initialize';
exports.paystackConfirmEndpoint = 'https://api.paystack.co/transaction/verify';

exports.BookingStatus = {
  success: 'success',
  pending: 'pending',
  failed: 'failed',
};
