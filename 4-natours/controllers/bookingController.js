const axios = require('axios');
const Tour = require('../models/tourModel');
const catchAsync = require('../Utils/catchAsync');
const AppError = require('../Utils/appError');

exports.getCheckoutSession = catchAsync(async (req, res, next) => {
  // 1 get the currently booked tour
  const tour = await Tour.findById(req.params.tourId);
  // create a checkout session?
  try {
    const { email, amount } = req.body;
    if (!email || !amount) {
      throw new AppError('Please enter an email address and amount', 400);
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
        res.status(200).json({
          status: 'success',
          data: {
            data: response.data,
          },
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
