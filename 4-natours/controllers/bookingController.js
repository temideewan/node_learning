const axios = require('axios');
const Tour = require('../models/tourModel');
const catchAsync = require('../Utils/catchAsync');
const AppError = require('../Utils/appError');

exports.getCheckoutSession = catchAsync(async (req, res, next) => {
  // 1 get the currently booked tour
  const tour = await Tour.findById(req.params.tourId);
  // create a checkout session?
  try {
    const { email } = req.user;
    const amount = tour.price * 100;
    if (!email || !amount) {
      return next(AppError('Please enter an email address and amount', 400));
    }
    const body = JSON.stringify({
      email,
      amount: amount * 100,
    });
    axios
      .post('https://api.paystack.co/transaction/initialize', body, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        },
      })
      .then((response) => {
        // create a new booking with a status of pending.
        // start a cron job to verify the status of the new booking for every 1 hour
        // if verified, update the status of the new booking to whatever comes back from paystack.
        // cancel the cron job
        res.status(200).json({
          status: 'success',
          data: response.data,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  } finally {
    //
  }
  // create session as response
});

exports.getBookingStatus = catchAsync(async (req, res, next) => {
  // get the reference code, user id and tour id from the request
  // go through the bookings to get a booking that has a user id of the user and task id of that user.
  // make an api call to paystack to confirm the status of the payment
  // update the booking status as required
});
