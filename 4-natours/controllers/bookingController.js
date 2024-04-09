/* eslint-disable no-use-before-define */
const axios = require('axios');
const cron = require('node-cron');
const Tour = require('../models/tourModel');
const catchAsync = require('../Utils/catchAsync');
const AppError = require('../Utils/appError');
const {
  paystackInitializeEndpoint,
  paystackConfirmEndpoint,
  BookingStatus,
} = require('../constants/appConstants');
const Booking = require('../models/bookingModel');

let cronReference = null;

const confirmBookingStatus = async (transactionReference, bookingId) => {
  // get the reference code, user id and tour id from the request
  const booking = await Booking.findById(bookingId);
  // go through the bookings to get a booking that has a user id of the user and task id of that user.
  // make an api call to paystack to confirm the status of the payment
  // update the booking status as required
  if (booking && booking.status === BookingStatus.success) {
    cronReference.stop();
  } else {
    const result = await axios.get(
      `${paystackConfirmEndpoint}/${transactionReference}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        },
      },
    );
    const { data } = result.data;
    if (data.status === 'success') {
      booking.status = BookingStatus.success;
      await booking.save();
      cronReference.stop();
    } else if (data.status === 'failed') {
      booking.status = BookingStatus.failed;
      await booking.save();
      cronReference.stop();
    }
  }
};

function cronJob(transactionReference, id) {
  return cron.schedule('*/1 * * * *', async () => {
    confirmBookingStatus(transactionReference, id);
  });
}

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
    const response = await axios.post(paystackInitializeEndpoint, body, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      },
    });
    const booking = await Booking.create({
      tour: tour.id,
      user: req.user.id,
      reference: response.data.data.reference,
      status: 'pending',
      price: amount,
    });
    cronReference = cronJob(response.data.data.reference, booking.id);
    cronReference.start();
    res.status(200).json({
      status: 'success',
      data: response.data,
    });
  } finally {
    //
  }
  // create session as response
});
