/* eslint-disable */
import { login, logout } from './login';
import { updateSettings } from './updateSettings';
import { displayMaps } from './mapbox';
import { bookTour } from './booking';

// DOM ELEMENTS
const mapBox = document.getElementById('map');
const loginForm = document.querySelector('.form--login');
const logoutButton = document.querySelector('.nav__el--logout');
const updateAccountForm = document.querySelector('.form-user-data');
const updatePasswordForm = document.querySelector('.form-user-settings');
const bookingButton = document.getElementById('book-tour');

// DELEGATIONS
if (mapBox) {
  const locations = JSON.parse(mapBox.dataset.locations);
  displayMaps(locations);
}

if (loginForm) {
  loginForm.addEventListener('submit', function (event) {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    event.preventDefault();
    login(email, password);
  });
}
if (updateAccountForm) {
  updateAccountForm.addEventListener('submit', function (event) {
    event.preventDefault();
    const form = new FormData();
    form.append('name', document.getElementById('name').value)
    form.append('email', document.getElementById('email').value)
    form.append('photo', document.getElementById('photo').files[0])
    updateSettings(form, 'data');
  });
}
if (updatePasswordForm) {
  updatePasswordForm.addEventListener('submit', async function (event) {
    document.querySelector('.btn--save-password').textContent = 'Updating...'
    event.preventDefault();
    const passwordCurrent = document.getElementById('password-current').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('password-confirm').value;
    await updateSettings(
      { password, passwordCurrent, passwordConfirm },
      'password',
      );
      document.getElementById('password-current').value = '';
      document.getElementById('password').value = '';
      document.getElementById('password-confirm').value = '';
      document.querySelector('.btn--save-password').textContent = 'Save password'
  });
}

if (logoutButton) {
  logoutButton.addEventListener('click', logout);
}

if(bookingButton){
  bookingButton.addEventListener('click', async(e) => {
    e.target.textContent = 'Processing...';
    const {tourId} = e.target.dataset;
    try{
      const response = await bookTour(tourId);
      if(response.status){
        console.log(response.data);
        window.open(response.data.authorization_url, '_blank');
        e.target.textContent = 'BOOK TOUR NOW!';
      }
    } catch(e) {
      console.log(e);
    }

  });
}
