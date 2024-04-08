/* eslint-disable */
import axios from 'axios';
export const bookTour = async (tourId) => {
  try {
    const response = await axios(`http://127.0.0.1:8000/api/v1/bookings/checkout-session/${tourId}`)
    if(response.data.status === 'success'){
      const paystackResponse = response.data.data;
      return paystackResponse;
    }
    
  } catch (error) {
    console.log(error);
  }
}
